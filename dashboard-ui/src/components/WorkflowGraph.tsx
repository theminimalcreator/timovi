import { useEffect, useState } from 'react'
import { GraphCanvas, darkTheme, type GraphCanvasRef } from 'reagraph'
import type { GraphNode, GraphEdge } from 'reagraph'
import { loadWorkflow, workflowToGraph, type Workflow } from '../data/workflow-parser'

interface WorkflowGraphProps {
  workflowName: string
  onPhaseExpanded?: (phaseLabel: string | null) => void
}

const customTheme = {
  ...darkTheme,
  canvas: {
    background: '#0d0e0f',
    fog: null as string | null,
  },
  node: {
    ...darkTheme.node,
    fill: '#1a1b1b',
    activeFill: '#00e639',
    opacity: 0.95,
    selectedOpacity: 1,
    inactiveOpacity: 0.3,
    label: {
      ...darkTheme.node.label,
      color: '#e3e2e2',
      activeColor: '#ffffff',
      stroke: '#0d0e0f',
      strokeWidth: 2,
      backgroundColor: '#0d0e0f',
      backgroundOpacity: 0.7,
      padding: 4,
      radius: 4,
    },
    subLabel: {
      ...(darkTheme.node.subLabel || {}),
      color: '#9ca3af',
      activeColor: '#e3e2e2',
    },
  },
  edge: {
    ...darkTheme.edge,
    fill: '#2d2e2e',
    activeFill: '#00e639',
    opacity: 0.6,
    selectedOpacity: 1,
    inactiveOpacity: 0.1,
    label: {
      ...darkTheme.edge.label,
      color: '#2d2e2e',
      activeColor: '#00e639',
    },
  },
  arrow: {
    ...darkTheme.arrow,
    fill: '#2d2e2e',
    activeFill: '#00e639',
  },
}

export function WorkflowGraph({ workflowName, onPhaseExpanded }: WorkflowGraphProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collapsedIds, setCollapsedIds] = useState<string[]>([])
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    loadWorkflow(workflowName)
      .then((wf) => {
        setWorkflow(wf)
        const { nodes: graphNodes, edges: graphEdges } = workflowToGraph(wf)
        setNodes(graphNodes)
        setEdges(graphEdges)
        // Start with all step nodes collapsed (only show phases)
        const stepIds = graphNodes
          .filter((n) => n.data?.type === 'step')
          .map((n) => n.id)
        setCollapsedIds(stepIds)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [workflowName])

  const handleNodeClick = (node: GraphNode) => {
    if (node.data?.type === 'phase') {
      // Toggle collapse of its children
      const childStepIds = nodes
        .filter(
          (n) => n.data?.type === 'step' && n.parents?.includes(node.id)
        )
        .map((n) => n.id)

      setCollapsedIds((prev) => {
        const allCollapsed = childStepIds.every((id) => prev.includes(id))
        if (allCollapsed) {
          // Expand: remove step IDs from collapsed
          const next = prev.filter((id) => !childStepIds.includes(id))
          setSelectedPhase(node.id)
          onPhaseExpanded?.(node.label || null)
          return next
        } else {
          // Collapse: add step IDs
          setSelectedPhase(null)
          onPhaseExpanded?.(null)
          return [...new Set([...prev, ...childStepIds])]
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
        <span className="material-symbols-outlined animate-spin text-2xl mr-2">progress_activity</span>
        Carregando workflow...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 rounded-lg border border-[var(--color-danger)] bg-[rgba(255,180,171,0.05)]">
          <span className="material-symbols-outlined text-4xl text-[var(--color-danger)] mb-2 block">
            error
          </span>
          <p className="text-[var(--color-danger)] font-medium">Erro ao carregar workflow</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!nodes.length || !edges.length) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
        Nenhum dado disponível.
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        collapsedNodeIds={collapsedIds}
        theme={customTheme}
        layoutType="forceDirected2d"
        sizingType="default"
        labelType="nodes"
        defaultNodeSize={6}
        minNodeSize={3}
        maxNodeSize={10}
        cameraMode="pan"
        animated={true}
        onNodeClick={handleNodeClick}
        edgeArrowPosition="end"
        edgeInterpolation="curved"
      />

      {/* Phase detail info */}
      {selectedPhase && workflow && (() => {
        const phase = workflow.phases.find((p) => p.id === selectedPhase)
        if (!phase) return null
        return (
          <div className="absolute top-4 right-4 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 shadow-lg z-10 max-h-[80%] overflow-y-auto">
            <div className="text-lg font-bold text-white font-[family-name:var(--font-heading)] mb-1">
              {phase.icon} {phase.name}
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-3 leading-relaxed">
              {phase.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {phase.roles.map((role) => (
                <span
                  key={role}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[rgba(0,230,57,0.1)] text-[var(--color-primary)]"
                >
                  {role}
                </span>
              ))}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] mb-2">
              Passo a passo
            </div>
            {phase.steps.map((step, i) => {
              const colors: Record<string, string> = {
                round: '#6366f1',
                action: '#00e639',
                decision: '#f59e0b',
                gate: '#f59e0b',
                loop: '#a78bfa',
                checkpoint: '#9ca3af',
              }
              const labels: Record<string, string> = {
                round: 'rodada',
                action: 'ação',
                decision: 'decisão',
                gate: 'gate',
                loop: 'loop',
                checkpoint: 'checkpoint',
              }
              const color = colors[step.type] || '#9ca3af'
              return (
                <div key={step.id}>
                  <div className="flex items-center gap-2 py-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: step.optional ? 'transparent' : color,
                        border: step.optional
                          ? `2px dashed #9ca3af`
                          : step.type === 'gate'
                            ? `2px dashed ${color}`
                            : 'none',
                      }}
                    />
                    <span className="text-sm text-[var(--color-text)] flex-1">
                      {i + 1}. {step.name}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold font-[family-name:var(--font-mono)]"
                      style={{
                        background: step.optional
                          ? 'rgba(156,163,175,0.1)'
                          : `${color}15`,
                        color: step.optional ? '#9ca3af' : color,
                        border: step.optional
                          ? '1px dashed rgba(156,163,175,0.3)'
                          : step.type === 'gate'
                            ? `1px dashed ${color}50`
                            : 'none',
                      }}
                    >
                      {labels[step.type]}
                      {step.optional ? ' opc.' : ''}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] ml-3.5 mb-1">
                    {step.description}
                  </div>
                  {i < phase.steps.length - 1 && (
                    <div className="w-px h-2 bg-[var(--color-border)] ml-[3px]" />
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}
    </div>
  )
}
