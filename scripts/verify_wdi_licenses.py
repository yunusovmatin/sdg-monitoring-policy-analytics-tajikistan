"""Capture per-indicator data-page license evidence; explicit online operation."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import re
from urllib.request import urlopen
from wdi_pipeline import INDICATORS, save_json


def check(code):
    url = f'https://data.worldbank.org/indicator/{code}'
    with urlopen(url, timeout=40) as response:
        body = response.read()
    html = body.decode('utf-8')
    # Inspect the rendered license label, not a default or unrelated indicator.
    match = re.search(r'License(?:.|\n){0,650}?CC BY-4\.0', html)
    if not match:
        raise ValueError(f'License cannot be verified for {code}; manual review required')
    snippet = re.sub(r'<[^>]+>', '', match.group())
    return code, {'url': url, 'retrieved_at': datetime.now(timezone.utc).isoformat(), 'license': 'CC BY-4.0', 'license_label_evidence': snippet, 'page_sha256_at_retrieval': hashlib.sha256(body).hexdigest(), 'terms_url': 'https://data.worldbank.org/summary-terms-of-use'}


def main():
    from pathlib import Path
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    args = parser.parse_args()
    target = args.release / 'license-evidence.json'
    if target.exists():
        raise ValueError('License evidence already captured; do not rewrite an immutable candidate')
    with ThreadPoolExecutor(max_workers=4) as executor:
        entries = dict(executor.map(check, INDICATORS))
    save_json(target, entries)
    print(f'Verified {len(entries)} indicator license labels')


if __name__ == '__main__':
    main()
