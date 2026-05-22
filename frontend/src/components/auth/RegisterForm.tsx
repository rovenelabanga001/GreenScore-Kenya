'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight, Leaf, Sprout, Building2 } from 'lucide-react'

type Role = 'owner' | 'funder'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const API_BASE_URL = 'https://greenscore-kenya.onrender.com'

const ROLES = [
  {
    id: 'owner' as Role,
    Icon: Sprout,
    label: 'Project Owner',
    description: 'Submit green projects & receive a GreenScore',
  },
  {
    id: 'funder' as Role,
    Icon: Building2,
    label: 'Funder / Investor',
    description: 'Discover & finance verified green projects',
  },
]

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordStrength = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { level: 1, label: 'Too short', color: 'bg-error' }
    if (password.length < 10) return { level: 2, label: 'Fair', color: 'bg-tertiary-fixed-dim' }
    return { level: 3, label: 'Strong', color: 'bg-secondary' }
  })()

  const isEmailValid = EMAIL_REGEX.test(email.trim())
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!role) {
      setError('Please select your role.')
      return
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setLoading(true)
    try {
      const backendRole = role === 'owner' ? 'project_owner' : 'funder'
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          password,
          role: backendRole,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error ?? 'Unable to create account. Please try again.')
        return
      }

      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        localStorage.setItem('auth_role', String(data.user.role ?? backendRole))
      }

      router.push('/login')
    } catch {
      setError('Cannot reach auth server. Confirm backend is running at https://greenscore-kenya.onrender.com.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md px-6 py-8 lg:px-0">
      {/* Mobile-only logo */}
      <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
        <Leaf className="w-5 h-5 text-primary" aria-hidden />
        <span className="font-bold text-primary">GreenScore Kenya</span>
      </Link>

      <h2 className="text-3xl font-bold text-primary tracking-tight mb-1">Create your account</h2>
      <p className="text-on-surface-variant mb-6">Join Kenya&apos;s green finance movement.</p>

      {error && (
        <div role="alert" className="mb-5 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-on-surface mb-1.5">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Wanjiru"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-sm font-semibold text-on-surface mb-1.5">
            Email address
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (!emailTouched) return
              if (error === 'Please enter a valid email address.') {
                setError('')
              }
            }}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? 'reg-email-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
              showEmailError ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'
            }`}
          />
          {showEmailError && (
            <p id="reg-email-error" className="mt-1 text-xs text-error">
              Enter a valid email address
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="block text-sm font-semibold text-on-surface mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
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
          {/* Password strength */}
          {passwordStrength && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      lvl <= passwordStrength.level ? passwordStrength.color : 'bg-outline-variant'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant">{passwordStrength.label}</span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-on-surface mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                confirmPassword && confirmPassword !== password
                  ? 'border-error focus:ring-error'
                  : 'border-outline-variant focus:ring-primary'
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-error">Passwords do not match</p>
          )}
        </div>

        {/* Role selection */}
        <fieldset>
          <legend className="text-sm font-semibold text-on-surface mb-2">I am a…</legend>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map(({ id, Icon, label, description }) => (
              <label
                key={id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  role === id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={id}
                  checked={role === id}
                  onChange={() => setRole(id)}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    role === id ? 'bg-primary' : 'bg-surface-container'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${role === id ? 'text-on-primary' : 'text-on-surface-variant'}`} aria-hidden />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${role === id ? 'text-primary' : 'text-on-surface'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-snug mt-0.5">{description}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                agreed ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-primary'
              }`}
            >
              {agreed && (
                <svg className="w-2.5 h-2.5 text-on-primary" fill="none" viewBox="0 0 12 10" aria-hidden>
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-on-surface-variant leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-primary font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" aria-hidden />
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-on-surface-variant mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
