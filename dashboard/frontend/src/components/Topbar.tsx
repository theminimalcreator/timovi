import { Link } from 'react-router-dom';

interface TopbarProps {
  title: string;
  projectName?: string;
  projectId?: string;
}

export default function Topbar({ title, projectName, projectId }: TopbarProps) {
  return (
    <header className="px-8 py-4 border-b border-terminal-border flex items-center justify-between bg-terminal-surface">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-lg font-semibold text-white">{title}</h2>
        {projectName && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-terminal-green/10 text-terminal-green font-mono">
            {projectName}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {projectId && (
          <Link
            to={`/project/${projectId}/config`}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-terminal-border text-terminal-text-muted hover:border-terminal-green hover:text-terminal-green transition-colors"
            title="Configurações"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>
        )}
      </div>
    </header>
  );
}
