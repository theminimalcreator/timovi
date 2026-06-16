import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import { getCurrentProject } from '../lib/api'

interface SidebarProps {
  activeScreen: string
  workflowTab?: string
  onNavigate: (screen: string) => void
  onWorkflowNavigate?: (workflow: string) => void
}

const navItems = [
  { id: 'kanban', label: 'Kanban', icon: 'view_kanban' },
  { id: 'team', label: 'Time', icon: 'groups' },
  { id: 'workflow', label: 'Workflows', icon: 'account_tree' },
  { id: 'config', label: 'Config', icon: 'settings' },
]

export function Sidebar({ activeScreen, workflowTab: _workflowTab, onNavigate, onWorkflowNavigate: _onWorkflowNavigate }: SidebarProps) {
  const [projectPath, setProjectPath] = useState('~/projects/timovi')

  useEffect(() => {
    const saved = localStorage.getItem('timovi-project-path')
    if (saved) setProjectPath(saved)
    getCurrentProject().then((p) => setProjectPath(p.path)).catch(() => {})
  }, [])

  return (
    <aside className="w-[260px] min-w-[260px] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col pt-2">
      <div className="px-5 py-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
        <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-white tracking-[-0.5px]">
          Timovi
        </span>
      </div>

      <div className="px-5 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
        Navegação
      </div>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={cn(
            'flex items-center gap-2.5 mx-2 px-5 py-2.5 text-sm font-medium rounded-lg text-left transition-colors',
            activeScreen === item.id
              ? 'bg-[var(--color-surface-higher)] text-[var(--color-primary)]'
              : 'text-[var(--color-text)] hover:bg-[var(--color-surface-higher)]'
          )}
        >
          <span className="material-symbols-outlined text-xl text-[var(--color-text-muted)]">
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}

      <div className="flex-1" />

      <div className="border-t border-[var(--color-border)] p-3 flex items-center gap-2.5 cursor-pointer hover:bg-[var(--color-surface-higher)] transition-colors">
        <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-xs font-bold text-black font-[family-name:var(--font-mono)]">
          T
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-white">Timovi</div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] truncate">
            {projectPath}
          </div>
        </div>
        <span className="material-symbols-outlined text-lg text-[var(--color-text-muted)]">
          swap_horiz
        </span>
      </div>
    </aside>
  )
}
