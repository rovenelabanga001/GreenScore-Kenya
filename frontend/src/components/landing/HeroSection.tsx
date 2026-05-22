import Link from 'next/link'
import { ArrowRight, TrendingUp, Wind, TreePine } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden flex items-center">
      {/* Subtle dot-grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      {/* Decorative radial glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #bff365 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ── Left column: copy ───────────────────────── */}
        <div className="lg:col-span-6 flex flex-col items-start">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse inline-block" />
            Kenya&apos;s Premier Green Finance Platform
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 text-white font-bold text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1] tracking-tight mb-6 drop-shadow-md">
            Fund Kenya&apos;s Green{' '}
            <span className="text-tertiary-fixed">Future</span>{' '}
            with Confidence
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up delay-200 text-white/80 text-lg leading-relaxed mb-10 max-w-xl">
            GreenScore Kenya helps funders discover, verify, score, and finance
            credible green projects across Kenya. Join the movement toward
            institutional climate stability.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-semibold text-base px-8 py-4 rounded-full hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
            >
              Submit a Green Project
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center justify-center bg-white/10 border border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Explore Projects
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up flex items-center gap-4">
            <div className="flex -space-x-2" aria-hidden>
              {['#0b513d', '#006a61', '#334c00'].map((color, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-primary-container flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: color }}
                >
                  {['BK', 'AO', 'NW'][i]}
                </div>
              ))}
            </div>
            <span className="text-white text-sm backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10">
              <strong>10M+</strong> people already joined
            </span>
          </div>
        </div>

        {/* ── Right column: floating cards ────────────── */}
        <div className="lg:col-span-6 flex flex-col gap-6 items-center lg:items-end mt-12 lg:mt-0">
          {/* ESG Index card */}
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm animate-float shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-base">Kenya ESG Index</h2>
              <TrendingUp className="w-4 h-4 text-tertiary-fixed" aria-hidden />
            </div>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 h-28" aria-label="ESG Index bar chart">
              {[
                { label: 'Energy', height: '40%', value: '+15%' },
                { label: 'Agric', height: '60%', value: '+10%' },
                { label: 'Water', height: '80%', value: '+12%' },
                { label: 'Total', height: '100%', value: '+24%', accent: true },
              ].map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-tertiary-fixed text-[10px] font-bold">{bar.value}</span>
                  <div
                    className={`w-full rounded-t-lg ${bar.accent ? 'bg-tertiary-fixed shadow-[0_0_12px_rgba(191,243,101,0.5)]' : 'bg-white/15'}`}
                    style={{ height: bar.height }}
                  />
                  <span className="text-white/50 text-[9px] uppercase tracking-wider">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Impact card */}
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm animate-float-delayed shadow-2xl flex items-center gap-6">
            {/* Circular progress ring */}
            <div className="relative w-24 h-24 shrink-0" aria-label="Green Score: 92 out of 100">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#bff365"
                  strokeWidth="3"
                  strokeDasharray="92, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse-ring rounded-full">
                <span className="text-white font-bold text-xl leading-none">92</span>
                <span className="text-white/50 text-[10px]">/100</span>
              </div>
            </div>

            <div>
              <p className="text-white/70 text-sm mb-1">Your Portfolio Impact</p>
              <p className="text-tertiary-fixed font-semibold text-base mb-3">92/100 Green Score</p>
              <div className="flex gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3" aria-hidden /> Carbon
                </span>
                <span className="flex items-center gap-1">
                  <TreePine className="w-3 h-3" aria-hidden /> Forest
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/30 to-transparent"
        aria-hidden
      />
    </section>
  )
}
