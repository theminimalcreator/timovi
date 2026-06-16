import { useCallback, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { KanbanScreen } from './screens/KanbanScreen'
import { TeamScreen } from './screens/TeamScreen'
import { ConfigScreen } from './screens/ConfigScreen'
import { WorkflowScreen, WORKFLOW_TABS } from './screens/WorkflowScreen'

const screenMeta: Record<string, { title: string; breadcrumb: string; badges?: { label: string; color: string }[] }> = {
  kanban: { title: 'Kanban', breadcrumb: 'Timovi / Kanban' },
  team: { title: 'Time', breadcrumb: 'Timovi / Time' },
  config: { title: 'Config', breadcrumb: 'Timovi / Config' },
  workflow: {
    title: 'Workflow — Pipeline',
    breadcrumb: 'Timovi / Workflows / Pipeline',
    badges: [
      { label: 'Macro', color: '#00e639' },
      { label: '5 Fases', color: '#6366f1' },
    ],
  },
}

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

function App() {
  const [activeScreen, setActiveScreen] = useState('workflow')
  const [workflowTab, setWorkflowTab] = useState('pipeline')

  const handleNavigate = useCallback((screen: string) => {
    setActiveScreen(screen)
  }, [])

  const handleWorkflowNavigate = useCallback((tab: string) => {
    setWorkflowTab(tab)
  }, [])

  const badgeKey = activeScreen === 'workflow' ? workflowTab : ''
  const meta = screenMeta[activeScreen] || screenMeta.kanban

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar
        activeScreen={activeScreen}
        workflowTab={workflowTab}
        onNavigate={handleNavigate}
        onWorkflowNavigate={handleWorkflowNavigate}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={meta.title}
          breadcrumb={meta.breadcrumb}
          badges={badgeKey ? WORKFLOW_BADGES[badgeKey] : meta.badges}
        />
        <div className="flex-1 overflow-y-auto">
          {activeScreen === 'kanban' && <KanbanScreen />}
          {activeScreen === 'team' && <TeamScreen />}
          {activeScreen === 'config' && <ConfigScreen />}
          {activeScreen === 'workflow' && (
            <WorkflowScreen initialTab={workflowTab} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
