"""Build source registries from the checked candidate, without accessing the network."""
import csv
import json
from pathlib import Path
from wdi_pipeline import ROOT, INDICATORS, UNITS, read_csv, save_json

RELEASE = ROOT / 'data/releases/wdi-2026-10-11-candidate'
# These are analyst mappings to official definitions, not certification of WDI as
# the full UNSD disaggregated global series. Context statistics have no exact SDG ID.
MAPPING = {
    'BX.TRF.PWKR.DT.GD.ZS': ('Contextual WDI statistic', 'No exact SDG indicator', 'Remittance inflows / GDP; not remittance transaction costs (10.c.1).', ''),
    'EG.FEC.RNEW.ZS': ('Exact official SDG indicator concept', '7.2.1', 'Share of renewables in total final energy consumption; not electricity generation and not SDG 13.', '07-02-01'),
    'FP.CPI.TOTL.ZG': ('Contextual WDI statistic', 'No exact SDG indicator', 'Annual CPI change; negative inflation is possible.', ''),
    'NY.GDP.MKTP.KD.ZG': ('SDG-aligned proxy', '8.1 (proxy; not 8.1.1)', 'Aggregate real GDP growth; official 8.1.1 uses real GDP per capita growth.', '08-01-01'),
    'NY.GDP.PCAP.KD': ('Contextual WDI statistic', '8.1 context', 'Real GDP per capita level in constant 2015 US dollars; not PPP dollars, not growth.', '08-01-01'),
    'SE.SEC.ENRR': ('Contextual WDI statistic', '4 context; no exact indicator', 'Gross secondary enrollment numerator includes pupils of any age; can exceed 100%; not completion or learning achievement.', ''),
    'SI.DST.FRST.20': ('SDG-aligned proxy', '10.1 context; not 10.1.1', 'Bottom 20% income share level; official 10.1.1 measures bottom 40% per-capita welfare growth.', '10-01-01'),
    'SI.POV.DDAY': ('Exact official SDG indicator concept; aggregate only', '1.1.1', 'Current WDI $3.00/day 2021 PPP; original $2.15 label cannot authenticate archived numeric vintage. Full SDG disaggregation absent.', '01-01-01a'),
    'SI.POV.GINI': ('SDG-aligned proxy', '10 inequality context; no exact indicator', 'Gini distribution index 0–100; survey welfare concepts differ; not a growth statistic.', '10-01-01'),
    'SI.POV.LMIC': ('SDG-aligned proxy', '1 poverty context; not 1.1.1', 'Current WDI $4.20/day 2021 PPP; original $3.65 label cannot authenticate archived numeric vintage. This higher threshold is not SDG extreme poverty 1.1.1.', '01-01-01a'),
    'SI.POV.NAHC': ('Exact official SDG indicator concept; aggregate only', '1.2.1', 'National poverty-line population share; national definitions differ and do not supply full sex/age disaggregation.', '01-02-01'),
    'SL.TLF.CACT.ZS': ('Contextual WDI statistic', '8 labour-market context', 'Modeled ILO estimate; labour force / population ages15+; not unemployment denominator.', '08-05-02'),
    'SL.UEM.1524.ZS': ('SDG-aligned proxy / age disaggregation', '8.5.2 (ages15–24 aggregate)', 'Modeled ILO youth unemployment / youth labour force ages15–24, not all youth population, not adult unemployment, not NEET.', '08-05-02'),
    'SL.UEM.TOTL.ZS': ('Exact official SDG indicator concept; modeled aggregate', '8.5.2', 'Modeled ILO unemployment / labour force; full SDG sex/age/disability disaggregations are absent. Total is not adult.', '08-05-02'),
    'SM.POP.NETM': ('Contextual WDI statistic', 'Migration context; no exact indicator', 'Immigrants minus emigrants in persons, allowing negative estimates; not remittance-recipient count.', ''),
    'SP.POP.TOTL': ('Contextual WDI statistic', 'Demographic denominator; no exact indicator', 'Midyear population estimate in persons; national not regional denominator.', ''),
    'SP.URB.TOTL.IN.ZS': ('Contextual WDI statistic', 'Urbanization context; no exact indicator', 'Urban population / total population according to national urban definitions.', ''),
}


def main():
    manifest = json.loads((RELEASE / 'manifest.json').read_text(encoding='utf-8'))
    receipts = {entry['path']: entry for entry in manifest['requests']}
    quality = json.loads((RELEASE / 'quality.json').read_text(encoding='utf-8'))
    legacy = read_csv(ROOT / 'data/legacy/v1.0.0/processed/sdg_tjk_tidy.csv')
    licenses = json.loads((RELEASE / 'license-evidence.json').read_text(encoding='utf-8'))
    rows, ui = [], {}
    for code in INDICATORS:
        meta = json.loads((RELEASE / f'raw/{code}.metadata.json').read_text(encoding='utf-8'))[1][0]
        classification, sdg, distinction, suffix = MAPPING[code]
        old = sorted((r for r in legacy if r['country_code'] == 'TJK' and r['indicator_code'] == code), key=lambda r: int(r['year']))[-1]
        current = next(r for r in quality['coverage'] if r['country'] == 'TJK' and r['indicator'] == code)
        url = f'https://data.worldbank.org/indicator/{code}'
        definition = meta['sourceNote']
        ui[code] = {'classification': classification, 'sdg': sdg, 'definition': distinction, 'source_url': url}
        rows.append({'indicator_code': code, 'original_label': old['indicator_name'], 'current_source_label': meta['name'], 'unit': UNITS[code], 'unit_authority': 'API unit field blank; interpreted from source title/definition', 'classification': classification, 'sdg_goal_target_indicator': sdg, 'classification_note': distinction, 'unsd_metadata_url': f'https://unstats.un.org/sdgs/metadata/files/Metadata-{suffix}.pdf' if suffix else 'https://unstats.un.org/sdgs/metadata/', 'source_organization': meta['sourceOrganization'], 'source_url': url, 'metadata_url': receipts[f'raw/{code}.metadata.json']['url'], 'retrieved_at': receipts[f'raw/{code}.metadata.json']['retrieved_at'], 'definition': definition, 'footnote_location': f'data/releases/{RELEASE.name}/raw/{code}.observations.json', 'license': licenses[code]['license'], 'license_source_url': licenses[code]['url'], 'candidate_release': RELEASE.name, 'candidate_status': 'NOT APPROVED for production; used only by v2 review UI/reports/calculator', 'reference_country': 'TJK', 'legacy_latest_year': old['year'], 'legacy_latest_value': old['value'], 'candidate_latest_year': current['latest_year'], 'candidate_latest_value': current['latest_value'], 'legacy_provenance_status': 'Unresolved exact PPP/numeric vintage; quarantined' if code in ('SI.POV.DDAY', 'SI.POV.LMIC') else 'Archived claimed WDI extraction; historical ETL absent; retained as historical prototype evidence'})
    with (ROOT / 'docs/INDICATOR_REGISTER.csv').open('w', encoding='utf-8', newline='') as out:
        writer = csv.DictWriter(out, fieldnames=list(rows[0]), lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    save_json(ROOT / 'client/public/data/indicator-register.json', ui)
    sources = ['# Source citation register', '', 'Author: Matin Yunusov. Independent prototype; no institutional endorsement.', '', f'Candidate release: `{RELEASE.name}`. CANDIDATE_NOT_APPROVED. Retrieved timestamps and source URLs are per request in its manifest. Sources below were checked on 2026-10-11.', '', 'Every candidate observation resolves to `(country_code, indicator_code, year, vintage)` in `observations.csv`, with source URL, retrieval time, source update, status and any API footnote. All six-country coverage/gaps are in `quality.json`. Null records remain in raw evidence; they are not zeros.', '', '| WDI code | Definition/source | SDG attribution |', '|---|---|---|']
    for row in rows:
        sources.append(f"| {row['indicator_code']} | [{row['current_source_label']}]({row['source_url']}) | {row['sdg_goal_target_indicator']}; {row['classification']} |")
    sources += ['', 'Primary cross-cutting references:', '', '- [World Bank June 2025 poverty-line revision](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines): current 2021 PPP thresholds replace older definitions; historical editions are incompatible without reconciliation.', '- [UNSD SDG metadata repository](https://unstats.un.org/sdgs/metadata/): official indicator definitions and disaggregations, not a claim that these WDI aggregates are the entire official SDG reporting series.', '- [UNSD 7.2.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-07-02-01.pdf): renewable total final energy consumption. Not a certified SDG13 measure.', '- [UNSD 8.1.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-08-01-01.pdf): growth of real GDP per capita, unlike bundled aggregate GDP growth.', '- [UNSD 8.5.2 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-08-05-02.pdf): unemployment denominator and required disaggregations.', '- [UNSD 1.2.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-01-02-01.pdf): national lines and country-specific definitions.', '- [UNSD 10.1.1 metadata](https://unstats.un.org/sdgs/metadata/files/Metadata-10-01-01.pdf): bottom40% welfare growth, not Gini or bottom20% share.', '- [Tajikistan Poverty and Equity Brief, 2024](https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099062824104010489): contemporaneous independently checked report; cannot identify every archived numeric value or authenticate missing original ETL.', '- [World Bank data reuse terms](https://data.worldbank.org/summary-terms-of-use): CC BY4.0 unless indicated otherwise, subject to additional World Bank terms. All17 inspected indicator pages show CC BY-4.0; per-page retrieval timestamp/hash/evidence in `license-evidence.json`. Attribute World Bank and originating organizations, indicate transformations, do not imply endorsement.', '', 'Review status: analyst classifications supplied by the project authoring process; independent statistical signoff PENDING. National data-owner approval PENDING. Historical snapshot labels are not authoritative source metadata.']
    (ROOT / 'docs/SOURCE_CITATION_REGISTER.md').write_text('\n'.join(sources) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
