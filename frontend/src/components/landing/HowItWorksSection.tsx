import { ShieldCheck, BarChart3, Network } from 'lucide-react'

const features = [
  {
    Icon: ShieldCheck,
    title: 'Rigorous Verification',
    description:
      'We use satellite data and on-ground audits to verify the authenticity of every green initiative listed on the platform.',
    iconBg: 'bg-primary-container',
    iconColor: 'text-on-primary-container',
  },
  {
    Icon: BarChart3,
    title: 'Dynamic Scoring',
    description:
      'Our AI-driven GreenScore provides an objective metric of ecological and social impact ROI for every project.',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
  },
  {
    Icon: Network,
    title: 'Seamless Matching',
    description:
      'Institutional and individual funders are matched with projects that align precisely with their ESG goals.',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="solutions" className="py-24 bg-surface px-4 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-secondary mb-4">
            The Challenge
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight tracking-tight mb-6">
            Bridging the Gap for Green Projects
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Many innovative green projects across Kenya&apos;s 47 counties struggle to access
            reliable funding due to lack of verification and standard scoring metrics.
            GreenScore Kenya changes the game.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ Icon, title, description, iconBg, iconColor }) => (
            <div
              key={title}
              className="bg-white p-10 rounded-[2rem] shadow-soft border border-outline-variant/20 hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}
              >
                <Icon className={`w-8 h-8 ${iconColor}`} aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
