import { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KanbanBoard from './pages/KanbanBoard';
import TeamPage from './pages/TeamPage';
import ConfigPage from './pages/ConfigPage';
import { useProjects } from './hooks/useProjects';

function ProjectRoutes() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <Routes>
      <Route path="kanban" element={<KanbanBoard projectId={projectId!} />} />
      <Route path="time" element={<TeamPage projectId={projectId!} />} />
      <Route path="config" element={<ConfigPage projectId={projectId!} />} />
      <Route path="*" element={<Navigate to="kanban" replace />} />
    </Routes>
  );
}

export default function App() {
  const { projects, loading, error, addProject } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const handleAddProject = () => {
    const path = window.prompt('Caminho da pasta do projeto:');
    if (path) {
      addProject(path).catch((err) => {
        alert(`Erro: ${err.message}`);
      });
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-terminal-bg">
        <div className="text-terminal-text-muted text-lg animate-pulse">
          🧠 Carregando Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-terminal-bg">
        <div className="text-center">
          <div className="text-terminal-red text-lg mb-2">⚠️ Erro de conexão</div>
          <div className="text-terminal-text-muted text-sm">{error}</div>
          <div className="text-terminal-text-muted text-xs mt-2">
            Certifique-se de que o backend está rodando em http://localhost:3001
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onAddProject={handleAddProject}
      />

      <main className="flex-1 flex flex-col">
        <Topbar
          title="Kanban"
          projectName={activeProject?.name}
          projectId={activeProjectId ?? undefined}
        />

        <div className="flex-1 p-8 overflow-y-auto">
          {activeProjectId ? (
            <Routes>
              <Route path="/project/:projectId/*" element={<ProjectRoutes />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-full text-terminal-text-muted">
                    Selecione um projeto na sidebar para começar
                  </div>
                }
              />
            </Routes>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-terminal-text-muted gap-3">
              <span className="text-5xl">🧠</span>
              <p className="text-lg">Selecione um projeto na sidebar</p>
              <p className="text-sm">ou adicione um novo com o botão "+ Adicionar projeto"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
