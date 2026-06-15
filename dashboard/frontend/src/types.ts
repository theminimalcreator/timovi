/// <reference types="vite/client" />

interface Project {
  id: string;
  name: string;
  path: string;
  connectedAt: string;
  hasTeam?: boolean;
  phase?: string | null;
  currentFeature?: string | null;
  rolesCount?: number;
  state?: ProjectState;
}

interface ProjectState {
  user_name: string;
  project: string;
  phase: string;
  current_feature: string | null;
  pipeline_phase: string | null;
  active_roles: string[];
  features: Feature[];
}

interface Feature {
  name: string;
  status: string;
  checkpoints: Record<string, string>;
  issues?: Issue[];
}

interface Issue {
  id: string;
  title: string;
  status: string;
  assigned_roles: string[];
  blocked_by: string[];
  notes?: string;
}

interface FeatureDetail {
  name: string;
  status: string;
  pipeline_phase: string;
  issues: Issue[];
  ponytail_actions: PonytailAction[];
}

interface PonytailAction {
  timestamp: string;
  phase: string;
  action: string;
  issue_id: string;
  reason: string;
  severity: string;
}

export type { Project, ProjectState, Feature, Issue, FeatureDetail, PonytailAction };
