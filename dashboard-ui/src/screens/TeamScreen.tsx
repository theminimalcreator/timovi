interface RoleCard {
  name: string
  slug: string
  icon: string
  section: string
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

  return (
    <div className="p-6 space-y-6">
      {sections.map((section) => (
        <div key={section}>
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-heading)] uppercase tracking-wide">
            {section}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ROLES.filter((r) => r.section === section).map((role) => (
              <div
                key={role.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white font-[family-name:var(--font-heading)]">
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
    </div>
  )
}
