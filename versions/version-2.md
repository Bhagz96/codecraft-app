# Version 2 — KidCode Quest (Teen/Young Adult Edition)

**Date:** March 23, 2026
**Target Audience:** Teenagers and young adults (15+)
**Status:** Planned — not yet implemented

---

## Overview

A major redesign of KidCode Quest, shifting from a children's app to a teenager/young adult coding education platform. Features a dark developer-themed UI, three genuinely different interactive game modalities, 5 difficulty levels per concept with sequential unlocking, and expanded coding content that builds toward creating simple functional programs.

The MAB algorithm remains unchanged — it still silently tests which modality and reward type drives the most engagement.

---

## What Changed from Version 1

| Area | Version 1 | Version 2 |
|---|---|---|
| **Audience** | Kids 4–10 | Teens/young adults 15+ |
| **Visual style** | Bright pastels, emojis, rounded | Dark theme, neon accents, monospace fonts |
| **Lessons** | 3 concepts, 1 level each | 6+ concepts, 5 levels each |
| **Difficulty** | Single level, all accessible | 5 tiers, unlock sequentially |
| **Game modes** | All are "read text, pick answer" | 3 genuinely different interactive experiences |
| **Content depth** | Simple analogies (sandwiches, flowers) | Real code snippets, actual programming |
| **Rewards** | Kid emojis (🦕 🍕 🎪) | Dev-themed (Bug Squasher, First Commit, XP) |
| **Character** | Cody the Cat 🐱 | Removed — mature tone |
| **Desktop focus** | Mobile-responsive | Desktop-first |

---

## Tech Stack (Unchanged)

| Tool | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.13.1 | Client-side routing |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Vite | 8.0.1 | Build tool with HMR |
| Supabase JS | 2.99.3 | Optional cloud database |

**No new dependencies required.** HTML5 drag-and-drop, SVG animations, and regex-based syntax highlighting — no external libraries needed.

---

## New Project Structure

```
src/
  App.jsx                       # Routes updated: /lesson/:conceptId/:level
  main.jsx                      # Unchanged
  index.css                     # Dark theme + font imports
  components/
    CodeSimulation.jsx          # NEW — replaces StoryMode.jsx
    DragDropBuilder.jsx         # NEW — replaces PuzzleMode.jsx
    SpeedCoding.jsx             # NEW — replaces ChallengeMode.jsx
    drag-drop/
      CodeBlock.jsx             # NEW — single draggable code block
      DropZone.jsx              # NEW — program assembly area
      VisualOutput.jsx          # NEW — SVG visual that reacts to code
  data/
    lessons.js                  # REWRITTEN — expanded content model
    progress.js                 # NEW — level unlock/tracking system
  pages/
    HomePage.jsx                # REWRITTEN — concept grid with progress
    LessonPage.jsx              # MODIFIED — new components + progress
    RewardPage.jsx              # RETHEMED — teen-appropriate rewards
    AdminDashboard.jsx          # RETHEMED — dark theme + new labels
  mab/
    engine.js                   # MINOR — arm names updated
    sessionTracker.js           # EXPANDED — new session fields
    supabase.js                 # EXPANDED — new table columns
```

---

## Visual Design

- **Background:** Dark (`#0d1117` primary, `#161b22` secondary, `#1c2333` cards)
- **Accents:** Neon green (`#00ff88`), cyan (`#00d4ff`), purple (`#a855f7`), orange (`#ff6b35`)
- **Code font:** JetBrains Mono or Fira Code (monospace)
- **UI font:** Inter (clean sans-serif)
- **Icons:** Code-style text icons (`{ }`, `[ ]`, `fn()`, `for`, `x=`) — no emojis
- **Feel:** VS Code / terminal vibes — dark, professional, developer-oriented

---

## Coding Concepts (6+ Topics)

### Fully Built (3 concepts, 5 levels each)

#### 1. Variables (`x=`)
- **Level 1:** Declaring variables (`let`, `const`)
- **Level 2:** Reassignment and types
- **Level 3:** String vs number operations
- **Level 4:** Scope basics
- **Level 5:** Complex expressions and type coercion

#### 2. Loops (`for`)
- **Level 1:** Basic `for` loop structure
- **Level 2:** Loop with arrays
- **Level 3:** Nested loops
- **Level 4:** `while` loops and break conditions
- **Level 5:** Loop optimization and common patterns

#### 3. Conditions (`if`)
- **Level 1:** Basic `if/else`
- **Level 2:** Comparison operators
- **Level 3:** Logical operators (`&&`, `||`, `!`)
- **Level 4:** Nested conditions and `else if`
- **Level 5:** Ternary operators and switch statements

### Planned (placeholder content initially)

#### 4. Functions (`fn()`)
- Defining, calling, parameters, return values, scope

#### 5. Arrays (`[ ]`)
- Creating, accessing, methods (push, pop, map, filter)

#### 6. Objects (`{ }`)
- Key-value pairs, accessing properties, methods

**Long-term goal:** Users can combine concepts to build simple functioning things (a basic game, a task manager, etc.)

---

## Difficulty System

- **5 levels per concept**, unlocking **sequentially**
- Must complete Level 1 before Level 2 becomes available
- Progress tracked in localStorage via `src/data/progress.js`
- Home page shows: completed levels (checkmark/glow), current level (available), locked levels (dimmed/padlock)

### Progress Module (`src/data/progress.js`)

```javascript
getProgress(conceptId)          // Returns highest completed level (0 if none)
completeLevel(conceptId, level) // Marks level complete, unlocks next
isLevelUnlocked(conceptId, level) // Checks if level is playable
getAllProgress()                 // Returns full progress map for home page
```

**Storage:** localStorage key `kidcode_progress`

---

## Three Game Modalities (MAB Arms)

### 1. Code Simulation (`CodeSimulation.jsx`) — replaces Story Mode

**What it is:** A step-by-step code execution walkthrough, like using a debugger.

**How it works:**
- Displays a code snippet in a styled dark code block with line numbers
- Current line highlighted with a neon glow/arrow marker
- A **variable watch panel** on the side shows variable values updating in real-time
- Question: *"What is the value of `x` after this line runs?"*
- User selects from multiple-choice options
- Simple regex-based syntax highlighting (keywords like `let`, `for`, `if`, `function`, `return` get coloured spans)

**Step data needed:**
```javascript
{
  codeSnippet: "let x = 5;\nlet y = x + 3;\nx = y * 2;",
  traceQuestion: "What is the value of x?",
  options: ["5", "16", "8", "3"],
  correctIndex: 1,
  explanation: "y = 5 + 3 = 8, then x = 8 * 2 = 16"
}
```

**Props:** `{ step, onAnswer, feedback }` (same contract)

---

### 2. Drag-and-Drop Code Builder (`DragDropBuilder.jsx`) — replaces Puzzle Mode

**What it is:** Arrange code blocks in the correct order and watch a visual character respond.

**How it works:**
- **Left/bottom:** Pool of draggable code blocks (shuffled)
- **Right/top:** Drop zone where user assembles the "program"
- **Visual output panel:** SVG animation that reacts to the code arrangement
  - **Correct order** → character climbs mountain / reaches goal
  - **Wrong order** → character falls / fails
- User arranges blocks, clicks "Run Code" to check
- Uses HTML5 drag-and-drop API (`onDragStart`, `onDragOver`, `onDrop`)

**Sub-components:**
- `drag-drop/CodeBlock.jsx` — a single draggable block
- `drag-drop/DropZone.jsx` — the program assembly area
- `drag-drop/VisualOutput.jsx` — SVG visual that animates based on correctness

**Visual scenes available:**
- `"mountain"` — character climbs up or slides down
- `"maze"` — character navigates or hits wall
- More can be added over time

**Step data needed:**
```javascript
{
  instruction: "Arrange the code to make the character reach the top!",
  codeBlocks: ["let steps = 10", "for (let i = 0; i < steps; i++)", "  climb()", "}", "celebrate()"],
  correctOrder: [0, 1, 2, 3, 4],
  visualScene: "mountain",
  explanation: "The loop repeats climb() 10 times, then celebrate() runs once."
}
```

**Props:** `{ step, onAnswer, feedback }` (same contract)

---

### 3. Speed Coding Challenge (`SpeedCoding.jsx`) — replaces Challenge Mode

**What it is:** Fill-in-the-blank code completion under time pressure with streak bonuses.

**How it works:**
- Displays a code template with blanks: `for (let i = ___; i < ___; i++)`
- Each blank has 2–3 clickable **chips** appearing near the blank
- User clicks chips to fill blanks, then clicks "Submit"
- **Timer bar** counting down (neon-styled)
- **Streak counter:** consecutive correct answers multiply score (1x → 2x → 3x…)
- **Score display:** arcade leaderboard style with neon numbers
- Points based on speed + streak multiplier

**Step data needed:**
```javascript
{
  instruction: "Complete the loop that counts from 0 to 9",
  codeTemplate: "for (let i = ___; i < ___; i++) {\n  console.log(i);\n}",
  blanks: [
    { position: 0, options: ["0", "1", "10"], correctIndex: 0 },
    { position: 1, options: ["10", "9", "5"], correctIndex: 0 }
  ],
  explanation: "i starts at 0 and the loop runs while i < 10, giving us 0 through 9."
}
```

**Props:** `{ step, onAnswer, feedback }` (same contract)

---

## Reward System (Rethemed for Teens)

### Badges (Dev-Themed)
- "Bug Squasher" — debugged successfully
- "First Commit" — completed first lesson
- "Stack Overflow Survivor" — got a hard question right
- "10x Developer" — perfect score
- "Open Source Hero" — completed all concepts
- SVG badge icons instead of emojis

### Coins → XP/Credits
- Renamed from "coins" to "XP" or "Credits"
- Terminal-style counter animation
- Dark card with neon number animation
- Random amount 20–50 XP

### Mystery Box → `sudo apt-get surprise`
- Styled as a terminal command interaction
- Items: "Dark Theme Unlock", "Custom Terminal Prompt", "ASCII Art Pack", "Code Snippet Collection", "Rubber Duck Debugger", "Infinite Coffee"
- Tap/click to "execute" the command and reveal

---

## Updated Routes

| Path | Page | Purpose |
|---|---|---|
| `/` | HomePage | Concept picker with level progress |
| `/lesson/:conceptId/:level` | LessonPage | Play a specific concept at a specific level |
| `/reward` | RewardPage | Celebrate completion (rethemed) |
| `/admin` | AdminDashboard | MAB analytics (rethemed) |

---

## MAB Changes (Minimal)

**Algorithm:** Unchanged (epsilon-greedy, epsilon = 0.3)

**Arm name updates only:**
- Modalities: `["story", "puzzle", "challenge"]` → `["codeSimulation", "dragDrop", "speedCoding"]`
- Rewards: Unchanged `["badge", "coins", "mysteryBox"]`

**MAB does NOT test difficulty.** Difficulty is always user-chosen (sequential unlock).

---

## Session Tracker Updates

**New fields added to session object:**
```javascript
{
  sessionId: "sess_abc123",
  userId: "user_xyz789",
  conceptId: "variables",       // was lessonId
  level: 3,                     // NEW
  modality: "codeSimulation",   // updated name
  rewardType: "badge",
  completed: true,
  timeSpent: 180,
  score: 450,                   // NEW (for speed coding)
  streak: 3,                    // NEW (for speed coding)
  timestamp: "2026-03-23T16:10:00Z"
}
```

---

## Supabase Schema Updates

**Sessions table — new columns:**
- `concept_id TEXT` (replaces `lesson_id`)
- `level INTEGER`
- `score INTEGER`
- `streak INTEGER`

**New progress table:**
```sql
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  highest_level INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);
```

---

## Implementation Order

| Step | Task | Files |
|---|---|---|
| 1 | Rewrite lesson data model | `src/data/lessons.js` |
| 2 | Build progress/unlock system | `src/data/progress.js` (new) |
| 3 | Apply dark theme foundation | `src/index.css`, `index.html` |
| 4 | Redesign Home Page | `src/pages/HomePage.jsx` |
| 5 | Update routing | `src/App.jsx` |
| 6 | Build Code Simulation mode | `src/components/CodeSimulation.jsx` (new) |
| 7 | Build Speed Coding mode | `src/components/SpeedCoding.jsx` (new) |
| 8 | Build Drag-and-Drop Builder | `src/components/DragDropBuilder.jsx` + `drag-drop/` (new) |
| 9 | Update Lesson Page | `src/pages/LessonPage.jsx` |
| 10 | Retheme Rewards | `src/pages/RewardPage.jsx` |
| 11 | Retheme Admin Dashboard | `src/pages/AdminDashboard.jsx` |
| 12 | Update MAB + session tracking | `src/mab/engine.js`, `sessionTracker.js`, `supabase.js` |

---

## Key Architectural Decisions

1. **No new dependencies** — HTML5 drag-and-drop, SVG visuals, regex syntax highlighting
2. **Same component prop contract** — `{ step, onAnswer, feedback }` for all modalities
3. **MAB engine logic untouched** — only arm name strings change
4. **Progress is localStorage-first** — optional Supabase sync, no auth required
5. **Content priority** — 3 concepts fully built first (Variables, Loops, Conditions), rest added iteratively
6. **Desktop-first** — mobile responsiveness is secondary

---

## How to Execute Version 2

Tell Claude Code: **"Execute the Version 2 redesign"** and point to this file. Follow the implementation order above, building step by step.

## How to Revert to Version 1

Tell Claude Code: **"Restore the codebase to Version 1"** and point to `versions/version-1.md`. The Version 1 code exists in the git history before the Version 2 work began.
