import { useFeature } from '../hooks/useFeature';
import { useProjects } from '../hooks/useProjects';
import type { Issue } from '../types';
import { useMemo } from 'react';

interface Props {
  projectId: string;
}

const PIPELINE_PHASES = ['plan', 'spec', 'breakdown', 'execute', 'review'] as const;

const STATUS_COLORS: Record<string, string> = {
  done: 'bg-terminal-green-bright',
  in_progress: 'bg-blue-400',
  pending: 'bg-terminal-text-muted',
  blocked: 'bg-terminal-red',
  failed: 'bg-terminal-red',
  cancelled: 'bg-terminal-red',
};

const ROLE_COLORS: Record<string, string> = {
  be: 'text-green-400 bg-green-400/10',
  fe: 'text-indigo-400 bg-indigo-400/10',
  qa: 'text-amber-400 bg-amber-400/10',
  db: 'text-purple-400 bg-purple-400/10',
};

function getRoleBadge(role: string): string {
  const key = role.split('-')[0] || role;
  return ROLE_COLORS[key] || 'text-terminal-text-muted bg-terminal-surface-higher';
}

export default function KanbanBoard({ projectId }: Props) {
  const { feature, loading } = useFeature(projectId);
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);

  const issuesByPhase = useMemo(() => {
    const map: Record<string, Issue[]> = {};
    PIPELINE_PHASES.forEach((p) => (map[p] = []));

    if (feature?.issues) {
      feature.issues.forEach((issue) => {
        // Map issue status to pipeline phase (simplified)
        const phase = feature.pipeline_phase || 'breakdown';
        map[phase] = [...(map[phase] || []), issue];
      });
    }
    return map;
  }, [feature]);

  if (loading) {
    return (
      <div className="text-terminal-text-muted text-center py-12 animate-pulse">
        Carregando Kanban...
      </div>
    );
  }

  if (!feature || !feature.name) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-terminal-text-muted gap-2">
        <span className="text-4xl">📋</span>
        <p>Nenhuma feature ativa neste projeto</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 min-h-[calc(100vh-200px)]">
      {PIPELINE_PHASES.map((phase) => {
        const issues = issuesByPhase[phase] || [];
        const isActive = feature.pipeline_phase === phase;

        return (
          <div key={phase} className={`kanban-col ${isActive ? 'active' : ''}`}>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-terminal-border">
              <span className="font-heading text-[13px] font-semibold text-white uppercase tracking-wide">
                {phase === 'plan' && 'Plan'}
                {phase === 'spec' && 'Spec'}
                {phase === 'breakdown' && 'Breakdown'}
                {phase === 'execute' && 'Execute'}
                {phase === 'review' && 'Review'}
              </span>
              <span className="text-xs text-terminal-text-muted font-mono bg-terminal-bg px-2 py-0.5 rounded-full">
                {issues.length}
              </span>
            </div>

            {issues.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-terminal-text-muted text-[13px] italic">
                Nenhuma Issue
              </div>
            ) : (
              <div className="space-y-2">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-terminal-bg border border-terminal-border rounded-md p-3 hover:border-terminal-green hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[11px] text-terminal-text-muted font-medium">
                        {issue.id}
                      </span>
                      <span
                        className={`w-[8px] h-[8px] rounded-full flex-shrink-0 mt-0.5 ${
                          STATUS_COLORS[issue.status] || STATUS_COLORS.pending
                        }`}
                      />
                    </div>
                    <div className="text-[13px] font-medium text-terminal-text mb-2 leading-snug">
                      {issue.title}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {(issue.assigned_roles || []).map((role) => (
                        <span
                          key={role}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono ${getRoleBadge(role)}`}
                        >
                          {role.split('-')[0].toUpperCase().slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
