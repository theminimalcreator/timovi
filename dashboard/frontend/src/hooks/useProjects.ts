import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';

const API = '/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API}/projects`);
      if (!res.ok) throw new Error('Erro ao carregar projetos');
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000); // poll a cada 10s
    return () => clearInterval(interval);
  }, [fetchProjects]);

  const addProject = async (path: string) => {
    const res = await fetch(`${API}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
    await fetchProjects();
    return res.json();
  };

  const removeProject = async (id: string) => {
    await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
    await fetchProjects();
  };

  return { projects, loading, error, addProject, removeProject, refetch: fetchProjects };
}
