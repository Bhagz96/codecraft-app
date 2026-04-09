/**
 * CHAPTER REVIEW QUESTIONS
 * =========================
 * Dedicated questions for each concept's end-of-chapter review.
 * These are NEVER shown during mini-levels — they are assessment-only.
 *
 * Rules:
 *  - Same 5 questions for EVERY user regardless of instruction mode
 *  - Mix of difficulty: Q1–Q2 basic, Q3 medium, Q4–Q5 harder
 *  - Code-trace format: show code, answer a traceQuestion
 *  - No hints, no scaffolding, no explanations during the review
 *
 * Field reference (matches ChapterReviewPage expectations):
 *   levelNum      — question number shown in the header (1–5)
 *   levelTitle    — short label shown under the progress bar
 *   traceQuestion — the question asked of the learner
 *   codeSnippet   — Python code displayed in the editor block
 *   options       — array of answer strings
 *   correctIndex  — index of the correct option in options[]
 */

export const reviewQuestions = {

  // ─── VARIABLES ─────────────────────────────────────────────────────────────

  variables: [
    {
      levelNum: 1,
      levelTitle: "Multiple Reassignments",
      traceQuestion: "What does print() output after all three assignments?",
      codeSnippet:
`x = 5
x = x + 3
x = x * 2
print(x)`,
      options: ["16", "10", "8"],
      correctIndex: 0,   // 5+3=8, 8*2=16
    },
    {
      levelNum: 2,
      levelTitle: "F-String with Two Variables",
      traceQuestion: "What gets printed?",
      codeSnippet:
`name = "Hero"
level = 3
print(f"{name} is level {level}!")`,
      options: ["Hero is level 3!", "{name} is level {level}!", "Error"],
      correctIndex: 0,
    },
    {
      levelNum: 3,
      levelTitle: "List Size After Appending",
      traceQuestion: "How many items are in the gear list when print() runs?",
      codeSnippet:
`gear = ["sword", "shield"]
gear.append("potion")
gear.append("map")
print(len(gear))`,
      options: ["4", "2", "3"],
      correctIndex: 0,   // starts with 2, append twice → 4
    },
    {
      levelNum: 4,
      levelTitle: "Dictionary Value Update",
      traceQuestion: "What does print() output?",
      codeSnippet:
`hero = {"hp": 100, "attack": 15}
hero["hp"] = hero["hp"] - 35
print(hero["hp"])`,
      options: ["65", "100", "35"],
      correctIndex: 0,   // 100 - 35 = 65
    },
    {
      levelNum: 5,
      levelTitle: "Type Conversion in an F-String",
      traceQuestion: "What is the final printed output?",
      codeSnippet:
`raw = "42"
value = int(raw) + 8
result = f"Score: {value}"
print(result)`,
      options: ["Score: 50", "Score: 428", "Error"],
      correctIndex: 0,   // int("42")=42, 42+8=50
    },
  ],

  // ─── LOOPS ─────────────────────────────────────────────────────────────────

  loops: [
    {
      levelNum: 1,
      levelTitle: "Accumulator Loop",
      traceQuestion: "What does print() output after the loop?",
      codeSnippet:
`total = 0
for i in range(1, 5):
    total = total + i
print(total)`,
      options: ["10", "4", "15"],
      correctIndex: 0,   // 1+2+3+4 = 10
    },
    {
      levelNum: 2,
      levelTitle: "List Comprehension Filter",
      traceQuestion: "How many values end up in the passing list?",
      codeSnippet:
`scores = [45, 72, 58, 90, 33]
passing = [s for s in scores if s >= 60]
print(len(passing))`,
      options: ["2", "3", "5"],
      correctIndex: 0,   // 72 and 90 pass ≥60 → 2 items
    },
    {
      levelNum: 3,
      levelTitle: "While Loop — Doubling",
      traceQuestion: "What is n when the loop finishes?",
      codeSnippet:
`n = 1
while n < 20:
    n = n * 2
print(n)`,
      options: ["32", "16", "20"],
      correctIndex: 0,   // 1→2→4→8→16→32; 32 fails < 20, loop stops
    },
    {
      levelNum: 4,
      levelTitle: "Nested Loops — Counting Iterations",
      traceQuestion: "What does print() output?",
      codeSnippet:
`count = 0
for i in range(3):
    for j in range(2):
        count += 1
print(count)`,
      options: ["6", "5", "3"],
      correctIndex: 0,   // 3 outer × 2 inner = 6
    },
    {
      levelNum: 5,
      levelTitle: "Comprehension — Filter and Transform",
      traceQuestion: "What is the value of result?",
      codeSnippet:
`nums = [1, 2, 3, 4, 5]
result = [n ** 2 for n in nums if n % 2 == 0]
print(result)`,
      options: ["[4, 16]", "[1, 4, 9, 16, 25]", "[2, 4]"],
      correctIndex: 0,   // even: 2,4 → squared: 4,16
    },
  ],

  // ─── CONDITIONS ────────────────────────────────────────────────────────────

  conditions: [
    {
      levelNum: 1,
      levelTitle: "Basic If / Else",
      traceQuestion: "What gets printed?",
      codeSnippet:
`speed = 85
if speed > 100:
    status = "too fast"
else:
    status = "safe"
print(status)`,
      options: ["safe", "too fast", "85"],
      correctIndex: 0,   // 85 > 100 is False → else runs
    },
    {
      levelNum: 2,
      levelTitle: "Boolean 'and' Operator",
      traceQuestion: "What does print() output?",
      codeSnippet:
`has_key = True
hp = 30
can_enter = has_key and hp >= 50
print(can_enter)`,
      options: ["False", "True", "30"],
      correctIndex: 0,   // True and (30 >= 50 = False) → False
    },
    {
      levelNum: 3,
      levelTitle: "elif Chain",
      traceQuestion: "Which grade gets printed?",
      codeSnippet:
`score = 68
if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"
print(grade)`,
      options: ["C", "B", "F"],
      correctIndex: 0,   // 68 >= 60 but not >= 75 → "C"
    },
    {
      levelNum: 4,
      levelTitle: "'in' with 'not'",
      traceQuestion: "What gets printed?",
      codeSnippet:
`items = ["potion", "map", "rope"]
if "sword" not in items:
    print("No weapon equipped!")
else:
    print("Ready to fight!")`,
      options: ["No weapon equipped!", "Ready to fight!", "Error"],
      correctIndex: 0,   // "sword" not in items → True → if block runs
    },
    {
      levelNum: 5,
      levelTitle: "Combined Logic with State Change",
      traceQuestion: "What are the two lines printed, in order?",
      codeSnippet:
`level = 6
keys = 1
if level >= 5 and keys > 0:
    keys -= 1
    result = "Door unlocked!"
elif level >= 5:
    result = "Need a key!"
else:
    result = "Too low level!"
print(keys)
print(result)`,
      options: ["0 then Door unlocked!", "1 then Door unlocked!", "0 then Need a key!"],
      correctIndex: 0,   // both conditions True → keys=0, result="Door unlocked!"
    },
  ],

};
