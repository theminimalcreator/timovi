import { useState, useEffect, useCallback } from 'react';
import type { FeatureDetail } from '../types';

const API = '/api';

export function useFeature(projectId: string | null) {
  const [feature, setFeature] = useState<FeatureDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeature = useCallback(async () => {
    if (!projectId) {
      setFeature(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/projects/${projectId}/feature`);
      if (!res.ok) throw new Error('Erro ao carregar feature');
      const data = await res.json();
      setFeature(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFeature();
    const interval = setInterval(fetchFeature, 10000);
    return () => clearInterval(interval);
  }, [fetchFeature]);

  return { feature, loading, error, refetch: fetchFeature };
}
