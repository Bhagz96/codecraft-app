/**
 * WORKED EXAMPLES
 * ================
 * Each entry is keyed by "conceptId_level_stepIndex" (e.g. "variables_1_0").
 * The example uses DIFFERENT values from the actual question so the learner
 * can't just copy the answer — they need to apply the same pattern.
 *
 * Fields:
 *   note  — one sentence describing the concept being demonstrated
 *   code  — parallel example with inline # Output: annotations
 */

export const workedExamples = {

  // ─── VARIABLES ────────────────────────────────────────────────────────────

  // L1 — Create Your Hero
  variables_1_0: {
    note: "print() outputs whatever value is currently stored in the variable.",
    code: 'color = "blue"\nprint(color)\n# Output: blue',
  },
  variables_1_1: {
    note: "When a variable is assigned twice, the latest value replaces the old one.",
    code: "score = 0\nscore = 500\nprint(score)\n# Output: 500  (latest value wins)",
  },
  variables_1_2: {
    note: "Each print() captures the variable's value at THAT moment — before or after reassignment.",
    code: 'level = "Beginner"\nprint(level)    # Output: Beginner\nlevel = "Expert"\nprint(level)    # Output: Expert',
  },

  // L2 — Hero Stats & Types
  variables_2_0: {
    note: "Numbers without quotes are int. Text in quotes is str. Python tracks the difference.",
    code: 'lives = 3\nprint(type(lives))   # Output: <class \'int\'>\nname = "Sam"\nprint(type(name))    # Output: <class \'str\'>',
  },
  variables_2_1: {
    note: "x = x + n means: take the current value of x, add n, and store the result back in x.",
    code: "coins = 10\ncoins = coins + 5\nprint(coins)\n# Output: 15",
  },
  variables_2_2: {
    note: "The + operator joins (concatenates) two strings end-to-end.",
    code: 'word1 = "fire"\nword2 = "ball"\nprint(word1 + word2)\n# Output: fireball',
  },

  // L3 — Building the Game Display
  variables_3_0: {
    note: "In an f-string, {variable} is replaced with the variable's actual value.",
    code: 'city = "Paris"\nprint(f"Welcome to {city}!")\n# Output: Welcome to Paris!',
  },
  variables_3_1: {
    note: "len() counts the number of characters in a string.",
    code: 'word = "dragon"\nprint(len(word))\n# Output: 6',
  },
  variables_3_2: {
    note: ".upper() converts every character in the string to uppercase.",
    code: 'shout = "hello"\nprint(shout.upper())\n# Output: HELLO',
  },

  // L4 — Building the Inventory
  variables_4_0: {
    note: "Lists are zero-indexed — the FIRST item is always at position [0].",
    code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])   # Output: apple\nprint(fruits[1])   # Output: banana',
  },
  variables_4_1: {
    note: ".append() adds a new item to the END of the list.",
    code: 'bag = ["rope", "torch"]\nbag.append("map")\nprint(bag)\n# Output: [\'rope\', \'torch\', \'map\']',
  },
  variables_4_2: {
    note: "list[start:stop] returns items from index start up to (not including) stop.",
    code: 'letters = ["a", "b", "c", "d", "e"]\nprint(letters[1:3])\n# Output: [\'b\', \'c\']  (index 1 and 2 only)',
  },

  // L5 — The Hero Profile
  variables_5_0: {
    note: "Dictionaries use named keys (not numbers) to look up values.",
    code: 'player = {"name": "Alex", "score": 200}\nprint(player["score"])\n# Output: 200',
  },
  variables_5_1: {
    note: "Assign to a key to update its value — the rest of the dictionary stays the same.",
    code: 'item = {"type": "sword", "power": 10}\nitem["power"] = 50\nprint(item)\n# Output: {\'type\': \'sword\', \'power\': 50}',
  },
  variables_5_2: {
    note: "int() converts a text string into an actual number so you can do arithmetic.",
    code: 'user_input = "7"\nnum = int(user_input)\nprint(num + 3)\n# Output: 10',
  },

  // ─── LOOPS ────────────────────────────────────────────────────────────────

  // L1 — Climbing the Mountain
  loops_1_0: {
    intro: [
      "What is a for loop?",
      "Imagine your hero needs to take 5 steps up the mountain trail. Without a loop, you'd have to write the same \"take a step\" instruction 5 times — once for each step. That gets messy fast.",
      "",
      "A for loop lets you say: \"repeat this block of code a set number of times\" — in one clean instruction.",
      "",
      "The structure looks like this:",
      "• for variable in sequence:  ← the loop header (ends with a colon)",
      "• ····code to repeat          ← indented — this runs once per item",
      "",
      "Each time the loop runs is called an iteration. The variable (like i) automatically takes the next value from the sequence on each iteration.",
    ],
    note: "range(n) produces 0, 1, 2, ..., n-1. It always starts at 0 and stops BEFORE n.",
    code: "for i in range(4):\n    print(i)\n# Output: 0\n#         1\n#         2\n#         3",
  },
  loops_1_1: {
    note: "range(start, stop) begins at start and stops before stop. Use it to avoid starting at 0.",
    code: "for n in range(1, 4):\n    print(n * 3)\n# Output: 3\n#         6\n#         9",
  },
  loops_1_2: {
    note: "Accumulator pattern: start a variable at 0 and add to it each loop to build a running total.",
    code: "total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)\n# Output: 6  (1+2+3)",
  },

  // L2 — Trail Item Collection
  loops_2_0: {
    note: "for x in list: visits every item in the list in order, one per iteration.",
    code: 'colors = ["red", "green", "blue"]\nfor c in colors:\n    print(c)\n# Output: red\n#         green\n#         blue',
  },
  loops_2_1: {
    note: "enumerate() gives both the index AND the item at each step of the loop.",
    code: 'words = ["cat", "dog", "fish"]\nfor i, w in enumerate(words):\n    print(i, w)\n# Output: 0 cat\n#         1 dog\n#         2 fish',
  },
  loops_2_2: {
    note: "[expression for x in list] creates a new list by applying the expression to every item.",
    code: "nums = [2, 4, 6]\ntripled = [n * 3 for n in nums]\nprint(tripled)\n# Output: [6, 12, 18]",
  },

  // L3 — Fighting Enemy Waves
  loops_3_0: {
    note: "Nested loops multiply: outer × inner = total iterations.",
    code: "for row in range(3):\n    for col in range(2):\n        print(row, col)\n# Output: 6 pairs printed  (3×2=6)",
  },
  loops_3_1: {
    note: "Multiplying a string by a number repeats it that many times.",
    code: 'for i in range(1, 4):\n    print("*" * i)\n# Output: *\n#         **\n#         ***',
  },
  loops_3_2: {
    note: "Each cell's value = row + col. Nested loops fill every cell in the grid.",
    code: "# row 0: 0+0=0, 0+1=1  →  [0, 1]\n# row 1: 1+0=1, 1+1=2  →  [1, 2]\n# row 2: 2+0=2, 2+1=3  →  [2, 3]\n# Final map: [[0,1], [1,2], [2,3]]",
  },

  // L4 — Training Until Ready
  loops_4_0: {
    note: "A while loop keeps running as long as the condition is True — it re-checks before every iteration.",
    code: "hp = 12\nwhile hp > 0:\n    print(hp)\n    hp = hp - 4\n# Output: 12\n#         8\n#         4",
  },
  loops_4_1: {
    note: "break exits the loop immediately — items after the break point are never visited.",
    code: 'for item in ["rock", "tree", "gem", "dirt"]:\n    if item == "gem":\n        print("Found it!")\n        break\n    print("Checked:", item)\n# Output: Checked: rock\n#         Checked: tree\n#         Found it!',
  },
  loops_4_2: {
    note: "continue skips the rest of the current iteration and jumps straight to the next one.",
    code: "for i in range(5):\n    if i == 3:\n        continue\n    print(i)\n# Output: 0\n#         1\n#         2\n#         4  (3 is skipped)",
  },

  // L5 — Advanced Battle System
  loops_5_0: {
    note: "[x for x in list if condition] keeps only items that pass the filter.",
    code: "scores = [5, 20, 35, 8, 42]\npassing = [s for s in scores if s >= 20]\nprint(passing)\n# Output: [20, 35, 42]",
  },
  loops_5_1: {
    note: "sum() adds up all values in a list in one call — no manual loop needed.",
    code: "prices = [10, 25, 5]\nprint(sum(prices))\n# Output: 40",
  },
  loops_5_2: {
    note: "Combine filter and transform in one comprehension: [transform for x in list if condition].",
    code: "nums = [3, 12, 5, 18]\nresult = [n * 2 for n in nums if n >= 10]\nprint(result)\n# Output: [24, 36]  (only 12 and 18 pass, each doubled)",
  },

  // ─── CONDITIONS ───────────────────────────────────────────────────────────

  // L1 — Weather Check
  conditions_1_0: {
    intro: [
      "What is an if condition?",
      "Your hero is climbing a mountain. The weather changes fast — sometimes it's too hot to keep going, sometimes it's fine. Your code needs to make a decision based on what's happening right now.",
      "",
      "An if condition lets your program ask a yes/no question and do different things depending on the answer.",
      "",
      "The structure looks like this:",
      "• if condition:      ← ask the question (ends with a colon)",
      "• ····code if True   ← runs only when the answer is yes",
      "• else:              ← optional — what to do when the answer is no",
      "• ····code if False  ← runs only when the answer is no",
      "",
      "The condition is always either True or False — never both. Exactly ONE branch runs, never both at the same time.",
      "",
      "Common comparisons you can use in conditions:",
      "• >  greater than       e.g. temp > 30",
      "• <  less than          e.g. hp < 10",
      "• == equals             e.g. name == \"Hero\"",
      "• != not equal          e.g. coins != 0",
      "• >= greater or equal   e.g. level >= 5",
    ],
    note: "The condition is True or False — only ONE branch (if or else) ever runs.",
    code: 'speed = 80\nif speed > 60:\n    print("Speeding!")\nelse:\n    print("Safe speed.")\n# Output: Speeding!  (80 > 60 is True)',
  },
  conditions_1_1: {
    note: ">= means 'greater than OR equal to'. If the condition is False, the else branch runs.",
    code: 'coins = 8\nif coins >= 10:\n    print("Can buy!")\nelse:\n    print("Not enough.")\n# Output: Not enough.  (8 >= 10 is False)',
  },
  conditions_1_2: {
    note: "Use a condition to compare two values and store which one wins in a variable.",
    code: 'route_a = 5\nroute_b = 9\nif route_a < route_b:\n    best = "A"\nelse:\n    best = "B"\nprint(best)\n# Output: A  (5 < 9 is True)',
  },

  // L2 — Handling Obstacles
  conditions_2_0: {
    note: "== checks equality and returns True or False. An integer and a string are never equal.",
    code: 'code = 7\nprint(code == 7)     # Output: True\nprint(code == "7")   # Output: False  (int ≠ string)',
  },
  conditions_2_1: {
    note: "!= means 'not equal to' — it returns True when the two values are different.",
    code: 'weather = "sunny"\nprint(weather != "rainy")   # Output: True\nprint(weather != "sunny")   # Output: False',
  },
  conditions_2_2: {
    note: "'and' requires BOTH conditions to be True. If either is False, the result is False.",
    code: "has_ticket = True\nis_tall_enough = False\nprint(has_ticket and is_tall_enough)\n# Output: False  (one side is False)\nprint(True and True)\n# Output: True",
  },

  // L3 — Logic Gates
  conditions_3_0: {
    note: "'and' returns True ONLY when both sides are True — one False poisons the whole expression.",
    code: "print(True and True)    # Output: True\nprint(True and False)   # Output: False\nprint(False and False)  # Output: False",
  },
  conditions_3_1: {
    note: "'or' returns True when AT LEAST ONE side is True. Only False or False gives False.",
    code: "print(True or False)    # Output: True\nprint(False or True)    # Output: True\nprint(False or False)   # Output: False",
  },
  conditions_3_2: {
    note: "'not' flips a boolean — True becomes False, False becomes True.",
    code: "door_locked = False\nprint(not door_locked)   # Output: True  (not locked = can enter)\nprint(not True)          # Output: False",
  },

  // L4 — Multiple Paths (elif)
  conditions_4_0: {
    note: "Python checks each elif top to bottom and stops at the FIRST True condition.",
    code: 'score = 72\nif score >= 90:\n    grade = "A"\nelif score >= 70:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)\n# Output: B  (72>=90? No. 72>=70? Yes → stops here)',
  },
  conditions_4_1: {
    note: "Nested conditions check step by step — the outer check must pass before the inner runs.",
    code: 'age = 20\nhas_id = False\nif age >= 18:\n    if has_id:\n        print("Welcome!")\n    else:\n        print("Need ID.")\n# Output: Need ID.  (age passes, has_id fails)',
  },
  conditions_4_2: {
    note: "'and' combines two checks in one clean line — cleaner than nesting.",
    code: 'age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Welcome!")\n# Output: Welcome!  (both are True)',
  },

  // L5 — The Summit Gate
  conditions_5_0: {
    note: "'in' checks if a value exists in a list. Returns True if found, False if not.",
    code: 'tools = ["hammer", "saw", "drill"]\nprint("saw" in tools)     # Output: True\nprint("wrench" in tools)  # Output: False',
  },
  conditions_5_1: {
    note: "Ternary expression: picks value_if_true when condition is True, otherwise value_if_false.",
    code: 'hp = 30\nstatus = "alive" if hp > 0 else "defeated"\nprint(status)\n# Output: alive  (30 > 0 is True)',
  },
  conditions_5_2: {
    note: "try/except catches errors gracefully — the except block runs instead of crashing.",
    code: 'try:\n    result = int("hello")   # fails!\nexcept ValueError:\n    print("Can\'t convert!")\n# Output: Can\'t convert!',
  },
};
