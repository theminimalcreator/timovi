import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = join(__dirname, '..', 'storage', 'projects.json');

export const projectsRouter = Router();

// --- Helpers ---

function loadProjects() {
  try {
    const raw = readFileSync(STORAGE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  writeFileSync(STORAGE_PATH, JSON.stringify(projects, null, 2), 'utf-8');
}

function detectProject(path) {
  const statePath = join(path, '.product-team', 'state.json');
  const featurePath = join(path, '.product-team', 'artifacts');

  try {
    const stateRaw = readFileSync(statePath, 'utf-8');
    const state = JSON.parse(stateRaw);
    const name = state.project || path.split('/').pop() || 'unknown';

    return {
      exists: true,
      name,
      state,
    };
  } catch {
    return { exists: false, name: path.split('/').pop() || 'unknown', state: null };
  }
}

// --- Routes ---

// GET /api/projects — list all connected projects (with status)
projectsRouter.get('/projects', (_req, res) => {
  const projects = loadProjects();
  const enriched = projects.map((p) => {
    const detected = detectProject(p.path);
    return {
      ...p,
      name: detected.name,
      hasTeam: detected.exists,
      phase: detected.state?.pipeline_phase || null,
      currentFeature: detected.state?.current_feature || null,
      rolesCount: detected.state?.active_roles?.length || 0,
    };
  });
  res.json(enriched);
});

// POST /api/projects — add a new project
projectsRouter.post('/projects', (req, res) => {
  const { path } = req.body;
  if (!path) {
    return res.status(400).json({ error: 'Path é obrigatório' });
  }

  const detected = detectProject(path);
  if (!detected.exists) {
    return res.status(400).json({
      error: 'Nenhum time encontrado. Execute o bootstrap via chat primeiro.',
      detail: `Arquivo .product-team/state.json não encontrado em: ${path}`,
    });
  }

  const projects = loadProjects();
  const existing = projects.find((p) => p.path === path);
  if (existing) {
    return res.status(409).json({ error: 'Projeto já conectado', project: existing });
  }

  const project = {
    id: randomUUID(),
    path,
    name: detected.name,
    connectedAt: new Date().toISOString(),
  };

  projects.push(project);
  saveProjects(projects);

  res.status(201).json({
    ...project,
    hasTeam: true,
    rolesCount: detected.state?.active_roles?.length || 0,
  });
});

// DELETE /api/projects/:id — remove a project
projectsRouter.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  let projects = loadProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }

  projects.splice(index, 1);
  saveProjects(projects);
  res.json({ success: true });
});

// GET /api/projects/:id/state — read project state.json
projectsRouter.get('/projects/:id/state', (req, res) => {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }

  try {
    const statePath = join(project.path, '.product-team', 'state.json');
    const raw = readFileSync(statePath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao ler state.json',
      detail: err.message,
    });
  }
});

// GET /api/projects/:id/feature — read current feature.json
projectsRouter.get('/projects/:id/feature', (req, res) => {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Projeto não encontrado' });
  }

  try {
    const statePath = join(project.path, '.product-team', 'state.json');
    const stateRaw = readFileSync(statePath, 'utf-8');
    const state = JSON.parse(stateRaw);
    const currentFeature = state.current_feature;

    if (!currentFeature) {
      return res.json({ name: null, issues: [], message: 'Nenhuma feature ativa' });
    }

    const featurePath = join(
      project.path,
      '.product-team',
      'artifacts',
      currentFeature,
      'feature.json'
    );

    if (!existsSync(featurePath)) {
      return res.json({ name: currentFeature, issues: [], message: 'feature.json não encontrado' });
    }

    const raw = readFileSync(featurePath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao ler dados da feature',
      detail: err.message,
    });
  }
});
