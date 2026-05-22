import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import StatsSection from '@/components/landing/StatsSection'
import ProjectsSection from '@/components/landing/ProjectsSection'
import CtaSection from '@/components/landing/CtaSection'

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <StatsSection />
        <ProjectsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
