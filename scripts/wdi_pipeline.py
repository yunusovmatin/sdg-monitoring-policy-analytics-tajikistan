"""New governed WDI pipeline; never reconstructs or replaces the legacy snapshot.

Python 3.14.3 standard library (no third-party dependencies). All transformations
are offline and deterministic. Fetch creates an immutable candidate, not approval.
"""
import argparse
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'data/legacy/v1.0.0/processed/sdg_tjk_tidy.csv'
DICTIONARY = ROOT / 'data/legacy/v1.0.0/processed/data_dictionary.csv'
COUNTRIES = ('ARM', 'GEO', 'KAZ', 'KGZ', 'TJK', 'UZB')
def read_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as handle:
        return list(csv.DictReader(handle))


INDICATORS = tuple(sorted(row['indicator_code'] for row in read_csv(DICTIONARY)))
LEGACY_SHA = '330c4d45bb149d0d18a023d59498d2100d8f427fb2ebe14c931e0bf77753a791'
FIELDS = ('country_code', 'country_name', 'indicator_code', 'indicator_name', 'year', 'value', 'unit', 'vintage', 'retrieved_at', 'source_updated', 'source_url', 'footnote', 'observation_status', 'decimal', 'ppp_basis', 'annual_change', 'annual_percent_change')
UNITS = {row['indicator_code']: row['unit'] for row in read_csv(DICTIONARY)}
UNITS['EG.FEC.RNEW.ZS'] = '% of total final energy consumption'
NONNEGATIVE = {'NY.GDP.PCAP.KD', 'SP.POP.TOTL', 'SL.UEM.TOTL.ZS', 'SL.UEM.1524.ZS', 'SL.TLF.CACT.ZS', 'SI.POV.DDAY', 'SI.POV.LMIC', 'SI.POV.NAHC', 'SI.POV.GINI', 'SI.DST.FRST.20', 'EG.FEC.RNEW.ZS', 'SP.URB.TOTL.IN.ZS', 'SE.SEC.ENRR', 'BX.TRF.PWKR.DT.GD.ZS'}
BOUNDED_PERCENT = NONNEGATIVE - {'NY.GDP.PCAP.KD', 'SP.POP.TOTL', 'SE.SEC.ENRR', 'BX.TRF.PWKR.DT.GD.ZS'}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def baseline_digest():
    # Git checkout on Windows may apply CRLF; immutable repository blob is LF.
    return hashlib.sha256(BASELINE.read_bytes().replace(b'\r\n', b'\n')).hexdigest()


def save_json(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')


def validate_rows(rows, require_sets=True):
    seen = set()
    countries, indicators, vintages = set(), set(), set()
    for row in rows:
        key = (row['country_code'], row['indicator_code'], int(row['year']), row['vintage'])
        if not row['vintage']:
            raise ValueError('Missing vintage')
        if key in seen:
            raise ValueError(f'Duplicate key: {key}')
        seen.add(key)
        code, value = row['indicator_code'], float(row['value'])
        if code not in INDICATORS or row['country_code'] not in COUNTRIES:
            raise ValueError('Unexpected country or indicator')
        if not math.isfinite(value) or not 2000 <= int(row['year']) <= 2025:
            raise ValueError('Nonfinite value or out-of-scope year')
        if (code in NONNEGATIVE and value < 0) or (code in BOUNDED_PERCENT and value > 100):
            raise ValueError(f'Implausible domain: {code}={value}')
        if row['unit'] != UNITS[code]:
            raise ValueError(f'Wrong unit: {code}')
        if code in ('SI.POV.DDAY', 'SI.POV.LMIC') and row['ppp_basis'] != '2021 PPP':
            raise ValueError('Unverified poverty definition')
        countries.add(row['country_code'])
        indicators.add(code)
        vintages.add(row['vintage'])
    if require_sets and (countries != set(COUNTRIES) or indicators != set(INDICATORS) or len(vintages) != 1):
        raise ValueError('Expected six countries, seventeen indicators, one vintage')
    return seen


def annual_changes(previous, current):
    # A survey gap is not an annual change. Never replace missingness with zero.
    if previous is None or int(current['year']) - int(previous['year']) != 1:
        return '', ''
    change = float(current['value']) - float(previous['value'])
    return format(change, '.17g'), ('' if float(previous['value']) == 0 else format(change / float(previous['value']) * 100, '.17g'))


def assert_compatible_join(rows):
    """A denominator/comparison join must explicitly share country, year and edition."""
    if not rows or len({(r['country_code'], int(r['year']), r['vintage']) for r in rows}) != 1:
        raise ValueError('Incompatible country/year/vintage join')


def fetch(release):
    if release.exists():
        raise ValueError('Release already exists; candidates are immutable. Choose a new ID.')
    release.mkdir(parents=True)
    raw = release / 'raw'
    raw.mkdir()
    def download(code):
        entries = []
        for kind, url in (
            ('metadata', f'https://api.worldbank.org/v2/indicator/{code}?source=2&format=json'),
            ('observations', f'https://api.worldbank.org/v2/country/{";".join(COUNTRIES)}/indicator/{code}?source=2&date=2000:2025&format=json&per_page=20000&footnote=y'),
        ):
            error = None
            for attempt in range(3):
                try:
                    with urlopen(Request(url, headers={'User-Agent': 'Independent-SDG-Research/2.0'}), timeout=40) as response:
                        body = response.read()
                    payload = json.loads(body)
                    if not isinstance(payload, list) or len(payload) != 2 or not isinstance(payload[1], list):
                        raise ValueError('Missing/invalid API records; cannot fabricate data')
                    if int(payload[0].get('pages', 1)) != 1:
                        raise ValueError('Unexpected pagination; extraction incomplete')
                    filename = f'raw/{code}.{kind}.json'
                    (release / filename).write_bytes(body)
                    entries.append({'path': filename, 'url': url, 'retrieved_at': datetime.now(timezone.utc).isoformat(), 'sha256': hashlib.sha256(body).hexdigest(), 'records': len(payload[1])})
                    break
                except Exception as exc:
                    error = str(exc)
                    if attempt == 2:
                        raise RuntimeError(f'{code}/{kind}: {error}') from exc
                    time.sleep(attempt + 1)
        return entries
    with ThreadPoolExecutor(max_workers=4) as executor:
        receipts = [entry for entries in executor.map(download, INDICATORS) for entry in entries]
    save_json(release / 'manifest.json', {'release_id': release.name, 'status': 'CANDIDATE_NOT_APPROVED', 'baseline_sha256': LEGACY_SHA, 'runtime': 'CPython 3.14.3', 'dependencies': 'standard library only', 'scope': {'countries': list(COUNTRIES), 'indicators': list(INDICATORS), 'years': [2000, 2025]}, 'license_url': 'https://data.worldbank.org/summary-terms-of-use', 'license': 'CC BY 4.0 subject to indicator exceptions and World Bank additional terms', 'requests': receipts})


def build(release):
    manifest = json.loads((release / 'manifest.json').read_text(encoding='utf-8'))
    if baseline_digest() != LEGACY_SHA:
        raise ValueError('Frozen legacy CSV changed')
    receipts = {entry['path']: entry for entry in manifest['requests']}
    for entry in receipts.values():
        if digest(release / entry['path']) != entry['sha256']:
            raise ValueError(f'Raw checksum failure: {entry["path"]}')
    rows, nulls, definitions = [], [], {}
    for code in INDICATORS:
        metadata = json.loads((release / f'raw/{code}.metadata.json').read_text(encoding='utf-8'))[1][0]
        if metadata['id'] != code:
            raise ValueError('Metadata ID mismatch')
        if code in ('SI.POV.DDAY', 'SI.POV.LMIC') and '2021 PPP' not in metadata['name']:
            raise ValueError('Unexpected PPP definition: approval/reconciliation required')
        definitions[code] = metadata
        payload = json.loads((release / f'raw/{code}.observations.json').read_text(encoding='utf-8'))
        receipt = receipts[f'raw/{code}.observations.json']
        expected_raw = {(country, year) for country in COUNTRIES for year in range(2000, 2026)}
        actual_raw = [(obs['countryiso3code'], int(obs['date'])) for obs in payload[1]]
        if len(actual_raw) != len(set(actual_raw)) or set(actual_raw) != expected_raw:
            raise ValueError('Incomplete or duplicate raw scope; cannot silently omit country-year records')
        for obs in payload[1]:
            if obs['indicator']['id'] != code:
                raise ValueError('Observation indicator mismatch')
            key = {'country_code': obs['countryiso3code'], 'indicator_code': code, 'year': int(obs['date'])}
            if obs['value'] is None:
                nulls.append(key)
                continue
            rows.append({**key, 'country_name': obs['country']['value'], 'indicator_name': metadata['name'], 'value': format(float(obs['value']), '.17g'), 'unit': UNITS[code], 'vintage': manifest['release_id'], 'retrieved_at': receipt['retrieved_at'], 'source_updated': payload[0].get('lastupdated', ''), 'source_url': receipt['url'], 'footnote': obs.get('footnote', ''), 'observation_status': obs.get('obs_status', ''), 'decimal': obs.get('decimal', ''), 'ppp_basis': '2021 PPP' if code in ('SI.POV.DDAY', 'SI.POV.LMIC') else 'not applicable', 'annual_change': '', 'annual_percent_change': ''})
    rows.sort(key=lambda r: (r['country_code'], r['indicator_code'], r['year']))
    previous = {}
    for row in rows:
        key = row['country_code'], row['indicator_code']
        row['annual_change'], row['annual_percent_change'] = annual_changes(previous.get(key), row)
        previous[key] = row
    validate_rows(rows)
    with (release / 'observations.csv').open('w', encoding='utf-8', newline='') as out:
        writer = csv.DictWriter(out, fieldnames=FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    old = read_csv(BASELINE)
    old_keys = {(r['country_code'], r['indicator_code'], int(r['year'])): r for r in old}
    new_keys = {(r['country_code'], r['indicator_code'], r['year']): r for r in rows}
    revisions = []
    for key in sorted(old_keys.keys() & new_keys.keys()):
        delta = float(new_keys[key]['value']) - float(old_keys[key]['value'])
        if not math.isclose(float(new_keys[key]['value']), float(old_keys[key]['value']), rel_tol=1e-10, abs_tol=1e-10):
            revisions.append({'country': key[0], 'indicator': key[1], 'year': key[2], 'old_value': old_keys[key]['value'], 'candidate_value': new_keys[key]['value'], 'absolute_difference': delta, 'incompatible_poverty_vintage': key[1] in ('SI.POV.DDAY', 'SI.POV.LMIC'), 'interpretation': 'Do not interpret as a time change; source revision and/or definition change.'})
    missing = [{'country': k[0], 'indicator': k[1], 'year': k[2]} for k in sorted(old_keys.keys() - new_keys.keys())]
    coverage = []
    for country in COUNTRIES:
        for code in INDICATORS:
            values = [r for r in rows if r['country_code'] == country and r['indicator_code'] == code]
            years = [r['year'] for r in values]
            coverage.append({'country': country, 'indicator': code, 'count': len(values), 'first_year': min(years) if years else None, 'latest_year': max(years) if years else None, 'latest_value': values[-1]['value'] if values else None, 'missing_years': [y for y in range(2000, 2026) if y not in years], 'stale_before_2023': not years or max(years) < 2023})
    save_json(release / 'quality.json', {'rows': len(rows), 'null_records_retained_in_raw': len(nulls), 'countries': len(COUNTRIES), 'indicators': len(INDICATORS), 'observations_sha256': digest(release / 'observations.csv'), 'baseline_sha256': baseline_digest(), 'baseline_hash_convention': 'Git LF blob; Windows checkout CRLF normalized', 'coverage': coverage, 'validation': 'PASS', 'historical_pipeline_reconstructed': False, 'publication_approved': False})
    old_definitions = {r['indicator_code']: r['indicator_name'] for r in old}
    save_json(release / 'refresh-diff.json', {'status': 'REVIEW_REQUIRED', 'baseline': 'v1.0.0 legacy snapshot; poverty vintage unresolved', 'candidate': release.name, 'definition_changes': [{'indicator': code, 'legacy_label': old_definitions[code], 'candidate_source_label': definitions[code]['name'], 'ppp_change_requires_review': code in ('SI.POV.DDAY', 'SI.POV.LMIC')} for code in INDICATORS if old_definitions[code] != definitions[code]['name']], 'value_revisions': revisions, 'newly_missing': missing, 'new_observations_count': len(new_keys.keys() - old_keys.keys()), 'narrative_impacts': ['All legacy charts, rankings, benchmarks and scenario baseline claims require same-version review before candidate promotion.', 'Poverty differences across editions are not temporal changes.'], 'approval': {'data_owner': 'PENDING', 'independent_statistical_reviewer': 'PENDING', 'user_release_approval': 'PENDING'}})
    print(json.dumps({'release': release.name, 'rows': len(rows), 'value_revisions': len(revisions), 'newly_missing': len(missing), 'sha256': digest(release / 'observations.csv')}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=('fetch', 'build'))
    parser.add_argument('--release', required=True, type=Path)
    args = parser.parse_args()
    {'fetch': fetch, 'build': build}[args.action](args.release.resolve())


if __name__ == '__main__':
    main()
