# KidCode Quest — Project Context & Overview

> **Also known as:** CodeCraft: Mountain Quest Edition  
> **Deployed at:** Vercel (SPA)  
> **Repository:** `/Users/bhagyawelikala/Documents/Kidcode-Quest`  
> **Last updated:** 2026-04-01

---

## What Is This Project?

KidCode Quest is an **interactive educational game** that teaches Python programming to teens and young adults through a mountain-climbing narrative. The player creates a named hero and progresses through structured lessons on three Python concepts — Variables, Loops, and Conditions — by writing real game code at each step.

The core academic purpose is to demonstrate a **Multi-Armed Bandit (MAB) algorithm** for adaptively selecting instructional support strategies, making this a practical application of marketing/analytics decision science in an educational context.

---

## Goals

| Goal | Description |
|------|-------------|
| **Educational** | Teach Python (Variables, Loops, Conditions) through hands-on game-building |
| **Academic / Research** | Demonstrate epsilon-greedy MAB as an A/B testing alternative for selecting teaching strategies |
| **MVP Scope** | 3 concepts × 5 levels × 3 steps each = 45 lesson steps total |
| **No login required** | All state stored in `localStorage`; Supabase is optional for analytics only |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | `localStorage` only (no backend required) |
| Analytics (optional) | Supabase (degrades gracefully if not configured) |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel (SPA rewrites via `vercel.json`) |

---

## Architecture

### Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Hero creation + concept picker |
| `/lesson/:conceptId/:level` | `LessonPage` | Main lesson player |
| `/reward` | `RewardPage` | Post-lesson celebration |
| `/admin` | `AdminDashboard` | MAB analytics / debugging |

### Core Systems

**MAB Engine (`src/mab/engine.js`)**  
Epsilon-greedy algorithm (ε=0.2) with a warm-up phase that tries every arm at least once before exploitation begins. The primary MAB selects one of five **instructional support strategies** per session:

- `worked_example_first` — show a solved example before the question
- `hint_first` — give a contextual hint upfront
- `try_first_then_hint` — attempt unaided; hint unlocks after first wrong answer
- `step_by_step_scaffold` — break into guided sub-steps
- `explain_after_error` — explain the concept after a wrong answer, then retry

Reward scoring is learning-focused: first-try correct with no hints = 1.0; decreases with hint use and extra attempts.

Secondary MABs (kept for backward compatibility) select **teaching modality** and **reward type**.

**Lesson Components (`src/components/`)**  
Three interchangeable teaching modalities receive the same step data:

- `CodeSimulation` — read and trace Python execution
- `DragDropBuilder` — arrange code blocks in correct order
- `SpeedCoding` — fill-in-the-blank challenges

Supporting modes: `StoryMode`, `ChallengeMode`, `PuzzleMode`, `ConceptIntro`.

**Game Scenes (`src/components/game/GameScene.jsx`)**  
SVG-rendered scenes tied to lesson steps via `sceneId`. Five scene types:

| Scene ID | Setting |
|----------|---------|
| `hero-spawn` | Hero creation / starting point |
| `base-camp` | Camp setup scenes |
| `mountain-trail` | Path and obstacle scenes |
| `mountain-battle` | Enemy encounter scenes |
| `the-gate` | Condition / decision scenes |

**Data Layer (`src/data/`)**

- `lessons.js` — all 45 lesson steps (1367 lines)
- `lessonTemplates.js` — injects hero name into narrative text
- `workedExamples.js` — worked example content for MAB strategy
- `hero.js` — hero creation, XP, level management
- `progress.js` — completion tracking

---

## Lesson Content

3 concepts × 5 levels × 3 steps = **45 lesson steps**

| Concept | Narrative Frame | Key Python Topics |
|---------|----------------|-------------------|
| Variables | "Setting Up the Game" | assignment, strings, integers, f-strings, dicts |
| Loops | "Training Montage" | `for` loops, `range()`, nested loops |
| Conditions | "The Mountain Gate" | `if/elif/else`, boolean logic, comparisons |

---

## Major Development Milestones

### Version 1 — Kids Edition (2026-03-23)
Initial release targeting younger children. Basic lesson structure with JavaScript content.

### Version 2 — Teen/Young Adult Redesign (2026-03-24)
- Full visual and tone redesign for older audience
- Switched all lesson content from **JavaScript to Python**
- Added pixel art hero system and 4 game scenes
- Renamed project to "CodeCraft: Mountain Quest Edition"

### Vercel Deployment Setup (2026-03-29)
- Added `vercel.json` for correct Vite SPA build configuration
- Story-driven landing page with mountain scene and narrative intro
- Fixed game scene layout (duplicate explanation box, sizing)

### MAB Upgrade — Instructional Support Strategies (2026-03-31)
- Replaced modality/reward MABs as primary layer with **instructional support strategies** as the main MAB arm
- Upgraded from engagement-based to **learning-focused reward scoring**
- Added warm-up phase so all arms are tested before exploitation begins
- Added worked examples system (`workedExamples.js`) and parallel concept notes
- Hides question until learner dismisses the worked example
- Fixed all 45 lesson steps' support strategy content quality

### Game Scene Visual Overhaul (2026-03-31)
- Added context-aware `if/else` gameplay scenes and dynamic condition panels
- Replaced energy boulder with RPG energy gate mechanic
- Redesigned fork-path scene (iterated through: RPG top-down → Cave Dungeon → Mountain Cave Openings with hero in gap)
- Redesigned weather-check scene to match narrative hero behaviour
- Redesigned obstacle visuals:
  - Rock: jagged polygon boulder with fracture lines, moss, animated crack-split on success
  - Bridge: full river gorge scene with animated river, rope bridge, wooden planks, physics-based fail/success animations

### Tests + CLAUDE.md Added (2026-03-31)
- Added Vitest test suite covering: MAB engine, session tracker, hero data, progress, lesson templates, lesson structure, and all 3 teaching modality components
- Added `CLAUDE.md` with architecture documentation and TDD workflow

### Content Correctness Fixes (2026-03-31 → 2026-04-01)
- Fixed 6 Python code bugs in `lessons.js` (double-brace f-string errors, variable name mismatches in condition panels)
- Clarified Loops L3 S1 speed-coding instruction (inner `range()` count was ambiguous)

---

## File Structure (Key Paths)

```
src/
├── App.jsx                    # Router + route definitions
├── mab/
│   ├── engine.js              # MAB algorithm (epsilon-greedy, arm selection, reward scoring)
│   ├── sessionTracker.js      # Tracks per-question metrics, logs to Supabase
│   └── supabase.js            # Optional Supabase client
├── data/
│   ├── lessons.js             # All 45 lesson steps
│   ├── lessonTemplates.js     # Hero name injection
│   ├── workedExamples.js      # Worked example content per strategy
│   ├── hero.js                # Hero XP + level management
│   └── progress.js            # localStorage completion tracking
├── components/
│   ├── CodeSimulation.jsx
│   ├── DragDropBuilder.jsx
│   ├── SpeedCoding.jsx
│   ├── StoryMode.jsx
│   ├── ChallengeMode.jsx
│   ├── PuzzleMode.jsx
│   ├── ConceptIntro.jsx
│   └── game/
│       ├── GameScene.jsx      # SVG scene renderer (all 5 scene types)
│       ├── GameHero.jsx
│       └── PixelHero.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LessonPage.jsx
│   ├── RewardPage.jsx
│   └── AdminDashboard.jsx
└── __tests__/                 # Vitest tests mirroring src/ structure
```

---

## Design System

- **Theme:** Dark base `#0d1117` with neon accents (cyan, green, purple, orange) and glow effects
- **Fonts:** JetBrains Mono, Fira Code, Cascadia Code
- **Layout:** Desktop — game scene (left) + lesson content (right) side-by-side; Mobile — stacked vertically
- **Scenes:** Fully SVG-rendered, no image assets

---

## Environment Variables (Optional)

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

The app works fully without these. Supabase is used only for optional session analytics logging.

---

## Development Workflow

- **TDD:** Write failing test first → run to confirm failure → implement minimum code → refactor
- **Test runner:** `npm run test` (Vitest), `npm run test:ui` for visual UI
- **Dev server:** `npm run dev` at `localhost:5173`
- **Deploy:** Push to `main` → Vercel auto-deploys
