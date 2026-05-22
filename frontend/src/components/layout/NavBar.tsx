'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Leaf, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Projects', href: '#projects' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textClass = scrolled ? 'text-on-surface-variant' : 'text-white/80'
  const hoverClass = scrolled ? 'hover:text-primary' : 'hover:text-white'

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 md:px-12 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Leaf
            className={`w-6 h-6 transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-tertiary-fixed'}`}
            aria-hidden
          />
          <span
            className={`text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}
          >
            GreenScore Kenya
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${textClass} ${hoverClass}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors duration-200 ${textClass} ${hoverClass}`}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-95 ${
              scrolled
                ? 'bg-primary text-on-primary hover:bg-primary-container'
                : 'bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90'
            }`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${textClass}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-md border-t border-outline-variant/30">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-on-surface-variant hover:text-primary text-sm font-medium px-3 py-3 rounded-lg hover:bg-surface-container transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-outline-variant/30 mt-2 pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-center text-sm font-medium text-on-surface-variant hover:text-primary px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-center bg-primary text-on-primary rounded-full text-sm font-semibold px-6 py-3 hover:bg-primary-container transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
