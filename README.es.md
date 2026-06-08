<p align="center">
  <img src="assets/banner.svg" alt="Timovi — Tu equipo digital de producto" width="100%">
</p>

<p align="center">
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/disponible%20en-skills.sh-FFD700?style=for-the-badge" alt="Disponible en skills.sh"></a>
  <a href="https://github.com/theminimalcreator/timovi/blob/main/LICENSE"><img src="https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge" alt="Licencia: MIT"></a>
  <a href="https://github.com/vercel-labs/skills"><img src="https://img.shields.io/badge/Creado%20para-npx%20skills-000?style=for-the-badge&logo=npm" alt="Creado para npx skills"></a>
</p>

<p align="center">
  [English](README.md) | [Português](README.pt.md) | [Español](README.es.md)
</p>

# Timovi

**Arma un equipo digital de producto dentro de tu agente de código con IA.** Un comando, todo tu pipeline de producto — Product Manager, UX Designer, Software Architect, Tech Lead, Engineers, QA y más.

> Si Claude Code es un dev solitario, **Timovi es el equipo de producto completo.**

```bash
npx skills add theminimalcreator/timovi --skill timovi
```

<br>

---

## ¿Timovi es para ti?

- ✅ Eres un **founder solitario o dev indie** lanzando side projects
- ✅ Usas **agentes de código con IA** (Claude Code, Cursor, Pi, Codex, OpenCode) y son geniales — pero falta algo
- ✅ Empiezas proyectos rápido, pero **te cuesta terminarlos** — el último 20% toma el 80% del tiempo
- ✅ Sabes que **UX importa**, pero nunca hay tiempo suficiente
- ✅ Has probado herramientas pesadas de orquestación (OpenClaw, Paperclip) y pensaste: **"esto es demasiado complejo, ¿dónde está la entrega?"**
- ✅ Quieres un **equipo de producto ligero y con opinión** — no un framework de agentes genérico

<br>

---

## Lo que Timovi te da

| Role | Lo que hace |
|------|-------------|
| 🎯 **Product Manager** | Define qué construir, escribe PRDs, prioriza. Se acabó el "¿estoy construyendo lo correcto?" |
| 🎨 **UX Designer** | Personas, flujos, wireframes. UX que harías tú mismo si tuvieras el tiempo. |
| 🏗️ **Software Architect** | Valida viabilidad, documenta decisiones, mapea impacto en módulos. |
| 👨‍💻 **Tech Lead** | Divide features en issues, coordina ejecución, revisa código. |
| ⚛️ **Frontend Engineer** | Componentes, páginas, manejo de estado. |
| 🖥️ **Backend Engineer** | APIs, servicios, lógica de negocio. |
| 🗄️ **DBA** | Diseño de esquema, consultas, índices, migraciones. |
| ✅ **QA Engineer** | Pruebas, criterios de aceptación, casos límite. |
| 📣 **Head of Marketing** | Posicionamiento, mensajería, go-to-market. |
| 🚀 **DevOps** | CI/CD, deploy, infraestructura. |

**Todos hablando entre sí, todos compartiendo el mismo contexto sobre tu proyecto.**

<br>

---

## Cómo funciona

```
Dices "timovi"
        │
        ▼
   ┌─────────┐     ┌──────┐     ┌───────────┐     ┌─────────┐     ┌────────┐
   │  PLAN   │ ──→ │ SPEC │ ──→ │ BREAKDOWN │ ──→ │ EXECUTE │ ──→ │ REVIEW │
   │ PM+UX   │     │  PM  │     │ Tech Lead │     │Eng+QA   │     │QA+TL   │
   │+Arch    │     │      │     │ +Arch     │     │         │     │        │
   └─────────┘     └──────┘     └───────────┘     └─────────┘     └────────┘
        │               │              │                │               │
        ▼               ▼              ▼                ▼               ▼
   Notas de       PRD.md        Issues +      Pull Requests    Aprobado
   planificación                 feature.json                   & merge
```

**Cada fase produce una entrega concreta.** Siempre sabes exactamente qué se hizo y qué sigue.

<br>

---

## Inicio Rápido

### 1. Instala

```bash
npx skills add theminimalcreator/timovi --skill timovi
```

Funciona con **Pi, Claude Code, Cursor, Codex, OpenCode y [más de 60 agentes](https://github.com/vercel-labs/skills#supported-agents).**

### 2. Activa

Abre tu agente de IA y escribe:

```
timovi
```

### 3. Bootstrap (5 minutos)

El orquestador hará algunas preguntas sobre tu proyecto — nombre, stack, dominio. Detecta automáticamente tu codebase, genera una base de conocimiento (lenguaje de dominio, mapa de arquitectura, docs de stack, convenciones) y activa tu equipo.

### 4. Comienza una feature

```
timovi → "new feature"
```

Elige una feature. El pipeline se ejecuta. Tú respondes preguntas (una a la vez), apruebas artefactos y ves a tu equipo construir.

### 5. Mantente actualizado

Cuando Timovi tenga nuevas features o correcciones, actualiza con un comando:

```bash
npx skills update timovi
```

> **Usuarios de symlink** (recomendado durante la instalación) reciben actualizaciones al instante — `npx skills update` solo ejecuta `git pull` en el clon de Timovi. **Usuarios de copia** reciben los archivos más recientes recopiados. En cualquier caso, tu instancia `.product-team/` nunca se toca.

<br>

---

## Sin Timovi vs Con Timovi

| Sin Timovi | Con Timovi |
|---------------|------------|
| ❌ "Necesito UX pero no tengo tiempo" | ✅ UX Designer es una Role dedicada — flujos, personas, wireframes, listo |
| ❌ "¿Qué debería construir primero?" | ✅ Product Manager escribe PRDs, prioriza, define alcance |
| ❌ Código espagueti, sin arquitectura | ✅ Software Architect valida viabilidad, mapea módulos |
| ❌ Bugs encontrados después del lanzamiento | ✅ QA Engineer prueba happy path + casos límite antes de que publiques |
| ❌ Escribiendo prompts, gestionando contexto, perdiendo el flujo | ✅ Orquestador ejecuta el pipeline. Tú apruebas artefactos. |
| ❌ 5 side projects, 0 terminados | ✅ Pipeline fuerza momentum: Plan → Spec → Breakdown → Execute → Review |
| ❌ "¿Esto está listo para lanzar?" | ✅ Fase de Review: aprobación QA + code review del Tech Lead = publica con confianza |

<br>

---

## Qué hace diferente a Timovi

| | OpenClaw / Hermes | Paperclip | **Timovi** |
|---|:---:|:---:|:---:|
| **Enfoque** | Agente de IA genérico | Plataforma de orquestación de agentes | **Equipo de producto para builders** |
| **Tiempo de setup** | 30+ min config | Servidor + UI React | **1 comando, 5 min bootstrap** |
| **Entregables** | Agente ejecuta comandos | Tareas + presupuestos | **PRD → Issues → PRs → Review** |
| **Role de UX** | — | — | **UX Designer dedicado** |
| **Curva de aprendizaje** | Alta | Alta | **Guiado — una pregunta a la vez** |
| **Para quién** | Power users | Empresas | **Founders solitarios & devs indie** |

<br>

---

## Agentes Soportados

Timovi funciona con cualquier agente soportado por [npx skills](https://github.com/vercel-labs/skills). Principales probados:

| Agente | Ruta de instalación |
|-------|-------------|
| **Pi** | `.pi/skills/timovi/` |
| **Claude Code** | `.claude/skills/timovi/` |
| **Cursor** | `.agents/skills/timovi/` |
| **Codex** | `.agents/skills/timovi/` |
| **OpenCode** | `.agents/skills/timovi/` |

<br>

---

## Por Dentro

Timovi es un **meta-framework de agent skills** — Markdown + JSON, sin runtime, sin servidores.

```
skills/timovi/
├── SKILL.md                 ← Orquestador (estás aquí)
├── references/
│   ├── bootstrap.md         ← Flujo de configuración inicial
│   ├── feature-pipeline.md  ← Ciclo de desarrollo en 5 fases
│   ├── state-schema.md      ← Formato de estado persistente
│   └── role-skill-template.md
├── roles/                   ← 10 agentes especialistas
│   ├── product-manager/SKILL.md
│   ├── ux-designer/SKILL.md
│   └── ...
└── workflows/               ← Plantillas de Workflow
    ├── new-feature.md
    ├── bug-fix.md
    └── deploy.md
```

**Comportamiento en runtime:**
- Cada Role carga el **Layer 0** (base de conocimiento del proyecto) antes de actuar
- El orquestador guarda **checkpoints** después de cada fase — retoma entre sesiones
- Las Issues se ejecutan como un **DAG** con rondas paralelas, respetando dependencias
- Todos los datos específicos del proyecto viven en `.product-team/` — nunca toca el template

<br>

---

## Comunidad

- 🔍 Descubre más skills en **[skills.sh](https://skills.sh)**
- 🛠️ Creado para el ecosistema **[npx skills](https://github.com/vercel-labs/skills)**
- 🐛 [Issues & solicitudes de features](https://github.com/theminimalcreator/timovi/issues)
- ⭐ Dale estrella al repo si Timovi te ayuda a publicar

<br>

---

## Inspiraciones

Proyectos e ideas que inspiraron Timovi:

- **[Reversa](https://github.com/theminimalcreator/timovi/blob/main/AGENTS.md)** — Un framework de ingeniería inversa que demostró que los agentes de IA podían analizar y documentar codebases existentes de forma sistemática. Reversa mostró que los flujos de trabajo de agentes estructurados y basados en fases producen resultados confiables.
- **[Vercel Skills](https://github.com/vercel-labs/skills)** — El ecosistema abierto de agent skills que hizo trivial la distribución de skills. Sin `npx skills`, Timovi sería una instalación manual.
- **[Paperclip](https://github.com/paperclipai/paperclip)** — Mostró que los "equipos de producto virtuales" eran la abstracción correcta — solo que demasiado pesada para founders solitarios. Timovi es la respuesta ligera.
- **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** — Demostró que los agent skills podían auto-mejorarse. El patrón de cross-examination de Timovi fue inspirado por el bucle de aprendizaje de Hermes.
- **La experiencia del founder solitario** — Todo dev indie que hace malabares con 5 side projects, nunca tiene tiempo para UX y desearía tener un equipo. Timovi existe porque construir solo no debería significar construir sin estructura.

<br>

---

## Licencia

MIT — consulta [LICENSE](LICENSE).

Creado por [@theminimalcreator](https://github.com/theminimalcreator).
