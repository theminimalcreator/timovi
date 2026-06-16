import { useEffect, useState } from 'react'
import { getCurrentProject, getProjects, addProject, setCurrentProject, removeProject, type ProjectData } from '../lib/api'

interface ProjectEntry {
  id: string
  name: string
  path: string
  phase: string
  featuresCompleted: number
}

interface ProjectConfig {
  name: string
  path: string
  phase: string
  bootstrapCompleted: boolean
  currentFeature: string | null
  activeRoles: string[]
  featuresCompleted: number
}

type DialogType = 'reconnect' | 'add' | 'remove' | null

export function ConfigScreen() {
  const [config, setConfig] = useState<ProjectConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [pathInput, setPathInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [reconnected, setReconnected] = useState(false)
  const [projects, setProjects] = useState<ProjectEntry[]>([])
  const [currentId, setCurrentId] = useState('')
  const [dialog, setDialog] = useState<DialogType>(null)
  const [dialogPath, setDialogPath] = useState('')
  const [dialogError, setDialogError] = useState('')
  const [apiError, setApiError] = useState('')

  const loadData = async () => {
    try {
      const current = await getCurrentProject()
      setCurrentId(current.id)
      setConfig({
        name: current.name,
        path: current.path,
        phase: current.state?.phase || '-',
        bootstrapCompleted: current.state?.bootstrap_completed || false,
        currentFeature: current.state?.current_feature || null,
        activeRoles: current.state?.active_roles || [],
        featuresCompleted: (current.state?.features || []).filter((f) => f.status === 'done').length,
      })
      setPathInput(current.path)

      const allProjects = await getProjects()
      setProjects(allProjects.map((p) => ({
        id: p.id,
        name: p.name,
        path: p.path,
        phase: p.state?.phase || 'ready',
        featuresCompleted: (p.state?.features || []).filter((f) => f.status === 'done').length,
      })))
      setApiError('')
    } catch {
      setApiError('API offline — usando localStorage')
      // Fallback to localStorage
      const resp = await fetch('/.product-team/state.json')
      const state = await resp.json()
      const projectPath = localStorage.getItem('timovi-project-path') || state.project_path || '~/projects/timovi'
      setConfig({
        name: state.project || 'Timovi',
        path: projectPath,
        phase: state.phase || '-',
        bootstrapCompleted: state.bootstrap_completed || false,
        currentFeature: state.current_feature || null,
        activeRoles: state.active_roles || [],
        featuresCompleted: (state.features || []).filter((f: { status: string }) => f.status === 'done').length,
      })
      setPathInput(projectPath)
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handlePathChange = (value: string) => {
    setPathInput(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const openDialog = (type: DialogType) => {
    setDialog(type)
    setDialogPath(type === 'reconnect' ? pathInput : '')
    setDialogError('')
  }

  const closeDialog = () => {
    setDialog(null)
    setDialogPath('')
    setDialogError('')
  }

  const handleReconnect = async () => {
    const trimmed = dialogPath.trim()
    if (!trimmed) { setDialogError('Informe o caminho do projeto'); return }
    try {
      // Try to add as new project (API validates state.json exists)
      const project = await addProject(trimmed)
      await setCurrentProject(project.id)
      closeDialog()
      setLoading(true)
      await loadData()
      setReconnected(true)
      setTimeout(() => setReconnected(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro'
      if (msg.includes('already connected') || msg.includes('409')) {
        // Project exists, just switch to it
        const allProjects = await getProjects()
        const existing = allProjects.find((p) => p.path === trimmed)
        if (existing) {
          await setCurrentProject(existing.id)
          closeDialog()
          setLoading(true)
          await loadData()
          setReconnected(true)
          setTimeout(() => setReconnected(false), 3000)
          return
        }
      }
      setDialogError(msg)
    }
  }

  const handleAddProject = async () => {
    const trimmed = dialogPath.trim()
    if (!trimmed) { setDialogError('Informe o caminho do projeto'); return }
    try {
      await addProject(trimmed)
      closeDialog()
      setLoading(true)
      await loadData()
    } catch (err: unknown) {
      setDialogError(err instanceof Error ? err.message : 'Erro ao conectar')
    }
  }

  const handleRemoveProject = async (projectId: string) => {
    try {
      await removeProject(projectId)
      setLoading(true)
      await loadData()
    } catch {
      // local fallback
      const updated = projects.filter((p) => p.id !== projectId)
      setProjects(updated)
    }
  }

  const handleSwitchProject = async (projectId: string) => {
    try {
      await setCurrentProject(projectId)
      setLoading(true)
      await loadData()
      setReconnected(true)
      setTimeout(() => setReconnected(false), 3000)
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)]">
        <span className="material-symbols-outlined animate-spin text-2xl mr-2 align-middle">progress_activity</span>
        Carregando configuração...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl space-y-4">
      {apiError && (
        <div className="bg-[rgba(245,158,11,0.1)] border border-[var(--color-accent)] rounded-lg px-4 py-2 text-sm text-[var(--color-accent)]">
          ⚠️ {apiError}
        </div>
      )}

      {/* Project Info */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white font-[family-name:var(--font-heading)]">
            📁 Projeto: {config?.name || 'Timovi'}
          </h3>
          {reconnected && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[rgba(0,230,57,0.1)] text-[var(--color-success)] font-medium">
              ✅ Reconectado
            </span>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)] flex-shrink-0">Path</span>
            <input
              type="text"
              value={pathInput}
              onChange={(e) => handlePathChange(e.target.value)}
              className="flex-1 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-1.5 text-[var(--color-text)] font-[family-name:var(--font-mono)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="/root/projects/timovi"
            />
            {saved && (
              <span className="text-[11px] text-[var(--color-success)] flex-shrink-0 animate-pulse">✓ Salvo</span>
            )}
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)]">Fase</span>
            <span className="text-sm text-[var(--color-text)]">{config?.phase}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)]">Bootstrap</span>
            <span className="text-sm" style={{ color: config?.bootstrapCompleted ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
              {config?.bootstrapCompleted ? '✅ Concluído' : '⏳ Pendente'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)]">Feature atual</span>
            <span className="text-sm text-[var(--color-primary)]">{config?.currentFeature || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-muted)]">Roles ativas</span>
            <span className="text-sm text-[var(--color-text)]">{config?.activeRoles.length || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-[var(--color-text-muted)]">Features concluídas</span>
            <span className="text-sm text-[var(--color-success)]">{config?.featuresCompleted || 0}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--color-border)]">
          <button onClick={() => openDialog('reconnect')} className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors">
            🔄 Reconectar
          </button>
          <button onClick={() => openDialog('remove')} className="px-4 py-2 text-sm rounded-lg border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[rgba(255,180,171,0.05)] transition-colors">
            🗑️ Remover
          </button>
        </div>
      </div>

      {/* Connected Projects */}
      {projects.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h3 className="text-base font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
            🔗 Projetos conectados
          </h3>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className={`flex items-center justify-between py-2 px-3 rounded-md border transition-colors cursor-pointer ${
                  proj.id === currentId
                    ? 'bg-[rgba(0,230,57,0.05)] border-[var(--color-primary)]'
                    : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                }`}
                onClick={() => proj.id !== currentId && handleSwitchProject(proj.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">📁</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {proj.name}
                      {proj.id === currentId && (
                        <span className="ml-2 text-[10px] text-[var(--color-primary)] font-normal">(atual)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] truncate">
                      {proj.path}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[var(--color-text-muted)]">{proj.featuresCompleted} features</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveProject(proj.id) }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                    title="Remover projeto"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Project */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
        <h3 className="text-base font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
          ➕ Adicionar novo projeto
        </h3>
        <p className="text-[13px] text-[var(--color-text-muted)] mb-4">
          Conecte outro projeto Timovi ao Dashboard. O projeto precisa ter um{' '}
          <code className="text-xs bg-[var(--color-surface-higher)] px-1.5 py-0.5 rounded text-[var(--color-accent)]">
            .product-team/state.json
          </code>{' '}
          válido.
        </p>
        <button onClick={() => openDialog('add')} className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-black font-semibold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-base align-middle mr-1">add</span>
          Conectar projeto
        </button>
      </div>

      {/* Dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeDialog}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 w-[440px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                {dialog === 'reconnect' && '🔄 Reconectar projeto'}
                {dialog === 'add' && '➕ Conectar novo projeto'}
                {dialog === 'remove' && '🗑️ Remover projeto'}
              </h3>
              <button onClick={closeDialog} className="text-[var(--color-text-muted)] hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>

            {(dialog === 'reconnect' || dialog === 'add') && (
              <>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {dialog === 'reconnect' ? 'Informe o novo caminho do projeto.' : 'Informe o caminho da pasta do projeto Timovi.'}
                </p>
                <input
                  type="text" value={dialogPath}
                  onChange={(e) => { setDialogPath(e.target.value); setDialogError('') }}
                  placeholder="/root/projects/meu-projeto"
                  className="w-full text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text)] font-[family-name:var(--font-mono)] focus:outline-none focus:border-[var(--color-primary)] mb-2"
                  autoFocus onKeyDown={(e) => e.key === 'Enter' && (dialog === 'reconnect' ? handleReconnect() : handleAddProject())}
                />
                {dialogError && <p className="text-xs text-[var(--color-danger)] mb-2">{dialogError}</p>}
                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={closeDialog} className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)]">Cancelar</button>
                  <button onClick={dialog === 'reconnect' ? handleReconnect : handleAddProject} className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-black font-semibold">
                    {dialog === 'reconnect' ? 'Reconectar' : 'Conectar'}
                  </button>
                </div>
              </>
            )}

            {dialog === 'remove' && (
              <>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">Selecione o projeto para remover do Dashboard. Arquivos em disco não serão afetados.</p>
                {projects.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)] text-center py-4">Nenhum projeto conectado.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {projects.map((proj) => (
                      <div key={proj.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-[var(--color-bg)]">
                        <span className="text-sm text-[var(--color-text)] font-[family-name:var(--font-mono)] truncate">{proj.path}</span>
                        <button onClick={() => handleRemoveProject(proj.id)} className="text-[var(--color-danger)] text-sm font-medium">Remover</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={closeDialog} className="px-4 py-2 text-sm rounded-lg bg-[var(--color-surface-higher)] text-[var(--color-text)]">Fechar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
