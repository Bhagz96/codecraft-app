# Version 1 — KidCode Quest (Kids Edition)

**Date:** March 23, 2026
**Target Audience:** Children aged 4–10
**Status:** Complete and working

---

## Overview

A gamified coding education web app for young children. Teaches coding logic through interactive mini-games with a character called Cody the Cat. A Multi-Armed Bandit (MAB) algorithm silently tests different teaching styles and reward types to find what keeps kids most engaged.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.13.1 | Client-side routing |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Vite | 8.0.1 | Build tool with HMR |
| Supabase JS | 2.99.3 | Optional cloud database |

---

## Project Structure

```
src/
  App.jsx                       # Routes: /, /lesson/:lessonId, /reward, /admin
  main.jsx                      # React entry point
  index.css                     # Tailwind import
  components/
    StoryMode.jsx               # Narrative teaching modality (cat character in speech bubble)
    PuzzleMode.jsx              # Visual quiz modality (big colourful buttons)
    ChallengeMode.jsx           # Timed game modality (15s countdown, score points)
  data/
    lessons.js                  # 3 lessons, 3 steps each, all multiple-choice
  pages/
    HomePage.jsx                # Lesson picker with gradient cards
    LessonPage.jsx              # Main lesson player (MAB selects modality)
    RewardPage.jsx              # Post-lesson celebration screen
    AdminDashboard.jsx          # MAB analytics dashboard
  mab/
    engine.js                   # Epsilon-greedy MAB algorithm
    sessionTracker.js           # Session logging (localStorage)
    supabase.js                 # Optional Supabase integration
```

---

## Visual Design

- **Style:** Bright, pastel, kid-friendly
- **Background:** Gradient `from-indigo-100 via-purple-50 to-pink-100`
- **Icons:** Emojis throughout (🐾 🔄 🤔 🐱 🧩 ⚡ 🏆 🎉)
- **Fonts:** Default sans-serif, large sizes
- **Cards:** Rounded corners, gradient backgrounds, hover animations
- **Buttons:** Big, colourful, easy to tap

---

## Lessons (3 Total)

### Lesson 1: "Step by Step" (Sequences) 🐾
- **Concept:** Doing things in order
- **Steps:** Making a sandwich — bread first, peanut butter, then eat
- **Character:** Cody the Cat guides through each step

### Lesson 2: "Round and Round" (Loops) 🔄
- **Concept:** Repeating actions instead of rewriting
- **Steps:** Watering flowers, climbing stairs, brushing teeth
- **Character:** Cody the Cat explains repetition

### Lesson 3: "Yes or No?" (Conditions) 🤔
- **Concept:** Making decisions with IF/THEN
- **Steps:** Weather check, locked door, buying a toy
- **Character:** Cody the Cat teaches decision-making

Each lesson has **3 steps**, all **multiple-choice with 3 options**.

---

## Three Teaching Modalities (MAB Arms)

### Story Mode (`StoryMode.jsx`)
- Cat character (🐱) in a speech bubble narrates a scenario
- Purple-themed instruction box
- A/B/C labeled answer buttons
- Explanation shown after answering

### Puzzle Mode (`PuzzleMode.jsx`)
- "PUZZLE TIME" blue badge header
- Question in dashed border card
- Big colourful buttons (pink/blue/yellow) with bold borders
- Visual, no narration

### Challenge Mode (`ChallengeMode.jsx`)
- 15-second countdown timer per question
- Score system: points = (timeLeft / 15) * 100
- Timer bar changes colour: green → yellow → red
- Auto-submits when time expires (counts as incorrect)
- Running score display

---

## Three Reward Types (MAB Arms)

### Badges
Random selection from: Super Star ⭐, Brain Power 🧠, Rocket Coder 🚀, Code Unicorn 🦄

### Coins
Random amount between 20–50 coins with animated counter

### Mystery Box
Tap to reveal a random surprise: Rainbow Paint 🌈, Dino Friend 🦕, Pizza Party 🍕, Rock Star Guitar 🎸, Rainbow Power 🌈, Circus Ticket 🎪

---

## MAB Algorithm

**Type:** Epsilon-Greedy
**Epsilon:** 0.3 (30% explore, 70% exploit)
**Two independent MABs:**
1. Modality MAB — tests story vs puzzle vs challenge
2. Reward MAB — tests badge vs coins vs mysteryBox

**Reward signal:** `correctCount / totalSteps` (0 to 1 scale)

**Storage:** localStorage keys:
- `kidcode_modalityMAB`
- `kidcode_rewardMAB`
- `kidcode_sessions`
- `kidcode_userId`

---

## Admin Dashboard

- Bar charts for modality and reward type performance
- "Current leader" banner on best-performing arm
- Shows: pulls count, average reward %, visual bar comparison
- **Simulate 50 Sessions** button (biased: Story 80%, Puzzle 60%, Challenge 50%)
- **Reset All Data** button
- "How MAB Works" explainer section
- Session log table (last 20 sessions)

---

## User Flow

```
HomePage (pick a lesson)
  → LessonPage (MAB picks modality + reward)
    → Complete 3 steps in selected modality
      → RewardPage (show MAB-selected reward)
        → Back to HomePage
```

---

## Routes

| Path | Page | Purpose |
|---|---|---|
| `/` | HomePage | Lesson picker grid |
| `/lesson/:lessonId` | LessonPage | Play a lesson |
| `/reward` | RewardPage | Celebrate completion |
| `/admin` | AdminDashboard | MAB analytics |

---

## Key Implementation Details

- **No login required** — anonymous session-based tracking via localStorage
- **Supabase is optional** — app works fully offline with localStorage
- **Mobile-responsive** — grid adapts from 1 to 3 columns
- **All data hardcoded** — lessons defined in `src/data/lessons.js`
- **Component contract:** All modalities receive `{ step, onAnswer, feedback }` props
- **No difficulty levels** — single difficulty per lesson
- **No unlock system** — all lessons available from start

---

## How to Restore Version 1

Tell Claude Code: **"Restore the codebase to Version 1"** and point to this file. The complete source code for every file is documented in the codebase's git history at the commit tagged before the Version 2 redesign began.
