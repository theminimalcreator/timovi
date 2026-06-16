import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { RoleDrawer } from '../components/RoleDrawer'

interface RoleCard {
  name: string
  slug: string
  icon: string
  section: string
}

interface TeamMemory {
  file: string
  content: string
}

const ROLES: RoleCard[] = [
  { name: 'Product Manager', slug: 'product-manager', icon: '🧠', section: '🎯 Estratégia' },
  { name: 'UX Designer', slug: 'ux-designer', icon: '🎨', section: '🎯 Estratégia' },
  { name: 'Software Architect', slug: 'software-architect', icon: '🏗️', section: '🎯 Estratégia' },
  { name: 'Tech Lead', slug: 'tech-lead', icon: '⚡', section: '🎯 Estratégia' },
  { name: 'Frontend Engineer', slug: 'frontend-engineer', icon: '🖥️', section: '⚙️ Engenharia' },
  { name: 'Backend Engineer', slug: 'backend-engineer', icon: '⚙️', section: '⚙️ Engenharia' },
  { name: 'DBA', slug: 'dba', icon: '🗄️', section: '⚙️ Engenharia' },
  { name: 'QA Engineer', slug: 'quality-engineer', icon: '🧪', section: '✅ Qualidade' },
  { name: 'DevOps', slug: 'devops', icon: '🚀', section: '✅ Qualidade' },
  { name: 'Head of Marketing', slug: 'head-marketing', icon: '📣', section: '📢 Marketing & Conteúdo' },
  { name: 'Tech Writer', slug: 'tech-writer', icon: '✍️', section: '📢 Marketing & Conteúdo' },
  { name: 'LinkedIn', slug: 'linkedin', icon: '💼', section: '📢 Marketing & Conteúdo' },
  { name: 'Instagram', slug: 'instagram', icon: '📸', section: '📢 Marketing & Conteúdo' },
]

export function TeamScreen() {
  const sections = [...new Set(ROLES.map((r) => r.section))]
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(null)
  const [teamMemories, setTeamMemories] = useState<TeamMemory[]>([])
  const [expandedTeamMem, setExpandedTeamMem] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/team/memories')
      .then((r) => r.json())
      .then((data) => setTeamMemories(data.memories || []))
      .catch(() => {})
  }, [])

  return (
    <div className="p-6 space-y-8">
      {sections.map((section) => (
        <div key={section}>
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-heading)] uppercase tracking-wide">
            {section}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ROLES.filter((r) => r.section === section).map((role) => (
              <div
                key={role.slug}
                onClick={() => setSelectedRole(role)}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white font-[family-name:var(--font-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                      {role.name}
                    </h4>
                    <div className="text-[11px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                      {role.slug}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      <span className="text-[11px] text-[var(--color-success)]">Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Team Memories */}
      {teamMemories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-heading)] uppercase tracking-wide">
            📚 Memórias do Time
          </h3>
          <div className="space-y-2">
            {teamMemories.map((mem) => (
              <div key={mem.file} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedTeamMem(expandedTeamMem === mem.file ? null : mem.file)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-higher)] transition-colors text-left"
                >
                  <span className="text-sm font-medium text-[var(--color-text)]">{mem.file}</span>
                  <span className="material-symbols-outlined text-[var(--color-text-muted)] text-lg transition-transform" style={{ transform: expandedTeamMem === mem.file ? 'rotate(180deg)' : '' }}>
                    expand_more
                  </span>
                </button>
                {expandedTeamMem === mem.file && (
                  <div className="px-5 py-4 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{mem.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {teamMemories.length === 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-heading)] uppercase tracking-wide">
            📚 Memórias do Time
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">Nenhuma memória do time registrada.</p>
        </div>
      )}

      {/* Role Drawer */}
      {selectedRole && (
        <RoleDrawer
          role={selectedRole}
          open={!!selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  )
}
