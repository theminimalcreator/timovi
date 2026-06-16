import { useEffect, useState } from 'react'
import { getCurrentProject, getFeature, type IssueData } from '../lib/api'

const PIPELINE_PHASES = ['plan', 'spec', 'breakdown', 'execute', 'review']
const PHASE_LABELS: Record<string, string> = {
  plan: 'Plan', spec: 'Spec', breakdown: 'Breakdown', execute: 'Execute', review: 'Review',
}
const PHASE_ICONS: Record<string, string> = {
  plan: '🧠', spec: '📄', breakdown: '🧩', execute: '⚡', review: '✅',
}
const STATUS_DOT: Record<string, string> = {
  done: 'bg-[var(--color-success)]',
  in_progress: 'bg-[var(--color-accent)]',
  pending: 'bg-[var(--color-text-muted)]',
  blocked: 'bg-[var(--color-danger)]',
  cancelled: 'bg-red-500',
  failed: 'bg-[var(--color-danger)]',
}
const ROLE_LABEL: Record<string, string> = {
  'frontend-engineer': 'FE', 'backend-engineer': 'BE', dba: 'DB', devops: 'DO',
  'quality-engineer': 'QA', 'tech-lead': 'TL', 'product-manager': 'PM',
  'ux-designer': 'UX', 'software-architect': 'SA',
}

export function KanbanScreen() {
  const [issues, setIssues] = useState<IssueData[]>([])
  const [currentPhase, setCurrentPhase] = useState('')
  const [currentFeature, setCurrentFeature] = useState('')
  const [projectId, setProjectId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCurrentProject()
      .then((proj) => {
        setProjectId(proj.id)
        setCurrentPhase(proj.state?.pipeline_phase || '')
        const feat = proj.state?.current_feature
        if (feat && proj.id) {
          setCurrentFeature(feat)
          return getFeature(proj.id, feat)
        }
        return null
      })
      .then((feature) => {
        if (feature?.issues) setIssues(feature.issues)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Carregando Kanban...</div>

  return (
    <div className="p-6">
      {error && (
        <div className="text-xs text-[var(--color-accent)] mb-3 bg-[rgba(245,158,11,0.1)] px-3 py-1.5 rounded-md">
          ⚠️ {error} — usando fallback local
        </div>
      )}
      <div className="text-xs text-[var(--color-text-muted)] mb-3">
        Feature: <span className="text-[var(--color-primary)]">{currentFeature || '—'}</span> · Fase: <span className="text-white">{currentPhase || '—'}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        {PIPELINE_PHASES.map((phase) => {
          const isActive = phase === currentPhase
          const colIssues = isActive ? issues : []
          return (
            <div key={phase} className={`flex-shrink-0 w-64 rounded-lg border ${isActive ? 'border-[var(--color-primary)] bg-[rgba(0,230,57,0.03)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <span className={`text-sm font-semibold font-[family-name:var(--font-heading)] ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                  {PHASE_ICONS[phase]} {PHASE_LABELS[phase]}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-higher)] px-2 py-0.5 rounded-full">{colIssues.length}</span>
              </div>
              <div className="p-2 space-y-2">
                {colIssues.length === 0 && <div className="text-xs text-[var(--color-text-muted)] text-center py-8">Nenhuma Issue</div>}
                {colIssues.map((issue) => (
                  <div key={issue.id} className={`bg-[var(--color-surface-higher)] border border-[var(--color-border)] rounded-md p-3 ${issue.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{issue.id}</span>
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[issue.status] || 'bg-gray-500'}`} />
                    </div>
                    <div className={`text-[13px] font-medium text-[var(--color-text)] leading-snug ${issue.status === 'cancelled' ? 'line-through' : ''}`}>
                      {issue.title}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {issue.assigned_roles.map((role) => (
                        <span key={role} className="text-[10px] px-1.5 py-0.5 rounded font-semibold font-[family-name:var(--font-mono)] bg-[rgba(0,230,57,0.1)] text-[var(--color-primary)]">
                          {ROLE_LABEL[role] || role.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                      {issue.blocked_by.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,180,171,0.1)] text-[var(--color-danger)]">⛓ {issue.blocked_by.length}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
