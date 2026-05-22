import Link from 'next/link'
import { Leaf, ShieldCheck, BarChart3, Network } from 'lucide-react'

const features = [
  { Icon: ShieldCheck, label: 'Bank-grade verified security' },
  { Icon: BarChart3, label: 'AI-powered ESG scoring engine' },
  { Icon: Network, label: 'Direct funder-to-project matching' },
]

interface Props {
  headline: string
  subline: string
}

export default function AuthBrandPanel({ headline, subline }: Props) {
  return (
    <div className="hidden lg:flex lg:w-[52%] xl:w-1/2 relative flex-col hero-gradient overflow-hidden">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      {/* Radial lime glow */}
      <div
        className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #bff365 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col h-full px-12 py-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group w-fit">
          <Leaf className="w-6 h-6 text-tertiary-fixed" aria-hidden />
          <span className="text-white font-bold text-lg">GreenScore Kenya</span>
        </Link>

        {/* Middle: headline + features */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <p className="text-tertiary-fixed text-xs font-bold tracking-widest uppercase mb-4">
            Kenya&apos;s Green Finance Platform
          </p>
          <h1 className="text-white font-bold text-4xl xl:text-5xl leading-tight tracking-tight mb-4">
            {headline}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">{subline}</p>

          {/* Trust features */}
          <ul className="space-y-4">
            {features.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-tertiary-fixed" aria-hidden />
                </div>
                <span className="text-white/80 text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: stats card */}
        <div className="glass-card rounded-2xl p-5 max-w-xs">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2" aria-hidden>
              {['#0b513d', '#006a61', '#334c00'].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-primary-container flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: color }}
                >
                  {['BK', 'AO', 'NW'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">10M+ people joined</p>
              <p className="text-white/50 text-xs">across 23 counties in Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
