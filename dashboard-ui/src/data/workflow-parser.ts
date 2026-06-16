export interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'round' | 'action' | 'decision' | 'gate' | 'loop' | 'checkpoint'
  optional?: boolean
}

export interface WorkflowPhase {
  id: string
  name: string
  icon: string
  description: string
  roles: string[]
  artifacts: string[]
  next: string[]
  steps: WorkflowStep[]
}

export interface Workflow {
  name: string
  type: 'macro' | 'micro'
  description: string
  phases: WorkflowPhase[]
}

export async function loadWorkflow(name: string): Promise<Workflow> {
  const res = await fetch(`workflows/${name}.json`)
  if (!res.ok) throw new Error(`Workflow ${name} not found`)
  return res.json()
}

import type { GraphNode, GraphEdge } from 'reagraph'

const STEP_COLORS: Record<string, string> = {
  round: '#6366f1',
  action: '#00e639',
  decision: '#f59e0b',
  gate: '#f59e0b',
  loop: '#a78bfa',
  checkpoint: '#9ca3af',
}

const STEP_LABELS: Record<string, string> = {
  round: 'rodada',
  action: 'ação',
  decision: 'decisão',
  gate: 'gate',
  loop: 'loop',
  checkpoint: 'checkpoint',
}

export function workflowToGraph(workflow: Workflow): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  for (const phase of workflow.phases) {
    const phaseId = phase.id
    nodes.push({
      id: phaseId,
      label: `${phase.icon} ${phase.name}`,
      subLabel: phase.roles.join(', '),
      fill: '#00e639',
      size: 8,
      data: {
        type: 'phase',
        phase,
      },
    })

    for (let stepIdx = 0; stepIdx < phase.steps.length; stepIdx++) {
      const step = phase.steps[stepIdx]
      const stepId = `${phaseId}-${step.id}`
      const color = STEP_COLORS[step.type] || '#9ca3af'
      const isOptional = step.optional

      nodes.push({
        id: stepId,
        label: `${stepIdx + 1}. ${step.name}`,
        subLabel: `${STEP_LABELS[step.type]}${isOptional ? ' · opcional' : ''}`,
        fill: isOptional ? '#9ca3af' : color,
        size: isOptional ? 3 : 4,
        parents: [phaseId],
        data: {
          type: 'step',
          step,
          stepNumber: stepIdx + 1,
          phaseId,
        },
      })

      // Edge from phase to its first step, then between steps
      if (stepIdx === 0) {
        edges.push({
          id: `${phaseId}-to-${stepId}`,
          source: phaseId,
          target: stepId,
          fill: '#2d2e2e',
          label: '',
        })
      } else {
        const prevStepId = `${phaseId}-${phase.steps[stepIdx - 1].id}`
        edges.push({
          id: `${prevStepId}-to-${stepId}`,
          source: prevStepId,
          target: stepId,
          fill: '#2d2e2e',
          label: '',
        })
      }
    }

    // Edge from phase to next phase(s)
    for (const nextPhaseId of phase.next) {
      edges.push({
        id: `${phaseId}-to-${nextPhaseId}`,
        source: phaseId,
        target: nextPhaseId,
        fill: '#2d2e2e',
        label: '→',
      })
    }
  }

  return { nodes, edges }
}
