import Link from 'next/link'
import { Star, ChevronRight, Leaf, Zap, Recycle } from 'lucide-react'

const projects = [
  {
    id: 1,
    Icon: Leaf,
    category: 'Reforestation',
    score: 88,
    title: 'Mount Kenya Reforestation Phase II',
    description:
      'Restoring 500 hectares of native forest to protect water catchments and biodiversity across the mountain ecosystem.',
    target: 'KES 5.2M',
    gradientFrom: '#003527',
    gradientTo: '#064e3b',
    badgeBg: 'bg-tertiary-container',
    badgeText: 'text-on-tertiary-container',
  },
  {
    id: 2,
    Icon: Zap,
    category: 'Renewable Energy',
    score: 92,
    title: 'Solar Micro-Grids Turkana',
    description:
      'Providing sustainable, off-grid energy to 500+ households using advanced photovoltaic technology in arid regions.',
    target: 'KES 8.8M',
    gradientFrom: '#006a61',
    gradientTo: '#004a42',
    badgeBg: 'bg-secondary-container',
    badgeText: 'text-on-secondary-container',
  },
  {
    id: 3,
    Icon: Recycle,
    category: 'Circular Economy',
    score: 84,
    title: 'Plastic Loop Recycling Nairobi',
    description:
      'Scaling a waste collection and processing hub that turns ocean-bound plastic into high-quality building tiles.',
    target: 'KES 3.1M',
    gradientFrom: '#223400',
    gradientTo: '#334c00',
    badgeBg: 'bg-surface-container-highest',
    badgeText: 'text-on-surface',
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4 md:px-12 bg-background">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Green Projects
            </h2>
            <p className="text-lg text-on-surface-variant max-w-lg">
              Vetted opportunities with high environmental impact and proven scalability.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline underline-offset-4 shrink-0"
          >
            View all projects
            <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(({ id, Icon, category, score, title, description, target, gradientFrom, gradientTo, badgeBg, badgeText }) => (
            <article
              key={id}
              className="bg-white rounded-[2rem] shadow-soft overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              {/* Gradient image placeholder */}
              <div
                className="h-56 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
                aria-hidden
              >
                <Icon className="w-24 h-24 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-8">
                {/* Category + score */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase ${badgeBg} ${badgeText}`}>
                    {category}
                  </span>
                  <span className="flex items-center gap-1 text-secondary font-bold text-sm">
                    <Star className="w-4 h-4 fill-secondary" aria-hidden />
                    {score} Score
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{description}</p>

                {/* Target + CTA */}
                <div className="flex justify-between items-center pt-5 border-t border-outline-variant/30">
                  <div>
                    <span className="block text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-0.5">
                      Target
                    </span>
                    <span className="text-primary font-bold">{target}</span>
                  </div>
                  <Link
                    href={`/projects/${id}`}
                    className="bg-secondary text-on-secondary px-5 py-2 rounded-full text-sm font-semibold hover:bg-on-secondary-container hover:text-on-secondary transition-colors"
                  >
                    Invest
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
