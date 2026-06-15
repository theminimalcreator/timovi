import { useProjects } from '../hooks/useProjects';
import { useState, useEffect } from 'react';

interface Props {
  projectId: string;
}

export default function ConfigPage({ projectId }: Props) {
  const { projects, removeProject, addProject } = useProjects();
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!project) return;
    fetch(`/api/projects/${projectId}/state`)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId, project]);

  const handleRemove = async () => {
    if (!project) return;
    const confirmed = window.confirm(`Remover "${project.name}" do Dashboard? (os arquivos do projeto não serão afetados)`);
    if (confirmed) {
      try {
        await removeProject(project.id);
      } catch {
        alert('Erro ao remover projeto');
      }
    }
  };

  const handleAddProject = () => {
    const path = window.prompt('Caminho da pasta do projeto:');
    if (path) {
      addProject(path).catch((err) => {
        alert(`Erro: ${err.message}`);
      });
    }
  };

  if (loading) {
    return (
      <div className="text-terminal-text-muted text-center py-12 animate-pulse">
        Carregando configurações...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-terminal-text-muted text-center py-12">
        Projeto não encontrado
      </div>
    );
  }

  return (
    <div className="max-w-[640px] space-y-4">
      {/* Project info */}
      <div className="bg-terminal-surface border border-terminal-border rounded-card p-6">
        <h3 className="font-heading text-base font-semibold text-white mb-4 pb-3 border-b border-terminal-border">
          📁 Projeto: {project.name}
        </h3>

        <div className="space-y-0">
          <div className="flex justify-between items-center py-2.5">
            <span className="text-[13px] text-terminal-text-muted">Path</span>
            <span className="font-mono text-[13px] text-terminal-green">{project.path}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-t border-terminal-border">
            <span className="text-[13px] text-terminal-text-muted">Conectado em</span>
            <span className="font-mono text-[13px] text-terminal-text">
              {new Date(project.connectedAt).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-t border-terminal-border">
            <span className="text-[13px] text-terminal-text-muted">.product-team/</span>
            <span className="text-[13px] text-terminal-green-bright font-medium">
              ✅ Detectado
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-t border-terminal-border">
            <span className="text-[13px] text-terminal-text-muted">Feature atual</span>
            <span className="font-mono text-[13px] text-terminal-text">
              {state?.current_feature || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-t border-terminal-border">
            <span className="text-[13px] text-terminal-text-muted">Fase</span>
            <span className="font-mono text-[13px] text-terminal-text">
              {state?.pipeline_phase || 'idle'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-t border-terminal-border">
            <span className="text-[13px] text-terminal-text-muted">Roles ativas</span>
            <span className="font-mono text-[13px] text-terminal-text">
              {state?.active_roles?.length || 0}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-terminal-border">
          <button
            onClick={handleRemove}
            className="px-4 py-2 rounded-md border border-terminal-red text-terminal-red text-[13px] font-medium hover:bg-terminal-red/10 transition-colors cursor-pointer"
          >
            🗑️ Remover
          </button>
        </div>
      </div>

      {/* Add new project */}
      <div className="bg-terminal-surface border border-terminal-border rounded-card p-6">
        <h3 className="font-heading text-base font-semibold text-white mb-4 pb-3 border-b border-terminal-border">
          ➕ Adicionar novo projeto
        </h3>
        <p className="text-[13px] text-terminal-text-muted mb-3">
          Conecte outro projeto Timovi ao Dashboard. O projeto precisa ter um{' '}
          <code className="font-mono text-terminal-green bg-terminal-bg px-1 py-0.5 rounded text-[12px]">
            .product-team/state.json
          </code>{' '}
          válido.
        </p>
        <button
          onClick={handleAddProject}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-terminal-green text-black text-[13px] font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Conectar projeto
        </button>
      </div>
    </div>
  );
}
