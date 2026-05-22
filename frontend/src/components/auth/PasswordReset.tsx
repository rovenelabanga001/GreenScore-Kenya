'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Leaf, Loader2, MailCheck } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const API_BASE_URL = 'https://greenscore-kenya.onrender.com'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const isEmailValid = EMAIL_REGEX.test(email.trim())
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const trimmedEmail = email.trim()
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error ?? 'Unable to send reset link. Please try again.')
        return
      }

      setSubmittedEmail(trimmedEmail)
    } catch {
      setError('Cannot reach auth server. Confirm backend is running at https://greenscore-kenya.onrender.com.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md px-6 py-10 lg:px-0">
      <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
        <Leaf className="w-5 h-5 text-primary" aria-hidden />
        <span className="font-bold text-primary">GreenScore Kenya</span>
      </Link>

      <h2 className="text-3xl font-bold text-primary tracking-tight mb-1">Reset your password</h2>
      <p className="text-on-surface-variant mb-8">We&apos;ll email you a secure reset link.</p>

      {error && (
        <div role="alert" className="mb-6 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm">
          {error}
        </div>
      )}

      {submittedEmail ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MailCheck className="w-4 h-4 text-primary" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Check your inbox</p>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                If an account exists for <span className="font-medium text-on-surface">{submittedEmail}</span>, we sent a reset link.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-5 flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-primary-container transition-colors"
            onClick={() => {
              setSubmittedEmail(null)
              setEmail('')
              setEmailTouched(false)
            }}
          >
            Send another link
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-semibold text-on-surface mb-1.5">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error === 'Please enter a valid email address.') {
                  setError('')
                }
              }}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? 'reset-email-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                showEmailError ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'
              }`}
            />
            {showEmailError && (
              <p id="reset-email-error" className="mt-1 text-xs text-error">
                Enter a valid email address
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                Sending reset link...
              </>
            ) : (
              <>
                Send reset link
                <ArrowRight className="w-4 h-4" aria-hidden />
              </>
            )}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-on-surface-variant mt-8">
        Remember your password?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Back to sign in
        </Link>
      </p>
    </div>
  )
}