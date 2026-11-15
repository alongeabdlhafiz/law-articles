import Link from 'next/link'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header className="border-b-4 border-gold bg-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-wide">
            Law<span className="text-gold">Journal</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
                        <Link href="/categories" className="hover:text-gold">
              Categories
            </Link>
                        <Link href="/about" className="hover:text-gold">
              About
            </Link>
                        <Link href="/contact" className="hover:text-gold">
              Contact
            </Link>
          </nav>
                    <form action="/search" method="get">
            <input
              type="search"
              name="q"
              placeholder="Search..."
              className="w-32 rounded border border-white/30 bg-transparent px-3 py-1 text-sm placeholder:text-white/50 sm:w-44"
            />
          </form>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-navy text-sm text-white/70">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p>
            <span className="font-semibold text-gold">LawJournal</span> · A
            platform for law students and legal writers.
          </p>
          <p className="mt-2">© 2026 LawJournal. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}