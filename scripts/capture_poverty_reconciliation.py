"""Capture four explicitly specified PPP/line PIP comparisons, not original vintage proof."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen
from wdi_pipeline import save_json


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', required=True, type=Path)
    release = parser.parse_args().release
    target = release / 'poverty-reconciliation.json'
    if target.exists():
        raise ValueError('Do not overwrite captured evidence')
    evidence = []
    for ppp, line in ((2017, 2.15), (2017, 3.65), (2021, 3.0), (2021, 4.2)):
        url = f'https://api.worldbank.org/pip/v1/pip?country=TJK&year=2023&povline={line}&ppp_version={ppp}&fill_gaps=false'
        with urlopen(url, timeout=40) as response:
            body = response.read()
        payload = json.loads(body)
        if len(payload) != 1 or payload[0]['country_code'] != 'TJK' or payload[0]['reporting_year'] != 2023 or payload[0]['poverty_line'] != line:
            raise ValueError('Unexpected PIP response; no inference allowed')
        name = f'raw/pip-TJK-2023-{ppp}-{line}.json'
        (release / name).write_bytes(body)
        evidence.append({'url': url, 'retrieved_at': datetime.now(timezone.utc).isoformat(), 'raw_path': name, 'sha256': hashlib.sha256(body).hexdigest(), 'requested_ppp_version': ppp, 'requested_poverty_line': line, 'headcount_percent': payload[0]['headcount'] * 100, 'survey': payload[0]['survey_acronym'], 'welfare_type': payload[0]['welfare_type'], 'survey_comparability': payload[0]['survey_comparability'], 'comparable_spell': payload[0]['comparable_spell'], 'original_2026_01_25_vintage_proved': False})
    save_json(target, {'status': 'Current PIP responses only; do not authenticate missing original extraction', 'evidence': evidence})
    for entry in evidence:
        print(entry['requested_ppp_version'], entry['requested_poverty_line'], entry['headcount_percent'])


if __name__ == '__main__':
    main()
