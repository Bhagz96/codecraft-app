# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm run test      # Run tests (Vitest)
npm run test:ui   # Run tests with visual UI
```

Deployed to Vercel (SPA rewrites configured in `vercel.json`).

## Test-Driven Development

This project follows TDD. Before implementing any feature or fix:

1. **Write a failing test first** — in `src/__tests__/` mirroring the source path (e.g. `src/mab/engine.js` → `src/__tests__/mab/engine.test.js`)
2. **Run the test to confirm it fails**
3. **Write the minimum code to make it pass**
4. **Refactor** if needed, keeping tests green

Use **Vitest** + **React Testing Library** for all tests. Test files use `.test.js` or `.test.jsx` extensions.

Priority areas for test coverage:
- `src/mab/` — MAB engine logic (pure functions, easy to unit test)
- `src/data/` — hero XP, progress tracking, lesson structure
- `src/components/` — component rendering and user interactions via React Testing Library

Do not add a new feature or change existing behaviour without a corresponding test.

## Architecture

KidCode Quest is an **interactive educational game** that teaches Python programming (Variables, Loops, Conditions) through a mountain-climbing narrative. Users create a hero and progress through concept lessons.

### Routing (`src/App.jsx`)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Hero creation + concept picker |
| `/lesson/:conceptId/:level` | `LessonPage` | Main lesson player |
| `/reward` | `RewardPage` | Post-lesson celebration |
| `/admin` | `AdminDashboard` | MAB analytics/debugging |

### MAB Engine (`src/mab/`)

The core differentiator: an **epsilon-greedy Multi-Armed Bandit algorithm** (ε=0.3) selects the lesson *modality* (CodeSimulation, DragDropBuilder, SpeedCoding) and *reward type* (badge, XP, mystery box) for each session. State persists to localStorage as `kidcode_modalityMAB` and `kidcode_rewardMAB`. Sessions are optionally logged to Supabase for analytics.

### Lesson Components (`src/components/`)

Three interchangeable teaching modalities all receive the same lesson step data:
- **`CodeSimulation`** — read and trace Python code execution
- **`DragDropBuilder`** — arrange code blocks in correct order
- **`SpeedCoding`** — fill-in-the-blank coding challenges

Supporting modes: `StoryMode`, `ChallengeMode`, `PuzzleMode`, `ConceptIntro`.

### Game Scenes (`src/components/game/`)

`GameScene.jsx` routes to one of five SVG scene types (`hero-spawn`, `base-camp`, `mountain-trail`, `mountain-battle`, `the-gate`) based on the lesson step's `sceneId`. `GameHero.jsx` + `PixelHero.jsx` render the animated hero character.

### Data Layer (`src/data/`)

- `lessons.js` — all lesson content (concepts × levels × steps)
- `lessonTemplates.js` — dynamically injects hero name into lesson narrative
- `hero.js` — hero creation, XP, level management
- `progress.js` — completion tracking (all via localStorage: `kidcode_hero`, `kidcode_progress`)

### Layout Pattern

Desktop: game scene (left) + lesson content (right) side-by-side. Mobile: stacked vertically. Dark theme base `#0d1117` with neon cyan/green/purple/orange accents and glow effects. Fonts: JetBrains Mono, Fira Code, Cascadia Code.

### Environment Variables (optional)

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

App works fully without these — Supabase integration degrades gracefully.
