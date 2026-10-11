"""Regenerate diagnostics from bundled observations; no imputation or fitted causal relationship."""
from pathlib import Path
import csv,json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]
rows=list(csv.DictReader((ROOT/'client/public/data/processed/sdg_tjk_tidy.csv').open(encoding='utf-8')))
def series(code):return {int(r['year']):float(r['value']) for r in rows if r['country_code']=='TJK' and r['indicator_code']==code}
pov=series('SI.POV.LMIC');rem=series('BX.TRF.PWKR.DT.GD.ZS');years=sorted(pov)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':12,'axes.spines.top':False,'axes.spines.right':False})
fig,ax=plt.subplots(figsize=(9,6));fig.subplots_adjust(left=.14,right=.97,top=.90,bottom=.20)
ax.plot(years,[pov[y] for y in years],color='#2563eb',marker='o',label='Available observations')
for y in years:ax.annotate(f'{pov[y]:.1f}',(y,pov[y]),xytext=(0,9),textcoords='offset points',ha='center',fontsize=10)
ax.set(title='Tajikistan: observed international-line poverty',xlabel='Observation year (missing years not imputed)',ylabel='Poverty headcount (% of population)')
ax.set_ylim(0,85);ax.grid(alpha=.2);ax.legend(loc='upper right')
fig.text(.02,.025,'Source: bundled WDI CSV, SI.POV.LMIC; $3.65/day, 2017 PPP snapshot label.\nLines connect observations only. No structural break or causal effect is estimated.',fontsize=9)
fig.savefig(ROOT/'client/public/diagnostic-poverty-trend.png',dpi=160,bbox_inches='tight',pad_inches=.3);plt.close(fig)
common=sorted(set(pov)&set(rem));fig,ax=plt.subplots(figsize=(9,6));fig.subplots_adjust(left=.14,right=.97,top=.90,bottom=.20)
ax.scatter([rem[y] for y in common],[pov[y] for y in common],color='#2563eb',s=70)
for y in common:ax.annotate(str(y),(rem[y],pov[y]),xytext=(6,5),textcoords='offset points',fontsize=10)
ax.set(title='Tajikistan: remittances and poverty in common years',xlabel='Personal remittances received (% of GDP)',ylabel='International-line poverty (% of population)');ax.grid(alpha=.2);ax.set_ylim(0,85)
fig.text(.02,.025,'Source: bundled WDI CSV; BX.TRF.PWKR.DT.GD.ZS and SI.POV.LMIC.\nSame-year observations only. No trend fit, poverty-effectiveness metric or causality claim.',fontsize=9)
fig.savefig(ROOT/'client/public/diagnostic-remittances-poverty.png',dpi=160,bbox_inches='tight',pad_inches=.3);plt.close(fig)
print('Generated two observation-based diagnostics; values:',json.dumps({'poverty':pov,'paired_years':common}))
