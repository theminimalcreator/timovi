import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RoleDrawerProps {
  role: { name: string; slug: string; icon: string }
  open: boolean
  onClose: () => void
}

interface Memory {
  file: string
  content: string
}

const REQUIRED_SECTIONS = [
  '## On activation',
  '## Responsibilities',
  '## Handoffs',
  '## Behavior',
  '## Guardrails',
  '## Workflows',
]

export function RoleDrawer({ role, open, onClose }: RoleDrawerProps) {
  const [skillContent, setSkillContent] = useState('')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedMemory, setExpandedMemory] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [skillRes, memRes] = await Promise.all([
        fetch(`/api/roles/${role.slug}/skill`),
        fetch(`/api/roles/${role.slug}/memories`),
      ])
      if (skillRes.ok) {
        const skill = await skillRes.json()
        setSkillContent(skill.content)
      }
      if (memRes.ok) {
        const mem = await memRes.json()
        setMemories(mem.memories || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [role.slug])

  useEffect(() => {
    if (open) {
      setPreview(false)
      setSaved(false)
      setWarnings([])
      setExpandedMemory(null)
      loadData()
    }
  }, [open, loadData])

  const handleClose = () => {
    setSkillContent('')
    setMemories([])
    setLoading(false)
    onClose()
  }

  const insertMarkdown = (before: string, after = '') => {
    setSkillContent((prev) => {
      const textarea = document.querySelector('.role-editor-textarea') as HTMLTextAreaElement
      if (!textarea) return prev
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = prev.substring(start, end)
      const newText = prev.substring(0, start) + before + selected + after + prev.substring(end)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
      }, 0)
      return newText
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setWarnings([])
    const missing = REQUIRED_SECTIONS.filter((s) => !skillContent.includes(s))
    setWarnings(missing.map((s) => `Seção faltando: ${s}`))

    try {
      const res = await fetch(`/api/roles/${role.slug}/skill`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: skillContent }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={handleClose} />
      <div className="fixed top-0 right-0 h-full w-[60%] min-w-[500px] max-w-[800px] bg-[var(--color-bg)] border-l border-[var(--color-border)] z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{role.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">{role.name}</h2>
              <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{role.slug}</span>
            </div>
          </div>
          <button onClick={handleClose} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)] py-12">
              <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide font-[family-name:var(--font-heading)]">
                    📄 SKILL.md
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreview(!preview)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        preview
                          ? 'bg-[var(--color-primary)] text-black border-[var(--color-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {preview ? '✏️ Editor' : '👁️ Preview'}
                    </button>
                    {!preview && (
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-1.5 text-xs rounded-md bg-[var(--color-primary)] text-black font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? 'Salvando...' : saved ? '✅ Salvo' : 'Salvar'}
                      </button>
                    )}
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="mb-3 bg-[rgba(245,158,11,0.1)] border border-[var(--color-accent)] rounded-md px-3 py-2">
                    {warnings.map((w, i) => (
                      <div key={i} className="text-xs text-[var(--color-accent)]">⚠️ {w}</div>
                    ))}
                  </div>
                )}

                {preview ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 overflow-auto markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{skillContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {[
                        { label: 'B', action: () => insertMarkdown('**', '**'), title: 'Bold' },
                        { label: 'H2', action: () => insertMarkdown('\n## '), title: 'Heading 2' },
                        { label: 'H3', action: () => insertMarkdown('\n### '), title: 'Heading 3' },
                        { label: '•', action: () => insertMarkdown('\n- '), title: 'Lista' },
                        { label: '`', action: () => insertMarkdown('`', '`'), title: 'Código inline' },
                        { label: '🔗', action: () => insertMarkdown('[', '](url)'), title: 'Link' },
                      ].map((btn) => (
                        <button
                          key={btn.title}
                          onClick={btn.action}
                          title={btn.title}
                          className="px-2.5 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text-muted)] font-[family-name:var(--font-mono)] transition-colors"
                        >
                          {btn.label}
                        </button>
                      ))}
                      <span className="text-[10px] text-[var(--color-text-muted)] ml-auto self-center">
                        {skillContent.length} chars
                      </span>
                    </div>

                    <textarea
                      className="role-editor-textarea w-full h-[400px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 text-sm text-[var(--color-text)] font-[family-name:var(--font-mono)] focus:outline-none focus:border-[var(--color-primary)] resize-y"
                      value={skillContent}
                      onChange={(e) => setSkillContent(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide font-[family-name:var(--font-heading)] mb-3">
                  🧠 Memórias da Role
                </h3>
                {memories.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">Nenhuma memória registrada.</p>
                ) : (
                  <div className="space-y-2">
                    {memories.map((mem) => (
                      <div key={mem.file} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedMemory(expandedMemory === mem.file ? null : mem.file)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-higher)] transition-colors text-left"
                        >
                          <span className="text-sm font-medium text-[var(--color-text)]">{mem.file}</span>
                          <span className="material-symbols-outlined text-[var(--color-text-muted)] text-lg transition-transform" style={{ transform: expandedMemory === mem.file ? 'rotate(180deg)' : '' }}>
                            expand_more
                          </span>
                        </button>
                        {expandedMemory === mem.file && (
                          <div className="px-5 py-4 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{mem.content}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
