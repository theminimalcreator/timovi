import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
}

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
}: SidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // Close others, open this one
        next.clear();
        next.add(id);
      }
      return next;
    });
    onSelectProject(id);
  };

  return (
    <aside className="w-[260px] min-w-[260px] bg-terminal-surface border-r border-terminal-border flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-5 pb-2">
        <h1 className="font-heading text-[22px] font-bold text-white flex items-center gap-2 tracking-tight">
          <span className="w-[10px] h-[10px] rounded-full bg-terminal-green shadow-[0_0_8px_#00e639]" />
          Timovi
        </h1>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-terminal-text-muted font-mono">
          Projetos
        </span>
      </div>

      {/* Projects list */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {projects.map((project) => {
          const isExpanded = expandedProjects.has(project.id);
          const isActive = project.id === activeProjectId;

          return (
            <div key={project.id} className="mb-0.5">
              <button
                onClick={() => toggleProject(project.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-card text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-terminal-surface-higher text-white'
                    : 'text-terminal-text hover:bg-terminal-surface-higher'
                }`}
              >
                <span
                  className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                    project.hasTeam ? 'bg-terminal-green' : 'bg-terminal-text-muted'
                  }`}
                />
                <span className="truncate">{project.name}</span>
                <span
                  className={`ml-auto text-lg transition-transform duration-200 text-terminal-text-muted ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                >
                  ▸
                </span>
              </button>

              {/* Sub-nav */}
              {isExpanded && (
                <div className="ml-11 border-l border-terminal-border">
                  <NavLink
                    to={`/project/${project.id}/kanban`}
                    className={({ isActive: linkActive }) =>
                      `sidebar-link ${linkActive ? 'active' : ''}`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                    Kanban
                  </NavLink>
                  <NavLink
                    to={`/project/${project.id}/time`}
                    className={({ isActive: linkActive }) =>
                      `sidebar-link ${linkActive ? 'active' : ''}`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                    Time
                  </NavLink>
                  <NavLink
                    to={`/project/${project.id}/config`}
                    className={({ isActive: linkActive }) =>
                      `sidebar-link ${linkActive ? 'active' : ''}`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Config
                  </NavLink>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Add project */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={onAddProject}
          className="w-full flex items-center gap-1.5 px-3 py-2 text-[13px] text-terminal-text-muted border border-dashed border-terminal-border rounded-card hover:border-terminal-green hover:text-terminal-green transition-colors bg-transparent cursor-pointer font-body"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Adicionar projeto
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-terminal-border text-xs text-terminal-text-muted">
        Dashboard v1.0 — read-only
      </div>
    </aside>
  );
}
