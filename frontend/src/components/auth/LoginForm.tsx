'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight, Leaf } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    // TODO: replace with real auth call
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setError('Authentication service is not yet connected.')
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
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

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-outline-variant" />
        <span className="text-xs text-on-surface-variant font-medium">or continue with</span>
        <div className="flex-1 border-t border-outline-variant" />
      </div>

      {/* Google OAuth placeholder */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-outline-variant bg-surface-container-lowest text-on-surface font-medium text-sm px-6 py-3 rounded-xl hover:bg-surface-container-low transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

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
