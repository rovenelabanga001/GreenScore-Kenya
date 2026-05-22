'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'

type Role = 'project_owner' | 'funder'

type ScoreBreakdown = {
  environmental_impact: number
  social_impact: number
  governance_and_transparency: number
  financial_readiness: number
  climate_risk_adjustment: number
  total_score: number
}

type Project = {
  id: number
  name: string
  description: string | null
  category: string | null
  county: string | null
  budget: number
  status: 'pending' | 'funded'
  owner_id: number
  funded_by: number | null
  funded_amount: number | null
  greenscore: ScoreBreakdown | null
  funding_match_probability?: number
  funding_match_label?: 'high' | 'medium' | 'low'
}

type AuthUser = {
  id: number
  username: string
  email: string
  role: Role
  target_green_score: number | null
}

type NewProjectForm = {
  name: string
  description: string
  category: string
  county: string
  budget: string
  environmental_impact: string
  social_impact: string
  governance_and_transparency: string
  financial_readiness: string
  climate_risk_adjustment: string
}

const API_BASE_URL = 'https://greenscore-kenya.onrender.com'

const DEFAULT_PROJECT_FORM: NewProjectForm = {
  name: '',
  description: '',
  category: '',
  county: '',
  budget: '',
  environmental_impact: '',
  social_impact: '',
  governance_and_transparency: '',
  financial_readiness: '',
  climate_risk_adjustment: '',
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const storedUserRaw = localStorage.getItem('auth_user')
    if (!storedUserRaw) {
      return null
    }

    try {
      return JSON.parse(storedUserRaw) as AuthUser
    } catch {
      return null
    }
  })

  const [role] = useState<Role | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const storedRoleRaw = localStorage.getItem('auth_role')
    if (storedRoleRaw === 'project_owner' || storedRoleRaw === 'funder') {
      return storedRoleRaw
    }

    return null
  })

  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    const hasUser = Boolean(localStorage.getItem('auth_user'))
    const hasRole = Boolean(localStorage.getItem('auth_role'))
    if (!hasUser || !hasRole) {
      return 'No active session found. Please sign in again.'
    }

    return ''
  })

  const [createProjectForm, setCreateProjectForm] = useState<NewProjectForm>(DEFAULT_PROJECT_FORM)
  const [creatingProject, setCreatingProject] = useState(false)
  const [ownerProjects, setOwnerProjects] = useState<Project[]>([])

  const [targetScore, setTargetScore] = useState(() => {
    if (typeof window === 'undefined') {
      return '60'
    }

    const storedRoleRaw = localStorage.getItem('auth_role')
    const storedUserRaw = localStorage.getItem('auth_user')
    if (storedRoleRaw !== 'funder' || !storedUserRaw) {
      return '60'
    }

    try {
      const parsedUser = JSON.parse(storedUserRaw) as AuthUser
      return String(parsedUser.target_green_score ?? 60)
    } catch {
      return '60'
    }
  })
  const [savingTarget, setSavingTarget] = useState(false)
  const [marketplaceProjects, setMarketplaceProjects] = useState<Project[]>([])
  const [fundingAmounts, setFundingAmounts] = useState<Record<number, string>>({})
  const [fundingProjectId, setFundingProjectId] = useState<number | null>(null)

  const currentTargetScore = useMemo(() => {
    const parsed = Number(targetScore)
    if (Number.isNaN(parsed)) {
      return null
    }
    return parsed
  }, [targetScore])

  const fetchOwnerProjects = useCallback(async (ownerId: number) => {
    const response = await fetch(`${API_BASE_URL}/projects/owner/${ownerId}`)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error ?? 'Unable to load your projects.')
    }

    setOwnerProjects(Array.isArray(data.projects) ? data.projects : [])
  }, [])

  const fetchMarketplace = useCallback(async (funderId: number) => {
    const response = await fetch(`${API_BASE_URL}/projects/marketplace?funder_id=${funderId}`)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error ?? 'Unable to load marketplace projects.')
    }

    setMarketplaceProjects(Array.isArray(data.projects) ? data.projects : [])
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!user || !role) {
        return
      }

      setError('')
      try {
        if (role === 'project_owner') {
          await fetchOwnerProjects(user.id)
        } else {
          await fetchMarketplace(user.id)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load dashboard data.'
        setError(message)
      }
    }

    void loadData()
  }, [fetchMarketplace, fetchOwnerProjects, role, user])

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      setError('You need to sign in first.')
      return
    }

    setError('')
    setCreatingProject(true)

    try {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createProjectForm,
          budget: Number(createProjectForm.budget),
          environmental_impact: Number(createProjectForm.environmental_impact),
          social_impact: Number(createProjectForm.social_impact),
          governance_and_transparency: Number(createProjectForm.governance_and_transparency),
          financial_readiness: Number(createProjectForm.financial_readiness),
          climate_risk_adjustment: Number(createProjectForm.climate_risk_adjustment),
          owner_id: user.id,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to submit project.')
      }

      setCreateProjectForm(DEFAULT_PROJECT_FORM)
      await fetchOwnerProjects(user.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to submit project.'
      setError(message)
    } finally {
      setCreatingProject(false)
    }
  }

  const handleSaveTarget = async () => {
    if (!user || role !== 'funder') {
      return
    }

    if (currentTargetScore === null || currentTargetScore < 0 || currentTargetScore > 100) {
      setError('Target GreenScore must be between 0 and 100.')
      return
    }

    setError('')
    setSavingTarget(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/funder-target`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          target_green_score: currentTargetScore,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to save target score.')
      }

      const updatedUser = data.user as AuthUser
      setUser(updatedUser)
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      await fetchMarketplace(updatedUser.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save target score.'
      setError(message)
    } finally {
      setSavingTarget(false)
    }
  }

  const handleFundProject = async (projectId: number) => {
    if (!user || role !== 'funder') {
      return
    }

    const amount = Number(fundingAmounts[projectId] ?? '')
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Enter a valid funding amount greater than zero.')
      return
    }

    setError('')
    setFundingProjectId(projectId)
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funder_id: user.id,
          amount,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to fund project.')
      }

      await fetchMarketplace(user.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fund project.'
      setError(message)
    } finally {
      setFundingProjectId(null)
    }
  }

  if (!role || !user) {
    return (
      <main className="min-h-screen bg-surface-container-lowest px-4 py-12">
        <section className="mx-auto max-w-3xl rounded-2xl border border-outline-variant bg-surface p-6">
          <p className="text-on-surface-variant">{error || 'No active session found. Please sign in again.'}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-container-lowest px-4 py-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-outline-variant bg-surface p-6">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="mt-2 text-on-surface-variant">
            {role === 'project_owner'
              ? 'Submit projects and get an instant GreenScore out of 100.'
              : 'Set your preferred GreenScore target and fund top-ranked projects.'}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-error bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}

        {role === 'project_owner' && (
          <>
            <section className="rounded-2xl border border-outline-variant bg-surface p-6">
              <h2 className="text-xl font-semibold text-on-surface">Submit a Green Project</h2>
              <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleCreateProject}>
                <input
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                  placeholder="Project name"
                  required
                  value={createProjectForm.name}
                  onChange={(event) => setCreateProjectForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                  placeholder="Category / Sector"
                  required
                  value={createProjectForm.category}
                  onChange={(event) => setCreateProjectForm((prev) => ({ ...prev, category: event.target.value }))}
                />
                <input
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                  placeholder="County"
                  required
                  value={createProjectForm.county}
                  onChange={(event) => setCreateProjectForm((prev) => ({ ...prev, county: event.target.value }))}
                />
                <input
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                  placeholder="Budget (KES)"
                  type="number"
                  min="1"
                  required
                  value={createProjectForm.budget}
                  onChange={(event) => setCreateProjectForm((prev) => ({ ...prev, budget: event.target.value }))}
                />
                <textarea
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm md:col-span-2"
                  placeholder="Project description"
                  required
                  rows={3}
                  value={createProjectForm.description}
                  onChange={(event) => setCreateProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                />

                {[
                  ['environmental_impact', 'Environmental Impact (0-100)'],
                  ['social_impact', 'Social Impact (0-100)'],
                  ['governance_and_transparency', 'Governance & Transparency (0-100)'],
                  ['financial_readiness', 'Financial Readiness (0-100)'],
                  ['climate_risk_adjustment', 'Climate Risk Adjustment (0-100)'],
                ].map(([field, label]) => (
                  <input
                    key={field}
                    className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                    placeholder={label}
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={createProjectForm[field as keyof NewProjectForm]}
                    onChange={(event) =>
                      setCreateProjectForm((prev) => ({
                        ...prev,
                        [field]: event.target.value,
                      }))
                    }
                  />
                ))}

                <button
                  type="submit"
                  disabled={creatingProject}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:opacity-60 md:col-span-2"
                >
                  {creatingProject ? 'Submitting...' : 'Submit Project and Calculate GreenScore'}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-outline-variant bg-surface p-6">
              <h2 className="text-xl font-semibold text-on-surface">My Projects</h2>
              <div className="mt-4 space-y-3">
                {ownerProjects.length === 0 && (
                  <p className="text-sm text-on-surface-variant">No projects submitted yet.</p>
                )}

                {ownerProjects.map((project) => (
                  <article key={project.id} className="rounded-xl border border-outline-variant p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-on-surface">{project.name}</h3>
                      <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                        GreenScore: {project.greenscore?.total_score ?? 'N/A'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{project.description ?? 'No description provided.'}</p>
                    <p className="mt-2 text-xs text-on-surface-variant">
                      Status: {project.status} | Budget: KES {project.budget.toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {role === 'funder' && user && (
          <>
            <section className="rounded-2xl border border-outline-variant bg-surface p-6">
              <h2 className="text-xl font-semibold text-on-surface">Funding Preferences</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Set your target GreenScore to prioritize projects you are most likely to fund.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-48 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                  value={targetScore}
                  onChange={(event) => setTargetScore(event.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSaveTarget}
                  disabled={savingTarget}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:opacity-60"
                >
                  {savingTarget ? 'Saving...' : 'Save Target'}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant bg-surface p-6">
              <h2 className="text-xl font-semibold text-on-surface">Projects Available for Funding</h2>
              <div className="mt-4 space-y-3">
                {marketplaceProjects.length === 0 && (
                  <p className="text-sm text-on-surface-variant">No pending projects match your current criteria.</p>
                )}

                {marketplaceProjects.map((project) => (
                  <article key={project.id} className="rounded-xl border border-outline-variant p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-on-surface">{project.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                          Score: {project.greenscore?.total_score ?? 'N/A'}
                        </span>
                        <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                          Match: {Math.round((project.funding_match_probability ?? 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{project.description ?? 'No description provided.'}</p>
                    <p className="mt-2 text-xs text-on-surface-variant">
                      Category: {project.category ?? 'N/A'} | County: {project.county ?? 'N/A'} | Budget: KES{' '}
                      {project.budget.toLocaleString()} | Match level: {project.funding_match_label ?? 'N/A'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Funding amount"
                        className="w-44 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                        value={fundingAmounts[project.id] ?? ''}
                        onChange={(event) =>
                          setFundingAmounts((prev) => ({
                            ...prev,
                            [project.id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        disabled={fundingProjectId === project.id}
                        onClick={() => void handleFundProject(project.id)}
                        className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-on-secondary disabled:opacity-60"
                      >
                        {fundingProjectId === project.id ? 'Funding...' : 'Fund Project'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}