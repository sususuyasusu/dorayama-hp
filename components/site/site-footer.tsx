import { SECTIONS } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 px-4 pb-20 pt-16 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <nav aria-label="フッターナビゲーション">
          <ul className="chotai flex flex-wrap gap-x-8 gap-y-3 text-[12px] tracking-[0.15em] text-mute">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors duration-500 hover:text-paper">
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="chotai text-[11px] tracking-[0.1em] text-mute">© DORAYAMA All Rights Reserved.</p>
      </div>
    </footer>
  )
}
