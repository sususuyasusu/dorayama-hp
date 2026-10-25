#!/bin/zsh
# 定番欄パネル：縦書きを折り返さず、画面の高さに合わせて文字と余白を縮める
set -e
F=~/dorayama-hp/components/site/signature-section.tsx
r() { sed -i '' "$1" "$F"; }
r 's#gap-6 px-6 pt-\[12svh\] text-paper md:gap-10 md:px-\[12vw\] md:pt-\[18svh\]#gap-6 px-6 pt-[min(12svh,96px)] text-paper md:gap-10 md:px-[12vw] md:pt-[min(16svh,160px)]#'
r 's#className="font-mincho shrink-0 text-\[30px\] font-bold tracking-\[0.15em\] md:text-\[40px\]"#className="font-mincho shrink-0 whitespace-nowrap text-[min(30px,5.5svh)] font-bold tracking-[0.15em] md:text-[min(40px,6svh)]"#'
r 's#font-mincho mt-12 flex flex-row-reverse gap-2.5 text-\[15px\] leading-\[1.9\] tracking-\[0.18em\] md:mt-24 md:gap-5 md:text-\[19px\] md:tracking-\[0.2em\]#font-mincho mt-[min(48px,6svh)] flex flex-row-reverse gap-2.5 text-[min(15px,2.7svh)] leading-[1.9] tracking-[0.18em] md:mt-[min(96px,9svh)] md:gap-5 md:text-[min(19px,2.9svh)] md:tracking-[0.2em]#'
r 's#<span key={line} className="block shrink-0"#<span key={line} className="block shrink-0 whitespace-nowrap"#'
r 's#className="chotai font-mincho mt-32 shrink-0 text-\[14px\] font-bold tracking-\[0.2em\] transition-opacity hover:opacity-70 md:mt-56 md:text-\[17px\]"#className="chotai font-mincho mt-[min(128px,18svh)] shrink-0 whitespace-nowrap text-[min(14px,2.6svh)] font-bold tracking-[0.2em] transition-opacity hover:opacity-70 md:mt-[min(224px,24svh)] md:text-[min(17px,2.7svh)]"#'
grep -c "svh" "$F"
