import { useState } from 'react'
import { WorkflowGraph } from '../components/WorkflowGraph'

export const WORKFLOW_TABS = [
  { id: 'pipeline', label: '🪮 Pipeline' },
  { id: 'bootstrap', label: '🚀 Bootstrap' },
  { id: 'new-feature', label: '✨ Nova Feature' },
  { id: 'bug-fix', label: '🐛 Bug Fix' },
  { id: 'deploy', label: '📦 Deploy' },
]

const WORKFLOW_BADGES: Record<string, { label: string; color: string }[]> = {
  pipeline: [
    { label: 'Macro', color: '#00e639' },
    { label: '5 Fases', color: '#6366f1' },
  ],
  bootstrap: [
    { label: 'Macro', color: '#00e639' },
    { label: '4 Etapas', color: '#6366f1' },
  ],
  'new-feature': [
    { label: 'Micro', color: '#f59e0b' },
    { label: '5 Fases', color: '#6366f1' },
  ],
  'bug-fix': [
    { label: 'Micro', color: '#f59e0b' },
    { label: '3 Fases', color: '#ef4444' },
  ],
  deploy: [
    { label: 'Micro', color: '#f59e0b' },
    { label: '4 Fases', color: '#a78bfa' },
  ],
}

interface WorkflowScreenProps {
  initialTab?: string
}

export function WorkflowScreen({ initialTab }: WorkflowScreenProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'pipeline')
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4">
        {WORKFLOW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-2 px-6 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        {(WORKFLOW_BADGES[activeTab] || []).map((b, i) => (
          <span
            key={i}
            className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: `${b.color}15`, color: b.color }}
          >
            {b.label}
          </span>
        ))}
        {expandedPhase && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-[rgba(0,230,57,0.1)] text-[var(--color-primary)] ml-auto">
            📍 {expandedPhase}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-6 py-2 text-[11px] text-[var(--color-text-muted)] border-b border-[var(--color-border)] flex-wrap">
        <span className="font-semibold text-white mr-1">Step types:</span>
        {[
          { label: 'action', color: '#00e639' },
          { label: 'round', color: '#6366f1' },
          { label: 'decision', color: '#f59e0b' },
          { label: 'gate', color: '#f59e0b', dashed: true },
          { label: 'loop', color: '#a78bfa' },
          { label: 'checkpoint', color: '#9ca3af' },
          { label: 'optional', color: '#9ca3af', dashed: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: item.dashed ? 'transparent' : item.color,
                border: item.dashed
                  ? `2px dashed ${item.color}`
                  : 'none',
              }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="flex-1 min-h-0">
        <WorkflowGraph
          workflowName={activeTab}
          onPhaseExpanded={setExpandedPhase}
        />
      </div>
    </div>
  )
}
