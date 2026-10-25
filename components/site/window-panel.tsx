import type { ReactNode } from 'react'

// A screen-tall "window" that scrolls with the page while its contents stay
// put on screen. The stage is position: fixed and the window clips it with
// clip-path, so the browser itself keeps the photo still: no script runs on
// scroll, which keeps iOS momentum scrolling perfectly smooth.
export function WindowPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-svh" style={{ clipPath: 'inset(0)' }}>
      <div className="fixed inset-x-0 top-0 h-svh">{children}</div>
    </div>
  )
}
