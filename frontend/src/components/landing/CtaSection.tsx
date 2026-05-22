import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-24 px-4 md:px-12 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative bg-primary rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
          {/* Decorative blobs */}
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ background: '#bff365' }}
            aria-hidden
          />
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: '#86f2e4' }}
            aria-hidden
          />

          {/* Copy */}
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-on-primary font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-4">
              Ready to lead the change?
            </h2>
            <p className="text-on-primary-container text-lg opacity-80 leading-relaxed">
              Whether you&apos;re a visionary entrepreneur or a forward-thinking investor, the
              future of Kenya is green.
            </p>
          </div>

          {/* Buttons */}
          <div className="relative z-10 flex flex-col gap-4 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-all shadow-md"
            >
              Launch My Project
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center text-on-primary border border-on-primary font-bold text-lg px-10 py-5 rounded-full hover:bg-white/10 transition-all"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
