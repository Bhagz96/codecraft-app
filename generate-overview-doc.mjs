import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, UnderlineType
} from "docx";
import { writeFileSync } from "fs";

const BRAND_CYAN = "00B4D8";
const HEADING_COLOR = "0A2540";
const ACCENT_DARK = "023E58";
const LIGHT_BG = "EAF6FB";
const WHITE = "FFFFFF";
const BORDER_COLOR = "AADCE8";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 36,
        color: ACCENT_DARK,
        font: "Calibri",
      }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_CYAN } },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        color: ACCENT_DARK,
        font: "Calibri",
      }),
    ],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: BRAND_CYAN,
        font: "Calibri",
      }),
    ],
  });
}

function para(runs, spacing = {}) {
  const children = Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, font: "Calibri", color: "222222" })];
  return new Paragraph({ children, spacing: { before: 60, after: 80, ...spacing } });
}

function bullet(text, level = 0) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  const children = parts.map(p => {
    if (p.startsWith("`") && p.endsWith("`")) {
      return new TextRun({ text: p.slice(1, -1), font: "Courier New", size: 20, color: "C7254E", shading: { type: ShadingType.CLEAR, fill: "F7F7F7" } });
    }
    if (p.startsWith("**") && p.endsWith("**")) {
      return new TextRun({ text: p.slice(2, -2), bold: true, size: 22, font: "Calibri", color: "222222" });
    }
    return new TextRun({ text: p, size: 22, font: "Calibri", color: "222222" });
  });
  return new Paragraph({
    bullet: { level },
    spacing: { before: 40, after: 40 },
    children,
  });
}

function infoBox(lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { top: 80, bottom: 80, left: 160, right: 160 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: LIGHT_BG },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: BRAND_CYAN },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND_CYAN },
              left: { style: BorderStyle.SINGLE, size: 20, color: BRAND_CYAN },
              right: { style: BorderStyle.NONE },
            },
            children: lines.map(l => new Paragraph({
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: l, size: 20, font: "Calibri", color: ACCENT_DARK, italics: typeof l === "string" && l.startsWith("Also") })],
            })),
          }),
        ],
      }),
    ],
    spacing: { before: 120, after: 160 },
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
        shading: { type: ShadingType.CLEAR, fill: ACCENT_DARK },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_CYAN }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: "Calibri" })] })],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) => {
        const parts = cell.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        const runs = parts.map(p => {
          if (p.startsWith("`") && p.endsWith("`")) return new TextRun({ text: p.slice(1, -1), font: "Courier New", size: 18, color: "C7254E" });
          if (p.startsWith("**") && p.endsWith("**")) return new TextRun({ text: p.slice(2, -2), bold: true, size: 20, font: "Calibri", color: "222222" });
          return new TextRun({ text: p, size: 20, font: "Calibri", color: "333333" });
        });
        return new TableCell({
          width: colWidths ? { size: colWidths[ci], type: WidthType.PERCENTAGE } : undefined,
          shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? WHITE : "F4FBFD" },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: runs })],
        });
      }),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    spacing: { before: 120, after: 200 },
  });
}

function codeBlock(lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: "1E1E2E" },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 20, color: BRAND_CYAN }, right: { style: BorderStyle.NONE } },
            children: lines.map(l =>
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "A6E22E" })],
              })
            ),
          }),
        ],
      }),
    ],
    spacing: { before: 80, after: 160 },
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR } },
    children: [],
  });
}

// ── Build document ────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: "222222" },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children: [

        // ── Title ──────────────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: "KidCode Quest", bold: true, size: 56, color: ACCENT_DARK, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({ text: "Project Context & Overview", size: 32, color: BRAND_CYAN, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 400 },
          children: [
            new TextRun({ text: "CodeCraft: Mountain Quest Edition  ·  Last updated: 1 April 2026", size: 20, color: "888888", font: "Calibri", italics: true }),
          ],
        }),

        infoBox([
          "Also known as:  CodeCraft: Mountain Quest Edition",
          "Deployed at:    Vercel (SPA)",
          "Repository:     /Users/bhagyawelikala/Documents/Kidcode-Quest",
          "Last updated:   2026-04-01",
        ]),

        divider(),

        // ── What Is This Project ───────────────────────────────────────────────
        h2("What Is This Project?"),
        para([
          new TextRun({ text: "KidCode Quest is an ", size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: "interactive educational game", bold: true, size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: " that teaches Python programming to teens and young adults through a mountain-climbing narrative. The player creates a named hero and progresses through structured lessons on three Python concepts — Variables, Loops, and Conditions — by writing real game code at each step.", size: 22, font: "Calibri", color: "222222" }),
        ]),
        para([
          new TextRun({ text: "The core academic purpose is to demonstrate a ", size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: "Multi-Armed Bandit (MAB) algorithm", bold: true, size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: " for adaptively selecting instructional support strategies, making this a practical application of marketing/analytics decision science in an educational context.", size: 22, font: "Calibri", color: "222222" }),
        ]),

        divider(),

        // ── Goals ─────────────────────────────────────────────────────────────
        h2("Goals"),
        makeTable(
          ["Goal", "Description"],
          [
            ["**Educational**", "Teach Python (Variables, Loops, Conditions) through hands-on game-building"],
            ["**Academic / Research**", "Demonstrate epsilon-greedy MAB as an A/B testing alternative for selecting teaching strategies"],
            ["**MVP Scope**", "3 concepts × 5 levels × 3 steps each = 45 lesson steps total"],
            ["**No login required**", "All state stored in `localStorage`; Supabase is optional for analytics only"],
          ],
          [25, 75]
        ),

        divider(),

        // ── Tech Stack ────────────────────────────────────────────────────────
        h2("Tech Stack"),
        makeTable(
          ["Layer", "Technology"],
          [
            ["Framework", "React 19 + Vite 8"],
            ["Styling", "Tailwind CSS v4"],
            ["Routing", "React Router v7"],
            ["State", "`localStorage` only (no backend required)"],
            ["Analytics (optional)", "Supabase (degrades gracefully if not configured)"],
            ["Testing", "Vitest + React Testing Library"],
            ["Deployment", "Vercel (SPA rewrites via `vercel.json`)"],
          ],
          [30, 70]
        ),

        divider(),

        // ── Architecture ──────────────────────────────────────────────────────
        h2("Architecture"),

        h3("Routes"),
        makeTable(
          ["Route", "Component", "Purpose"],
          [
            ["`/`", "`HomePage`", "Hero creation + concept picker"],
            ["`/lesson/:conceptId/:level`", "`LessonPage`", "Main lesson player"],
            ["`/reward`", "`RewardPage`", "Post-lesson celebration"],
            ["`/admin`", "`AdminDashboard`", "MAB analytics / debugging"],
          ],
          [30, 25, 45]
        ),

        h3("MAB Engine (src/mab/engine.js)"),
        para([
          new TextRun({ text: "Epsilon-greedy algorithm (ε=0.2) with a warm-up phase that tries every arm at least once before exploitation begins. The primary MAB selects one of five ", size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: "instructional support strategies", bold: true, size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: " per session:", size: 22, font: "Calibri", color: "222222" }),
        ]),
        bullet("`worked_example_first` — show a solved example before the question"),
        bullet("`hint_first` — give a contextual hint upfront"),
        bullet("`try_first_then_hint` — attempt unaided; hint unlocks after first wrong answer"),
        bullet("`step_by_step_scaffold` — break into guided sub-steps"),
        bullet("`explain_after_error` — explain the concept after a wrong answer, then retry"),
        para("Reward scoring is learning-focused: first-try correct with no hints = 1.0; decreases with hint use and extra attempts. Secondary MABs (kept for backward compatibility) select teaching modality and reward type."),

        h3("Lesson Components (src/components/)"),
        para("Three interchangeable teaching modalities receive the same step data:"),
        bullet("`CodeSimulation` — read and trace Python execution"),
        bullet("`DragDropBuilder` — arrange code blocks in correct order"),
        bullet("`SpeedCoding` — fill-in-the-blank challenges"),
        para("Supporting modes: StoryMode, ChallengeMode, PuzzleMode, ConceptIntro."),

        h3("Game Scenes (src/components/game/GameScene.jsx)"),
        para("SVG-rendered scenes tied to lesson steps via sceneId. Five scene types:"),
        makeTable(
          ["Scene ID", "Setting"],
          [
            ["`hero-spawn`", "Hero creation / starting point"],
            ["`base-camp`", "Camp setup scenes"],
            ["`mountain-trail`", "Path and obstacle scenes"],
            ["`mountain-battle`", "Enemy encounter scenes"],
            ["`the-gate`", "Condition / decision scenes"],
          ],
          [30, 70]
        ),

        h3("Data Layer (src/data/)"),
        bullet("`lessons.js` — all 45 lesson steps (1367 lines)"),
        bullet("`lessonTemplates.js` — injects hero name into narrative text"),
        bullet("`workedExamples.js` — worked example content for MAB strategy"),
        bullet("`hero.js` — hero creation, XP, level management"),
        bullet("`progress.js` — completion tracking"),

        divider(),

        // ── Lesson Content ────────────────────────────────────────────────────
        h2("Lesson Content"),
        para([
          new TextRun({ text: "3 concepts × 5 levels × 3 steps = ", size: 22, font: "Calibri", color: "222222" }),
          new TextRun({ text: "45 lesson steps", bold: true, size: 22, font: "Calibri", color: "222222" }),
        ]),
        makeTable(
          ["Concept", "Narrative Frame", "Key Python Topics"],
          [
            ["Variables", "\"Setting Up the Game\"", "assignment, strings, integers, f-strings, dicts"],
            ["Loops", "\"Training Montage\"", "`for` loops, `range()`, nested loops"],
            ["Conditions", "\"The Mountain Gate\"", "`if/elif/else`, boolean logic, comparisons"],
          ],
          [20, 30, 50]
        ),

        divider(),

        // ── Major Development Milestones ──────────────────────────────────────
        h2("Major Development Milestones"),

        h3("Version 1 — Kids Edition  (2026-03-23)"),
        para("Initial release targeting younger children. Basic lesson structure with JavaScript content."),

        h3("Version 2 — Teen/Young Adult Redesign  (2026-03-24)"),
        bullet("Full visual and tone redesign for older audience"),
        bullet("Switched all lesson content from **JavaScript to Python**"),
        bullet("Added pixel art hero system and 4 game scenes"),
        bullet('Renamed project to "CodeCraft: Mountain Quest Edition"'),

        h3("Vercel Deployment Setup  (2026-03-29)"),
        bullet("Added `vercel.json` for correct Vite SPA build configuration"),
        bullet("Story-driven landing page with mountain scene and narrative intro"),
        bullet("Fixed game scene layout (duplicate explanation box, sizing)"),

        h3("MAB Upgrade — Instructional Support Strategies  (2026-03-31)"),
        bullet("Replaced modality/reward MABs as primary layer with **instructional support strategies** as the main MAB arm"),
        bullet("Upgraded from engagement-based to **learning-focused reward scoring**"),
        bullet("Added warm-up phase so all arms are tested before exploitation begins"),
        bullet("Added worked examples system (`workedExamples.js`) and parallel concept notes"),
        bullet("Hides question until learner dismisses the worked example"),
        bullet("Fixed all 45 lesson steps' support strategy content quality"),

        h3("Game Scene Visual Overhaul  (2026-03-31)"),
        bullet("Added context-aware if/else gameplay scenes and dynamic condition panels"),
        bullet("Replaced energy boulder with RPG energy gate mechanic"),
        bullet("Redesigned fork-path scene (iterated: RPG top-down → Cave Dungeon → Mountain Cave Openings)"),
        bullet("Redesigned weather-check scene to match narrative hero behaviour"),
        bullet("Rock obstacle: jagged polygon boulder, fracture lines, moss, animated crack-split on success", 1),
        bullet("Bridge obstacle: full river gorge, animated river, rope bridge, wooden planks, physics fail/success animations", 1),

        h3("Tests + CLAUDE.md Added  (2026-03-31)"),
        bullet("Added Vitest test suite: MAB engine, session tracker, hero data, progress, lesson templates, lesson structure, all 3 modality components"),
        bullet("Added `CLAUDE.md` with architecture documentation and TDD workflow"),

        h3("Content Correctness Fixes  (2026-03-31 → 2026-04-01)"),
        bullet("Fixed 6 Python code bugs in `lessons.js` (double-brace f-string errors, variable name mismatches)"),
        bullet("Clarified Loops L3 S1 speed-coding instruction (inner `range()` count was ambiguous)"),

        divider(),

        // ── File Structure ────────────────────────────────────────────────────
        h2("File Structure (Key Paths)"),
        codeBlock([
          "src/",
          "├── App.jsx                    # Router + route definitions",
          "├── mab/",
          "│   ├── engine.js              # MAB algorithm (epsilon-greedy)",
          "│   ├── sessionTracker.js      # Per-question metrics + Supabase logging",
          "│   └── supabase.js            # Optional Supabase client",
          "├── data/",
          "│   ├── lessons.js             # All 45 lesson steps",
          "│   ├── lessonTemplates.js     # Hero name injection",
          "│   ├── workedExamples.js      # Worked example content",
          "│   ├── hero.js                # Hero XP + level management",
          "│   └── progress.js            # localStorage completion tracking",
          "├── components/",
          "│   ├── CodeSimulation.jsx",
          "│   ├── DragDropBuilder.jsx",
          "│   ├── SpeedCoding.jsx",
          "│   └── game/",
          "│       ├── GameScene.jsx      # SVG scene renderer (all 5 types)",
          "│       ├── GameHero.jsx",
          "│       └── PixelHero.jsx",
          "├── pages/",
          "│   ├── HomePage.jsx",
          "│   ├── LessonPage.jsx",
          "│   ├── RewardPage.jsx",
          "│   └── AdminDashboard.jsx",
          "└── __tests__/                 # Vitest tests mirroring src/",
        ]),

        divider(),

        // ── Design System ─────────────────────────────────────────────────────
        h2("Design System"),
        bullet("**Theme:** Dark base #0d1117 with neon accents (cyan, green, purple, orange) and glow effects"),
        bullet("**Fonts:** JetBrains Mono, Fira Code, Cascadia Code"),
        bullet("**Layout:** Desktop — game scene (left) + lesson content (right) side-by-side; Mobile — stacked vertically"),
        bullet("**Scenes:** Fully SVG-rendered, no image assets"),

        divider(),

        // ── Env Vars ──────────────────────────────────────────────────────────
        h2("Environment Variables (Optional)"),
        codeBlock([
          "VITE_SUPABASE_URL",
          "VITE_SUPABASE_ANON_KEY",
        ]),
        para("The app works fully without these. Supabase is used only for optional session analytics logging."),

        divider(),

        // ── Dev Workflow ──────────────────────────────────────────────────────
        h2("Development Workflow"),
        bullet("**TDD:** Write failing test first → run to confirm failure → implement minimum code → refactor"),
        bullet("**Test runner:** `npm run test` (Vitest),  `npm run test:ui` for visual UI"),
        bullet("**Dev server:** `npm run dev` at localhost:5173"),
        bullet("**Deploy:** Push to `main` → Vercel auto-deploys"),

      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("KidCode_Quest_Project_Overview.docx", buffer);
console.log("Created: KidCode_Quest_Project_Overview.docx");
