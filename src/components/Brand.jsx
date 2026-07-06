// Shared brand chrome: logo mark, nav bar, footer.

export function Logo({ onClick, light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 no-underline bg-transparent border-0 p-0 cursor-pointer text-left"
      aria-label="The Corporate — home"
    >
      <span className="relative inline-block w-7 h-7 bg-ink">
        <span className="absolute left-[6px] top-[6px] w-[16px] h-[16px] bg-lime" />
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display font-bold tracking-tight text-[15px] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          THE CORPORATE
        </span>
        <span className={`block text-[10px] font-light ${light ? 'text-stone' : 'text-stone'}`}>
          Supplier Sustainability 2026
        </span>
      </span>
    </button>
  )
}

export function Nav({ onHome }) {
  return (
    <header className="border-b border-ink bg-chalk">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Logo onClick={onHome} />
        <span className="hidden sm:inline text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
          ESRS / CSRD Aligned
        </span>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-white mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 sm:grid-cols-2">
        <div>
          <Logo light />
          <p className="mt-4 text-sm font-light text-stone max-w-sm">
            The Corporate's 2026 supplier sustainability assessment programme. ESRS-aligned,
            EcoVadis-first. This tool stores nothing — your answers never leave your browser.
          </p>
        </div>
        <div className="sm:text-right text-sm font-light text-stone">
          <p>Procurement &amp; EHS Working Group</p>
          <p className="mt-1">Confidential · For invited Tier 1 suppliers</p>
          <p className="mt-4 text-xs">© 2026 The Corporate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export function Page({ children, onHome, showNav = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-chalk">
      {showNav && <Nav onHome={onHome} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
