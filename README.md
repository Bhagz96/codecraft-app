# KidCode Quest

An interactive educational game that teaches Python programming through a mountain-climbing narrative. Kids create a hero and progress through concept lessons on Variables, Loops, and Conditions — earning XP and rewards along the way.

## Tech Stack

- **React 19** + **Vite** — frontend framework and build tool
- **React Router v7** — client-side routing (SPA)
- **Tailwind CSS v4** — styling
- **Supabase** (optional) — session analytics logging
- **Vitest** + **React Testing Library** — testing
- **Vercel** — deployment (SPA rewrites via `vercel.json`)

## Getting Started

```bash
npm install
npm run dev       # Dev server at localhost:5173
```

## Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm run test      # Run tests
npm run test:ui   # Run tests with visual UI
```

## Architecture

### Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Hero creation + concept picker |
| `/lesson/:conceptId/:level` | `LessonPage` | Main lesson player |
| `/reward` | `RewardPage` | Post-lesson celebration |
| `/admin` | `AdminDashboard` | MAB analytics/debugging |

### MAB Engine (`src/mab/`)

An **epsilon-greedy Multi-Armed Bandit** (ε=0.3) selects the lesson modality and reward type for each session, adapting to what works best for each learner. State persists to localStorage.

**Modalities:** CodeSimulation, DragDropBuilder, SpeedCoding
**Rewards:** badge, XP, mystery box

### Lesson Components (`src/components/`)

Three interchangeable teaching modes, all receiving the same lesson step data:

- **`CodeSimulation`** — read and trace Python code execution
- **`DragDropBuilder`** — arrange code blocks in correct order
- **`SpeedCoding`** — fill-in-the-blank coding challenges

### Game Scenes (`src/components/game/`)

`GameScene.jsx` renders one of five SVG scenes (`hero-spawn`, `base-camp`, `mountain-trail`, `mountain-battle`, `the-gate`) based on the current lesson step.

### Data Layer (`src/data/`)

- `lessons.js` — all lesson content (concepts × levels × steps)
- `lessonTemplates.js` — injects hero name into narrative
- `hero.js` — hero creation, XP, level management
- `progress.js` — completion tracking

All state persists to localStorage (`kidcode_hero`, `kidcode_progress`, `kidcode_modalityMAB`, `kidcode_rewardMAB`).

## Environment Variables (optional)

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

The app works fully without these — Supabase integration degrades gracefully.

## Testing

This project follows TDD. Tests live in `src/__tests__/` mirroring the source structure.

```bash
npm run test       # Run all tests once
npm run test:ui    # Visual test runner
```
