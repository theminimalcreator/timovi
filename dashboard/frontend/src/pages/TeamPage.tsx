import { useProjects } from '../hooks/useProjects';
import { useFeature } from '../hooks/useFeature';
import { useState, useEffect } from 'react';

interface Props {
  projectId: string;
}

interface RoleInfo {
  slug: string;
  name: string;
  icon: string;
  category: string;
}

const ROLE_REGISTRY: RoleInfo[] = [
  { slug: 'product-manager', name: 'Product Manager', icon: '🧠', category: '🎯 Estratégia' },
  { slug: 'ux-designer', name: 'UX Designer', icon: '🎨', category: '🎯 Estratégia' },
  { slug: 'software-architect', name: 'Software Architect', icon: '🏗️', category: '🎯 Estratégia' },
  { slug: 'tech-lead', name: 'Tech Lead', icon: '⚡', category: '🎯 Estratégia' },
  { slug: 'frontend-engineer', name: 'Frontend Engineer', icon: '🖥️', category: '⚙️ Engenharia' },
  { slug: 'backend-engineer', name: 'Backend Engineer', icon: '⚙️', category: '⚙️ Engenharia' },
  { slug: 'dba', name: 'DBA', icon: '🗄️', category: '⚙️ Engenharia' },
  { slug: 'quality-engineer', name: 'QA Engineer', icon: '🧪', category: '✅ Qualidade' },
  { slug: 'devops', name: 'DevOps', icon: '🚀', category: '✅ Qualidade' },
  { slug: 'head-marketing', name: 'Head of Marketing', icon: '📣', category: '📢 Marketing' },
  { slug: 'tech-writer', name: 'Tech Writer', icon: '✍️', category: '📢 Marketing' },
  { slug: 'linkedin', name: 'LinkedIn', icon: '💼', category: '📢 Marketing' },
  { slug: 'instagram', name: 'Instagram', icon: '📸', category: '📢 Marketing' },
];

export default function TeamPage({ projectId }: Props) {
  const { projects } = useProjects();
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    fetch(`/api/projects/${projectId}/state`)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId, projects]);

  if (loading) {
    return (
      <div className="text-terminal-text-muted text-center py-12 animate-pulse">Carregando time...</div>
    );
  }

  const activeRoles: string[] = state?.active_roles || [];
  const activeSet = new Set(activeRoles);

  // Group roles by category, only show active ones
  const categories = new Map<string, RoleInfo[]>();
  ROLE_REGISTRY.forEach((role) => {
    if (activeSet.has(role.slug)) {
      const existing = categories.get(role.category) || [];
      existing.push(role);
      categories.set(role.category, existing);
    }
  });

  if (categories.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-terminal-text-muted gap-2">
        <span className="text-4xl">👥</span>
        <p>Nenhuma Role ativa neste projeto</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Array.from(categories.entries()).map(([category, roles]) => (
        <section key={category}>
          <h3 className="font-mono text-[11px] font-semibold text-terminal-text-muted uppercase tracking-[1.5px] mb-4">
            {category}
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {roles.map((role) => (
              <div
                key={role.slug}
                className="bg-terminal-surface border border-terminal-border rounded-card p-5 flex items-start gap-3.5 hover:border-terminal-green transition-colors"
              >
                <div className="w-11 h-11 rounded-card bg-terminal-surface-higher flex items-center justify-center text-xl flex-shrink-0">
                  {role.icon}
                </div>
                <div>
                  <h4 className="font-heading text-[15px] font-semibold text-white mb-1">{role.name}</h4>
                  <p className="font-mono text-[11px] text-terminal-text-muted mb-1.5">{role.slug}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-terminal-green-bright font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-terminal-green-bright" />
                    Ativo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
