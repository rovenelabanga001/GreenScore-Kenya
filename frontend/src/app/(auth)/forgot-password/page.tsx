import type { Metadata } from 'next'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel'
import PasswordReset from '@/components/auth/PasswordReset'

export const metadata: Metadata = {
  title: 'Reset Password | GreenScore Kenya',
  description: 'Reset your GreenScore Kenya account password securely.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel
        headline="Secure Access to Your Green Impact"
        subline="Reset your password and get back to building, funding, and verifying climate-smart projects across Kenya."
      />

      <main className="flex-1 flex items-center justify-center bg-surface-container-lowest px-4 py-12">
        <PasswordReset />
      </main>
    </div>
  )
}