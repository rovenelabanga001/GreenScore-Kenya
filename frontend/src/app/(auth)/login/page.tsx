import type { Metadata } from 'next'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | GreenScore Kenya',
  description: 'Sign in to your GreenScore Kenya account.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel (desktop only) */}
      <AuthBrandPanel
        headline="Fund Kenya's Green Future with Confidence"
        subline="Join 10M+ funders and project owners already powering sustainable growth across Kenya."
      />

      {/* Right — form panel */}
      <main className="flex-1 flex items-center justify-center bg-surface-container-lowest px-4 py-12">
        <LoginForm />
      </main>
    </div>
  )
}
