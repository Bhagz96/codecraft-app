# KidCode Quest — Project Elements (Track 3)

**Course:** Applied AI in Marketing
**Track:** Product Deployment & Go-To-Market
**Product:** KidCode Quest — A gamified Python coding education web app

---

## Element 1: The AI Artifact

### What we built
KidCode Quest is a web application that teaches Python programming through interactive game-based lessons. The entire application was built using **Claude Code (AI-assisted development)** — from architecture decisions to every line of code. The app itself also contains an **AI algorithm** running in the background.

### The AI layers

**Layer 1 — AI as the builder (Claude Code)**
- The entire codebase was generated and iterated using Claude Code, an AI coding assistant
- Every component, game mode, lesson content, and visual element was designed and implemented through AI-human collaboration
- This demonstrates AI's capability in product development — a non-developer was able to build a fully functional interactive web app

**Layer 2 — AI inside the product (Multi-Armed Bandit Algorithm)**
- An **Epsilon-Greedy Multi-Armed Bandit (MAB)** algorithm runs silently inside the app
- It tests three different teaching modalities (the "arms"):
  1. **Code Simulation** — step-by-step code tracing like a debugger
  2. **Drag & Drop Code Builder** — arrange code blocks in correct order with visual feedback (pixel art character climbs a mountain on success)
  3. **Speed Coding** — fill-in-the-blank code under a timer with streak multipliers
- It also tests three reward types:
  1. **Badges** — dev-themed achievements (e.g., "Bug Squasher", "10x Developer")
  2. **XP Credits** — experience points with a levelling system
  3. **Mystery Drops** — randomised surprise items with rarity tiers
- The MAB balances **exploration** (30% — randomly try different options) and **exploitation** (70% — go with what's performing best)
- Over time, the algorithm learns which modality and reward type drives the highest engagement and automatically shifts more users toward the winner

### Tech stack
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Tailwind CSS 4 | Styling (dark developer theme) |
| Vite 8 | Build tool |
| Supabase (optional) | Cloud database for session logging |
| Vercel | Free hosting for deployment |
| Claude Code | AI-assisted development of the entire product |

### Product features
- **Hero creation** — users name and customise a pixel art character that persists across all lessons
- **3 coding concepts** — Variables, Loops, Conditions (Python)
- **5 difficulty levels per concept** — unlocking sequentially (15 total lesson levels)
- **3 interactive game modes** — each genuinely different in mechanics, not just reskinned
- **Pixel art game scenes** — visual dungeon that reacts to correct/incorrect answers
- **Hero progression** — XP, gold, stats (HP, ATK, DEF) that grow as users learn
- **Admin analytics dashboard** — real-time MAB performance data for analysis

---

## Element 2: The Marketing Hypothesis

### Primary Hypothesis
> **"An interactive, game-based teaching modality (Code Simulation) will produce significantly higher lesson completion rates than passive or time-pressured alternatives (Drag & Drop, Speed Coding) among beginner programmers aged 15+."**

### Why this hypothesis
- Code Simulation mirrors how real developers debug code (step-by-step tracing), which may feel more authentic and engaging to learners
- Drag & Drop is more passive — it tests arrangement ability but may not build deep understanding
- Speed Coding introduces time pressure, which could either motivate OR stress users, potentially lowering completion rates
- The MAB algorithm will reveal which modality users actually respond to best — regardless of what we predict

### Secondary Hypothesis (Reward Type)
> **"Mystery-based rewards (Mystery Drops) will drive higher return/continuation rates than predictable rewards (Badges, XP Credits), due to the variable reward psychology similar to loot boxes in gaming."**

### Measurable metrics
| Metric | How it's measured | What it tells us |
|---|---|---|
| **Lesson completion rate** | Did the user finish all 3 steps? (yes/no per session) | Primary engagement measure — the MAB reward signal |
| **Time on task** | Seconds from lesson start to finish | Longer time could mean deeper engagement OR confusion — needs context |
| **Correctness rate** | Correct answers / total answers | Whether the modality is actually teaching effectively, not just entertaining |
| **Next-level progression** | Did the user start the next level after completing one? | Retention signal — are they hooked? |
| **MAB convergence** | Which arm accumulates the highest average reward over time | The algorithm's "verdict" on which modality wins |

---

## Element 3: The Empirical Test

### Data collection method
The app collects data automatically — no surveys required for the primary analysis. Every session is logged with:

```
{
  sessionId:    unique session identifier
  userId:       anonymous user ID (no login needed)
  conceptId:    which concept (variables/loops/conditions)
  level:        difficulty level (1-5)
  modality:     which game mode was assigned (by MAB)
  rewardType:   which reward was shown (by MAB)
  completed:    true/false
  timeSpent:    seconds
  score:        points earned (speed coding mode)
  streak:       consecutive correct answers
  timestamp:    when the session occurred
}
```

### How we get data — the classroom as test users
Per the project guidelines, classmates will act as prospective users:

1. **Deploy the app** to Vercel (free hosting) — generates a public URL
2. **Share the URL** with the class — each person plays through at least a few lessons
3. **The MAB assigns each person** a random modality and reward type (they don't know which one they got)
4. **Session data accumulates** in the admin dashboard automatically
5. **After enough sessions** (target: 50+), the MAB will have converged on a clear "winner"

### Analysis plan

**Step 1: Descriptive statistics**
- Total sessions logged
- Breakdown by modality: how many users saw each mode
- Completion rate per modality
- Average time spent per modality
- Average correctness per modality

**Step 2: MAB convergence analysis**
- Show the admin dashboard bar charts — which arm is winning and by how much
- Show how the MAB shifted traffic over time (early sessions are 33/33/33 split; later sessions favour the winner)
- Calculate the "regret" — how many users were shown suboptimal modalities during the exploration phase

**Step 3: Statistical comparison**
- Compare completion rates across modalities (Code Simulation vs Drag & Drop vs Speed Coding)
- If sample size allows, run a simple chi-square test or proportion comparison
- Same analysis for reward types (Badge vs XP vs Mystery Drop)

**Step 4: Business recommendation**
- Based on the data, recommend which modality should be the default for new users
- Discuss whether the MAB should continue running (to catch changing preferences) or be "frozen" on the winner
- Translate findings into a broader insight about gamified education product design

### Backup plan: simulated data
If real user data is insufficient (fewer than 30 sessions), the admin dashboard has a **"Simulate 50 Sessions"** button that generates realistic test data with intentional biases. This can be used to demonstrate how the MAB algorithm works and what the analysis would look like with more data. The simulation is transparent and can be shown alongside real data.

### Timeline

| Phase | When | What |
|---|---|---|
| Build & polish | Now | Finish app, add remaining game scenes, test all flows |
| Deploy | 1 week before presentation | Push to Vercel, get public URL |
| Data collection | 1 week | Share with class, collect session data |
| Analysis | 2-3 days before | Pull data from admin dashboard, run analysis |
| Presentation | Presentation day | 10-minute slide deck + live demo |

---

## How This Meets the Grading Criteria

| Criteria (5 pts each) | How we address it |
|---|---|
| **Well-defined business problem** | "Which interactive teaching modality maximises lesson completion in a gamified coding app?" — clear, specific, measurable |
| **Creativity** | Pixel art hero system, 3 genuinely different game mechanics, MAB running silently, the entire app built by AI |
| **Quality of presentation** | Live demo of the app + admin dashboard showing real data + clear slide narrative |
| **Correctness of analysis** | MAB is a well-established algorithm; completion rate is an objective metric; analysis follows standard statistical methods |
| **Insights → business recommendations** | "Data shows X modality outperforms by Y%. Recommend defaulting new users to X while continuing to test with 30% exploration rate." |
| **Engaging with others** | Participate in classmates' projects as required |
