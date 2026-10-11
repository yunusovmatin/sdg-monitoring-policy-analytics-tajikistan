"""New canonical reports from pinned legacy evidence; not recovered historical sources.

Run: python -m pip install -r scripts/requirements-reports.txt
     python scripts/generate_reports.py --evidence ../evidence/reports
Outputs use the current-definition candidate for review, never production promotion.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import html
import io
import json
import re
from pathlib import Path
from decimal import Decimal
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
RELEASE_ID = 'wdi-2026-10-11-candidate'
RELEASE = ROOT / 'data/releases' / RELEASE_ID
SNAPSHOT = RELEASE / 'observations.csv'
OUTPUT = ROOT / 'client/public/reports'
REVIEWED_CANDIDATE_HASH = '2491a8a141078d7ed62ce6306236837127f2c531d6066f5a81596e137aa2c5ae'

def load_evidence():
    raw = SNAPSHOT.read_bytes()
    # Candidate manifest records LF artifact hashes; git checkout may use CRLF.
    digest = hashlib.sha256(raw.replace(b'\r\n', b'\n')).hexdigest()
    if digest != REVIEWED_CANDIDATE_HASH:
        raise ValueError('Candidate source changed: review new dataset before regenerating reports')
    manifest = json.loads((RELEASE/'manifest.json').read_text(encoding='utf-8'))
    assert manifest['release_id'] == RELEASE_ID
    rows = list(csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))))
    assert len(rows) == 2315
    assert len({r['indicator_code'] for r in rows}) == 17
    assert len({r['country_code'] for r in rows}) == 6
    index = {(r['country_code'], r['indicator_code'], int(r['year'])): r for r in rows}
    assert len(index) == len(rows)
    def value(code, year=2023, country='TJK'):
        return Decimal(index[(country, code, year)]['value'])
    poverty, youth, total, pop = (value(c) for c in ('SI.POV.NAHC', 'SL.UEM.1524.ZS', 'SL.UEM.TOTL.ZS', 'SP.POP.TOTL'))
    assert poverty.quantize(Decimal('.1')) == Decimal('20.4') and youth.quantize(Decimal('.001')) == Decimal('14.511')
    assert total.quantize(Decimal('.001')) == Decimal('7.037') and pop == 10389799
    baseline_codes = ('SI.POV.NAHC','SL.UEM.1524.ZS','SP.POP.TOTL')
    common_years = set.intersection(*[{int(r['year']) for r in rows if r['country_code']=='TJK' and r['indicator_code']==code and int(r['year'])<=2030} for code in baseline_codes])
    baseline_year = max(common_years)
    assert baseline_year == 2024
    scenario_poverty,scenario_youth,scenario_pop = (value(code,baseline_year) for code in baseline_codes)
    # Independent Decimal implementation of the declared educational arithmetic.
    cohorts, h, success = Decimal(2030-baseline_year), Decimal(10000), Decimal('0.3')
    poverty_change = h * cohorts * Decimal('5.5') * success / scenario_pop * 100
    youth_change = h * cohorts * Decimal('0.4') * success / Decimal(800000) * 100
    def bounds(base, change):
        return '-'.join(f'{max(Decimal(0), min(Decimal(100), base-change*m)):.1f}' for m in (Decimal('1.3'),Decimal('0.7')))
    peer_rows = sorted([r for r in rows if r['indicator_code']=='SL.UEM.1524.ZS' and r['year']=='2023'],key=lambda r:Decimal(r['value']),reverse=True)
    assert len(peer_rows) == 6 and peer_rows[2]['country_code']=='TJK'
    means = []
    for start, end in ((2002,2009),(2010,2014),(2015,2023)):
        vals=[Decimal(r['value']) for r in rows if r['country_code']=='TJK' and r['indicator_code']=='BX.TRF.PWKR.DT.GD.ZS' and start<=int(r['year'])<=end]
        assert len(vals)==end-start+1
        means.append(f'{start}-{end}: {sum(vals)/len(vals):.1f}% ({len(vals)} observations)')
    return {'SNAPSHOT_SHA':digest,'ROWS':str(len(rows)),'INDICATORS':'17','COUNTRIES':'6','RELEASE_ID':RELEASE_ID,
        'RETRIEVED_START':min(r['retrieved_at'] for r in manifest['requests']),
        'RETRIEVED_END':max(r['retrieved_at'] for r in manifest['requests']),
        'SCENARIO_YEAR':str(baseline_year),'COHORTS':str(cohorts),
        'SCENARIO_POVERTY':f'{scenario_poverty:.1f}','SCENARIO_YOUTH':f'{scenario_youth:.3f}','SCENARIO_POPULATION':f'{int(scenario_pop):,}',
        'POVERTY':f'{poverty:.1f}','YOUTH':f'{youth:.3f}','TOTAL':f'{total:.3f}',
        'GAP':f'{youth-total:.2f}','POPULATION':f'{int(pop):,}',
        'REMITTANCE':f'{value("BX.TRF.PWKR.DT.GD.ZS"):.1f}',
        'YOUTH_PEERS':'; '.join(f'{r["country_name"]} {Decimal(r["value"]):.3f}%' for r in peer_rows),
        'REMITTANCE_MEANS':'; '.join(means),'EXPECTED_ROWS':'2652','COVERAGE':f'{len(rows)/2652*100:.1f}',
        'POVERTY_RANGE':bounds(scenario_poverty,poverty_change),'YOUTH_RANGE':bounds(scenario_youth,youth_change),
        'CUMULATIVE_INVESTMENT':f'{int(h*500*cohorts):,}'}

def parse_blocks(markdown):
    blocks=[]
    for paragraph in re.split(r'\n\s*\n',markdown.strip()):
        if paragraph.startswith('# '): continue
        if paragraph.startswith('## '): blocks.append({'type':'heading','text':paragraph[3:].strip()})
        elif paragraph.startswith('- '):
            for line in paragraph.splitlines():
                assert line.startswith('- ')
                blocks.append({'type':'bullet','text':line[2:].strip()})
        else: blocks.append({'type':'paragraph','text':' '.join(paragraph.splitlines())})
    return blocks

def generate_pdf(path, title, blocks):
    styles=getSampleStyleSheet()
    styles.add(ParagraphStyle(name='ReportTitle',fontName='Helvetica-Bold',fontSize=23,leading=28,textColor=colors.HexColor('#15344b'),spaceAfter=16))
    styles.add(ParagraphStyle(name='ReportHeading',fontName='Helvetica-Bold',fontSize=12,leading=15,textColor=colors.HexColor('#15344b'),spaceBefore=9,spaceAfter=6,keepWithNext=True))
    styles.add(ParagraphStyle(name='ReportBody',fontName='Helvetica',fontSize=9.5,leading=12.8,spaceAfter=6,splitLongWords=True,alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='ReportBullet',parent=styles['ReportBody'],leftIndent=12,firstLineIndent=-8))
    def clean(text):
        return html.escape(text).replace('&amp;#','&#')
    story=[Paragraph(clean(title),styles['ReportTitle'])]
    for block in blocks:
        style=styles['ReportHeading' if block['type']=='heading' else 'ReportBullet' if block['type']=='bullet' else 'ReportBody']
        story.append(Paragraph(('- ' if block['type']=='bullet' else '')+clean(block['text']),style))
    def footer(canvas,doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#c4d2db'));canvas.line(48,42,A4[0]-48,42)
        canvas.setFont('Helvetica',7);canvas.setFillColor(colors.HexColor('#435565'))
        canvas.drawString(48,30,'Matin Yunusov | Independent review draft | No institutional endorsement')
        canvas.drawRightString(A4[0]-48,30,f'{doc.page}')
        canvas.restoreState()
    SimpleDocTemplate(str(path),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=45,bottomMargin=57,
        title=title,author='Matin Yunusov',subject='Independent prototype; canonical newly authored review report',
        invariant=1).build(story,onFirstPage=footer,onLaterPages=footer)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--evidence',default=None);args=parser.parse_args()
    variables=load_evidence();OUTPUT.mkdir(parents=True,exist_ok=True);receipt={'snapshot_sha256':variables['SNAPSHOT_SHA'],'reports':[]}
    for stem,template in (('policy-brief','POLICY_BRIEF'),('methodology','METHODOLOGY')):
        source=ROOT/f'docs/reports/{template}.md'
        md=source.read_text(encoding='utf-8')
        for key,value in variables.items():md=md.replace('{{'+key+'}}',value)
        assert '{{' not in md and '}}' not in md
        title=md.splitlines()[0][2:];blocks=parse_blocks(md)
        (OUTPUT/f'{stem}.md').write_text(md,encoding='utf-8',newline='\n')
        payload={'title':title,'source':f'docs/reports/{template}.md','dataset_release':RELEASE_ID,'snapshot_sha256':variables['SNAPSHOT_SHA'],'blocks':blocks}
        (OUTPUT/f'{stem}.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
        pdf=OUTPUT/f'{stem}.pdf';generate_pdf(pdf,title,blocks)
        reader=PdfReader(pdf)
        page_texts=[]
        for page in reader.pages:
            page_text=page.extract_text()
            page_text=re.sub(r'Matin Yunusov \| Independent review draft \| No institutional endorsement\s+\d+\s*', '', page_text)
            page_texts.append(page_text)
        text='\n'.join(page_texts)
        normalized=lambda s:re.sub(r'\s+',' ',s).strip()
        # Every canonical block must survive PDF text extraction, not only keywords.
        for block in blocks:
            assert normalized(block['text']) in normalized(text), f'PDF omitted or altered block: {block["text"][:80]}'
        assert variables['SCENARIO_POVERTY'] in text and '14.511' in text and '18.954' not in text
        receipt['reports'].append({'name':stem,'pages':len(reader.pages),'blocks':len(blocks),'pdf_sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'json_sha256':hashlib.sha256((OUTPUT/f'{stem}.json').read_bytes()).hexdigest(),'all_blocks_pdf_text_match':True,'json_markdown_same_source':True,'visual_review':'requires separate rendered-page inspection'})
        if args.evidence:
            evidence=Path(args.evidence);evidence.mkdir(parents=True,exist_ok=True);(evidence/f'{stem}-extracted.txt').write_text(text,encoding='utf-8')
    # Independent geographically disjoint population reconciliation, without WDI scaling.
    regional=list(csv.DictReader((ROOT/'docs/data/regional_population_2024_verified.csv').open(encoding='utf-8')))
    assert len(regional)==5 and sum(Decimal(r['value']) for r in regional)==Decimal('10288.3')
    receipt['regional_primary_components_reconcile_thousand_persons']='10288.3'
    if args.evidence:(Path(args.evidence)/'report-generation-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(receipt,indent=2))

if __name__=='__main__':main()
