"""Summarize a Netlify property-enquiry CSV locally, without printing contact details."""
import argparse,csv,re
from collections import Counter
from pathlib import Path
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('csv_file',type=Path)
args=parser.parse_args()
counts=Counter();sources=Counter();excluded=0
with args.csv_file.open(encoding='utf-8-sig',newline='') as f:
 for raw in csv.DictReader(f):
  row={re.sub(r'[^a-z0-9]+','_',k.lower()).strip('_'):v for k,v in raw.items() if k}
  if row.get('name','').strip().upper().startswith('AUDIT TEST'):
   excluded+=1;continue
  counts[row.get('property','').strip() or 'Unspecified project']+=1
  sources[(row.get('utm_source','').strip() or 'Not tagged',row.get('utm_campaign','').strip() or 'Not tagged')]+=1
print(f'Total enquiries in export (audit tests excluded): {sum(counts.values())}')
print(f'Audit tests excluded: {excluded}')
print('\nBy project:')
for project,total in counts.most_common():print(f'{project}: {total}')
print('\nBy source / campaign:')
for (source,campaign),total in sources.most_common():print(f'{source} / {campaign}: {total}')
