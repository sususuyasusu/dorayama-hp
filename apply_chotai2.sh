#!/bin/zsh
# 長体クラス 追加分：詩・ヘッダーのご予約・メニュー面・地図リンク
set -e
cd ~/dorayama-hp/components/site
r() { sed -i '' "$1" "$2"; }

r 's#className="font-mincho flex flex-col gap-6 text-base text-paper sm:text-xl lg:text-\[26px\]"#className="chotai font-mincho flex flex-col gap-6 text-base text-paper sm:text-xl lg:text-[26px]"#' concept-section.tsx
r 's#className="inline-flex h-\[26px\] items-center whitespace-nowrap rounded-full#className="chotai-r inline-flex h-[26px] items-center whitespace-nowrap rounded-full#' site-header.tsx
r 's#<ul className="flex flex-col gap-3">#<ul className="chotai flex flex-col gap-3">#' site-header.tsx
r 's#className="mt-14 flex flex-col gap-3 text-\[13px\] tracking-\[0.1em\] transition-opacity#className="chotai mt-14 flex flex-col gap-3 text-[13px] tracking-[0.1em] transition-opacity#' site-header.tsx
r 's#className="self-end text-\[12px\] tracking-\[0.1em\] text-mute underline#className="chotai-r self-end text-[12px] tracking-[0.1em] text-mute underline#' access-section.tsx

grep -c "chotai" concept-section.tsx site-header.tsx access-section.tsx
