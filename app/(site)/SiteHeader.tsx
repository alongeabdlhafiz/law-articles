'use client'

import Link from 'next/link'
import {useState} from 'react'
import Image from 'next/image'

const links = [
  {href: '/', label: 'Home'},
  {href: '/categories', label: 'Categories'},
  {href: '/about', label: 'About'},
    {href: '/executive', label: 'Executive'},
  {href: '/contact', label: 'Contact'},
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b-4 border-gold bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-4">
                    <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 leading-tight"
          >
            <Image
              src="/logo.png"
              alt="Femi Falana Chambers logo"
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-full sm:h-11 sm:w-11"
            />
            <span>
              <span className="block text-lg font-bold tracking-wide sm:text-xl">
                Femi Falana Chambers
              </span>
              <span className="block text-xs text-gold sm:text-sm">
                Faculty of Law, OOU · Legal Publications
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>

          <form action="/search" method="get" className="hidden md:block">
            <input
              type="search"
              name="q"
              placeholder="Search..."
              className="w-44 rounded border border-white/30 bg-transparent px-3 py-1.5 text-sm placeholder:text-white/50"
            />
          </form>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded p-2 hover:bg-white/10 md:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="mt-4 border-t border-white/20 pt-4 md:hidden">
            <nav className="flex flex-col gap-3 text-base">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-1 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form action="/search" method="get" className="mt-4">
              <input
                type="search"
                name="q"
                placeholder="Search..."
                className="w-full rounded border border-white/30 bg-transparent px-3 py-2 text-sm placeholder:text-white/50"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}