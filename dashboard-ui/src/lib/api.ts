const API = '/api'

export interface ProjectData {
  id: string
  name: string
  path: string
  connectedAt: string
  state?: {
    user_name: string
    project: string
    phase: string
    bootstrap_completed: boolean
    current_feature: string | null
    pipeline_phase: string | null
    active_roles: string[]
    features: Array<{ name: string; status: string }>
    description?: string
  }
}

export interface FeatureData {
  name: string
  status: string
  pipeline_phase: string
  issues: IssueData[]
}

export interface IssueData {
  id: string
  title: string
  status: string
  assigned_roles: string[]
  blocked_by: string[]
}

export async function getCurrentProject(): Promise<ProjectData> {
  const res = await fetch(`${API}/projects/current`)
  if (!res.ok) throw new Error('Failed to fetch project')
  return res.json()
}

export async function getProjects(): Promise<ProjectData[]> {
  const res = await fetch(`${API}/projects`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function addProject(projectPath: string, name?: string) {
  const res = await fetch(`${API}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectPath, name }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || 'Failed to add project')
  }
  return res.json()
}

export async function setCurrentProject(projectId: string): Promise<ProjectData> {
  const res = await fetch(`${API}/projects/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  })
  if (!res.ok) throw new Error('Failed to set current project')
  return res.json()
}

export async function removeProject(projectId: string) {
  const res = await fetch(`${API}/projects/${projectId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove project')
}

export async function getFeature(projectId: string, featureName: string): Promise<FeatureData> {
  const res = await fetch(`${API}/projects/${projectId}/feature/${featureName}`)
  if (!res.ok) throw new Error('Feature not found')
  return res.json()
}
