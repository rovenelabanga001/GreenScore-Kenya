'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight, Leaf } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const API_BASE_URL = 'https://greenscore-kenya.onrender.com'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEmailValid = EMAIL_REGEX.test(email.trim())
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in. Please try again.')
        return
      }

      const token = data.token ?? data.access_token ?? null
      if (token) {
        localStorage.setItem('auth_token', token)
      }
      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }
      if (data.role) {
        localStorage.setItem('auth_role', String(data.role))
      }

      router.push('/dashboard')
    } catch {
      setError('Cannot reach auth server. Confirm backend is running at https://greenscore-kenya.onrender.com.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md px-6 py-10 lg:px-0">
      {/* Mobile-only logo */}
      <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
        <Leaf className="w-5 h-5 text-primary" aria-hidden />
        <span className="font-bold text-primary">GreenScore Kenya</span>
      </Link>

      <h2 className="text-3xl font-bold text-primary tracking-tight mb-1">Welcome back</h2>
      <p className="text-on-surface-variant mb-8">Sign in to your account to continue.</p>

      {error && (
        <div role="alert" className="mb-6 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-1.5">
            Email address
          </label>
          <input
            id="email"
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
            aria-describedby={showEmailError ? 'login-email-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
              showEmailError ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'
            }`}
          />
          {showEmailError && (
            <p id="login-email-error" className="mt-1 text-xs text-error">
              Enter a valid email address
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-on-surface">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-secondary hover:underline underline-offset-4 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" aria-hidden />
            </>
          )}
        </button>
      </form>

    

      {/* Register link */}
      <p className="text-center text-sm text-on-surface-variant mt-8">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Create one free
        </Link>
      </p>
    </div>
  )
}
