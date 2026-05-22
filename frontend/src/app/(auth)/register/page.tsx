import type { Metadata } from 'next'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account | GreenScore Kenya',
  description: 'Create your free GreenScore Kenya account and join the green finance movement.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel (desktop only) */}
      <AuthBrandPanel
        headline="Join Kenya's Green Finance Revolution"
        subline="Submit your project, secure funding, and grow your environmental impact — all in one platform."
      />

      {/* Right — form panel */}
      <main className="flex-1 flex items-center justify-center bg-surface-container-lowest px-4 py-12">
        <RegisterForm />
      </main>
    </div>
  )
}
