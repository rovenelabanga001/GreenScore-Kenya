import Link from 'next/link'
import { Leaf, Globe, Share2 } from 'lucide-react'

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'ESG Standards', href: '/esg' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export default function Footer() {
  return (
    <footer className="w-full py-12 px-4 md:px-12 bg-surface-container-highest">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" aria-hidden />
            <span className="font-bold text-primary text-base">GreenScore Kenya</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} GreenScore Kenya. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-on-surface-variant hover:text-secondary hover:underline underline-offset-4 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex gap-4" aria-label="Social links">
          <button
            className="text-primary hover:scale-110 transition-transform p-1"
            aria-label="Visit our website"
          >
            <Globe className="w-5 h-5" aria-hidden />
          </button>
          <button
            className="text-primary hover:scale-110 transition-transform p-1"
            aria-label="Share GreenScore Kenya"
          >
            <Share2 className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
