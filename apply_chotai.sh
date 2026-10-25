#!/bin/zsh
# 本文以外のラベル・ボタン・リンクに長体クラス（chotai / chotai-r）を付ける
set -e
cd ~/dorayama-hp/components/site
r() { sed -i '' "$1" "$2"; }

# footer: link list and copyright
r 's#<ul className="flex flex-wrap gap-x-8#<ul className="chotai flex flex-wrap gap-x-8#' site-footer.tsx
r 's#<p className="text-\[11px\] tracking-\[0.1em\] text-mute">© DORAYAMA#<p className="chotai text-[11px] tracking-[0.1em] text-mute">© DORAYAMA#' site-footer.tsx

# pill buttons everywhere
r "s#^  'inline-flex h-10 items-center#  'chotai inline-flex h-10 items-center#" pill-link.tsx

# news: titles, link to the list (right aligned)
r 's#<p className="font-mincho flex-1 text-\[14px\]#<p className="chotai font-mincho flex-1 text-[14px]#' news-row.tsx
r 's#<a href="news/" className="font-mincho group inline-flex#<a href="news/" className="chotai-r font-mincho group inline-flex#' news-section.tsx

# store badges
r 's#<li className="flex items-center gap-3">#<li className="chotai flex items-center gap-3">#g' store-section.tsx

# signature: "(商品詳細)" link (vertical)
r 's#className="font-mincho mt-32 shrink-0 text-\[14px\] font-bold#className="chotai font-mincho mt-32 shrink-0 text-[14px] font-bold#' signature-section.tsx

# products: price and tax note
r 's#<p className="font-mincho text-lg leading-none text-paper tabular-nums"#<p className="chotai font-mincho text-lg leading-none text-paper tabular-nums"#' products-section.tsx
r 's#<p className="text-\[11px\] tracking-\[0.1em\] text-mute">価格はすべて税込です。#<p className="chotai text-[11px] tracking-[0.1em] text-mute">価格はすべて税込です。#' products-section.tsx

# section heading: boxed vertical label, English lead, vertical catch copy
r "s#className=\"mt-3 shrink-0 border-\[0.5px\]#className=\"chotai mt-3 shrink-0 border-[0.5px]#" section-heading.tsx
r 's#className="mt-6 text-\[14px\] font-normal#className="chotai mt-6 text-[14px] font-normal#' section-heading.tsx
r "s#<span key={col} style={{ writingMode: 'vertical-rl'#<span key={col} className=\"chotai\" style={{ writingMode: 'vertical-rl'#" section-heading.tsx

echo ok
grep -c "chotai" site-footer.tsx pill-link.tsx news-row.tsx news-section.tsx store-section.tsx signature-section.tsx products-section.tsx section-heading.tsx
