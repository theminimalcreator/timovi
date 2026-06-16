import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const DB_PATH = path.join(__dirname, 'db.json')

app.use(cors())
app.use(express.json())

// ========================
// Helpers
// ========================

interface Project {
  id: string
  name: string
  path: string
  connectedAt: string
}

interface DB {
  projects: Project[]
  currentProjectId: string
}

function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function readStateJSON(projectPath: string) {
  const statePath = path.join(projectPath, '.product-team', 'state.json')
  if (!fs.existsSync(statePath)) return null
  return JSON.parse(fs.readFileSync(statePath, 'utf-8'))
}

function readFeatureJSON(projectPath: string, featureName: string) {
  const featurePath = path.join(projectPath, '.product-team', 'artifacts', featureName, 'feature.json')
  if (!fs.existsSync(featurePath)) return null
  return JSON.parse(fs.readFileSync(featurePath, 'utf-8'))
}

// ========================
// API Routes
// ========================

// List all projects
app.get('/api/projects', (_req, res) => {
  const db = readDB()
  res.json(db.projects)
})

// Get current project
app.get('/api/projects/current', (_req, res) => {
  const db = readDB()
  const project = db.projects.find((p) => p.id === db.currentProjectId)
  if (!project) return res.status(404).json({ error: 'No current project' })

  const state = readStateJSON(project.path)
  res.json({
    ...project,
    state: state || null,
  })
})

// Add a new project
app.post('/api/projects', (req, res) => {
  const { name, projectPath } = req.body
  if (!projectPath) return res.status(400).json({ error: 'projectPath is required' })

  const db = readDB()
  const exists = db.projects.find((p) => p.path === projectPath)
  if (exists) return res.status(409).json({ error: 'Project already connected' })

  // Check if state.json exists
  const state = readStateJSON(projectPath)
  if (!state) return res.status(400).json({ error: 'No .product-team/state.json found at path' })

  const id = `proj-${Date.now()}`
  const newProject: Project = {
    id,
    name: name || state.project || projectPath.split('/').pop() || projectPath,
    path: projectPath,
    connectedAt: new Date().toISOString(),
  }

  db.projects.push(newProject)
  writeDB(db)
  res.json(newProject)
})

// Set current project
app.post('/api/projects/current', (req, res) => {
  const { projectId } = req.body
  if (!projectId) return res.status(400).json({ error: 'projectId is required' })

  const db = readDB()
  const project = db.projects.find((p) => p.id === projectId)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  db.currentProjectId = projectId
  writeDB(db)

  const state = readStateJSON(project.path)
  res.json({ ...project, state: state || null })
})

// Remove a project
app.delete('/api/projects/:id', (req, res) => {
  const db = readDB()
  const index = db.projects.findIndex((p) => p.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Project not found' })

  db.projects.splice(index, 1)
  if (db.currentProjectId === req.params.id) {
    db.currentProjectId = db.projects[0]?.id || ''
  }
  writeDB(db)
  res.json({ ok: true })
})

// Get state.json for a project
app.get('/api/projects/:id/state', (req, res) => {
  const db = readDB()
  const project = db.projects.find((p) => p.id === req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const state = readStateJSON(project.path)
  if (!state) return res.status(404).json({ error: 'state.json not found' })
  res.json(state)
})

// Get feature.json for a project
app.get('/api/projects/:id/feature/:featureName', (req, res) => {
  const db = readDB()
  const project = db.projects.find((p) => p.id === req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const feature = readFeatureJSON(project.path, req.params.featureName)
  if (!feature) return res.status(404).json({ error: 'feature.json not found' })
  res.json(feature)
})

// List features for a project
app.get('/api/projects/:id/features', (req, res) => {
  const db = readDB()
  const project = db.projects.find((p) => p.id === req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const artifactsDir = path.join(project.path, '.product-team', 'artifacts')
  if (!fs.existsSync(artifactsDir)) return res.json([])

  const features = fs.readdirSync(artifactsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const featurePath = path.join(artifactsDir, d.name, 'feature.json')
      if (fs.existsSync(featurePath)) {
        try {
          return JSON.parse(fs.readFileSync(featurePath, 'utf-8'))
        } catch {
          return { name: d.name, error: 'Invalid JSON' }
        }
      }
      return { name: d.name }
    })

  res.json(features)
})

app.listen(PORT, () => {
  console.log(`📡 API server running on http://localhost:${PORT}`)
})
