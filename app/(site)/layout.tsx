import SiteHeader from './SiteHeader'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <SiteHeader />

      <div className="flex-1">{children}</div>

      <footer className="bg-navy text-sm text-white/70">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <p className="font-semibold text-gold">
            Femi Falana Chambers, Faculty of Law, OOU Legal Publications
          </p>
          <p className="mt-2">A platform for law students and legal writers.</p>
          <p className="mt-2">© 2026. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}