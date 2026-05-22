import AnimatedCounter from '@/components/ui/AnimatedCounter'

const stats = [
  { target: 128, suffix: '+', label: 'Active Projects' },
  { target: 42, suffix: 'M+', label: 'KES Requested' },
  { target: 23, suffix: '', label: 'Counties Covered' },
  { target: 74, suffix: '', label: 'Avg GreenScore' },
]

export default function StatsSection() {
  return (
    <section className="relative py-24 bg-primary px-4 md:px-12 overflow-hidden">
      {/* Dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map(({ target, suffix, label }) => (
          <div key={label}>
            <div className="text-5xl md:text-6xl font-bold text-on-primary mb-2 tracking-tight">
              <AnimatedCounter target={target} suffix={suffix} />
            </div>
            <span className="text-on-primary-container text-xs font-bold tracking-widest uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
