/**
 * SCAFFOLD GUIDES
 * ================
 * Each entry is keyed by "conceptId_level_stepIndex" (e.g. "variables_1_0").
 * Each entry is an array of 3 strings — one per scaffold phase.
 *
 * Phase 0 — Explain the core Python concept needed to answer this question.
 * Phase 1 — Show how to apply that concept to THIS specific question/code.
 * Phase 2 — Direct nudge: locate the answer in the code and match it to a choice.
 *
 * Design rule: each phase teaches, never questions. No "What is X?" — only "X works like this."
 */

export const scaffoldGuides = {

  // ─── VARIABLES ─────────────────────────────────────────────────────────────

  // L1 S0 — set hero name, read print()
  variables_1_0: [
    "Variables are named containers that store data. When you write hero_name = \"Alex\", you create a container called hero_name holding the text Alex. The variable name goes on the left of =, and the value goes on the right.",
    "Look at the code: the first line assigns a text value to hero_name. The second line calls print(hero_name), which means Python looks up what is stored in hero_name and displays it.",
    "hero_name was assigned on line 1. print(hero_name) on line 2 displays exactly that stored value — nothing more, nothing less. Find that value in the answer choices.",
  ],

  // L1 S1 — reassignment overwrites, hero_hp = 100
  variables_1_1: [
    "A variable can be assigned more than once. When that happens, the new value completely replaces the old one — Python only keeps the most recent assignment. Earlier values are gone.",
    "Trace the code line by line: hero_hp = 0 sets it to 0. Then hero_hp = 100 replaces 0 with 100. print(hero_hp) runs last and displays whatever is currently stored in hero_hp.",
    "The final value of hero_hp is 100 because the second assignment overwrote the first. print(hero_hp) displays 100. Locate that value in the answer choices.",
  ],

  // L1 S2 — two prints, variable changes between them
  variables_1_2: [
    "Each print() displays whatever the variable holds at that exact moment in the code. If the variable changes between two print() calls, each call sees a different value — Python runs line by line, top to bottom.",
    "Follow the code: title gets one value, print(title) runs → first output. Then title gets reassigned to a new value, print(title) runs again → second output. Two assignments produce two different outputs.",
    "The first print() captures the shorter title; the second print() captures the longer title after reassignment. The answer shows both outputs in order — first one, then the other.",
  ],

  // L2 S0 — type(hero_hp) returns int
  variables_2_0: [
    "Python automatically gives every value a type. A plain number like 100 (no quotes) is an integer — type int. A number in quotes like \"100\" is text — type str. The type() function reveals which type a value is.",
    "The blank in the code is the value assigned to hero_hp. You need the option that makes type(hero_hp) return <class 'int'>. Compare the three choices: one is a plain number, one is in quotes, one is True/False.",
    "An integer is a plain number with no quotes. 100 without quotes is an int — that's the correct choice. \"100\" in quotes would make it a str, and True would make it a bool.",
  ],

  // L2 S1 — hero_xp = hero_xp + 30
  variables_2_1: [
    "Variables can store the result of a calculation. hero_xp = hero_xp + 30 means: take the current value of hero_xp, add 30, and store the result back into hero_xp. This is how games update scores and stats.",
    "The blank in the code template is the amount being added. The instruction says the hero earned 30 XP from this battle — that number is the amount that goes in the blank.",
    "The blank is 30. hero_xp starts at 50. After the calculation: 50 + 30 = 80. So print(hero_xp) outputs 80. Look for 80 in the answer choices.",
  ],

  // L2 S2 — string concatenation with +
  variables_2_2: [
    "The + operator joins two strings together — this is called concatenation. \"Hello\" + \" World\" produces \"Hello World\". The strings are combined in order, left to right, with no separator added automatically.",
    "The blank in the template is the operator between name and title. You want to join them into one string. The three choices are +, -, and *. Only one of these joins strings.",
    "The operator is +. name + title combines \"{heroName}\" and \" the Brave\" into \"{heroName} the Brave\". Notice \" the Brave\" starts with a space — that space appears in the final result.",
  ],

  // L3 S0 — f-string, {hero} inside curly braces
  variables_3_0: [
    "An f-string embeds variable values directly inside text. Put f before the opening quote, then place the variable name inside curly braces {}. Python replaces {variable} with that variable's actual value when the string is created.",
    "The blank in the f-string template is the variable name that goes inside the curly braces. A variable called hero was defined on line 1 holding the hero's name. That variable is what should appear inside {…}.",
    "The variable name is hero — without quotes. Writing {hero} inside the f-string inserts the hero's name automatically. The blank is hero.",
  ],

  // L3 S1 — len() counts characters
  variables_3_1: [
    "len() is a Python built-in function that counts the number of characters in a string. len(\"cat\") returns 3 because there are 3 characters. It works on any string, including one stored in a variable.",
    "The blank in the template is the function name: name_length = ___(hero). You need the function that counts how many characters are in the hero's name. Compare the three options to find the correct built-in.",
    "The correct function is len. len(hero) counts the characters in the hero's name and stores the result in name_length. size is not a Python function and count works differently.",
  ],

  // L3 S2 — .upper() converts to ALL CAPS
  variables_3_2: [
    "String methods are actions you call on a string using dot notation: string.method(). .upper() converts every letter in the string to uppercase — \"charge\" becomes \"CHARGE\". The original variable is unchanged.",
    "The blank in the template is the method name: print(cry.___()). You need the method that converts text to ALL CAPS. Compare the three options: one converts to all uppercase, one doesn't exist in Python, one only capitalises the first letter.",
    "The method is upper. cry.upper() converts \"charge\" to \"CHARGE\". capitalize() would give \"Charge\" (first letter only), which is different. The answer is \"CHARGE\".",
  ],

  // L4 S0 — list index [0] for first item
  variables_4_0: [
    "Lists store multiple values in order. Each position has an index number starting from 0 — the first item is at index 0, the second at index 1, and so on. Use square brackets to access a position: list[index].",
    "The blank in the template is the index number for the FIRST item in the inventory. The list is [\"sword\", \"shield\", \"potion\"]. Index 0 → \"sword\", index 1 → \"shield\", index 2 → \"potion\".",
    "The first item is always at index 0 — lists count from 0, not 1. inventory[0] gives \"sword\". The blank is 0.",
  ],

  // L4 S1 — .append() adds to end of list
  variables_4_1: [
    ".append() is a list method that adds one new item to the END of a list. The list grows by one. All existing items stay in place. You write it as list.append(new_item).",
    "The blank in the template is the method name: inventory.___(\"map\"). You want to add \"map\" to the end of the inventory. Compare the three options: one adds to the end, one doesn't exist on lists, one adds at a specific position.",
    "The correct method is append. inventory.append(\"map\") adds \"map\" after \"shield\", making the list [\"sword\", \"shield\", \"map\"]. The new item always goes at the end.",
  ],

  // L4 S2 — list slicing [1:4]
  variables_4_2: [
    "List slicing with [start:stop] extracts a section of a list. It includes the item at index 'start' but stops BEFORE index 'stop'. So [1:4] gives indices 1, 2, and 3 — index 4 is not included.",
    "The blank in the template is the stop number: items[1:___]. You want indices 1, 2, and 3. The stop value must be one past the last index you want included.",
    "To get indices 1, 2, 3 the stop must be 4 (one beyond the last index). items[1:4] gives \"shield\", \"potion\", \"map\". The blank is 4.",
  ],

  // L5 S0 — dict access hero["name"]
  variables_5_0: [
    "A dictionary stores key-value pairs. You access a value using its key in square brackets: dict[\"key\"]. Unlike lists which use numbers, dictionaries use descriptive key names — making them easier to read.",
    "The blank in the template is the key name: print(hero[\"___\"]). The dictionary has keys \"name\", \"hp\", and \"level\". You want the key whose value is the hero's name.",
    "The key that holds the hero's name is \"name\". hero[\"name\"] returns the name value. The blank is name (with quotes around it in the code).",
  ],

  // L5 S1 — dict update hero["level"] = 2
  variables_5_1: [
    "Updating a dictionary value works like reassigning a variable: dict[\"key\"] = new_value. This replaces the old value under that key. All other keys in the dictionary stay exactly as they were.",
    "The blank in the template is the new value: hero[\"level\"] = ___. The instruction says the hero levelled up. The current level is 1. The new level after levelling up is the number that goes in the blank.",
    "The hero levelled up to level 2, so the blank is 2. hero[\"level\"] = 2 replaces 1 with 2. The name and hp keys are not affected.",
  ],

  // L5 S2 — int() type conversion
  variables_5_2: [
    "int() converts a value to an integer (whole number). int(\"3\") takes the string \"3\" and turns it into the number 3. Without this conversion, Python treats \"3\" as text and cannot do maths on it — adding \"3\" + 1 would cause an error.",
    "The blank in the template is the function name: level = ___(difficulty). difficulty holds the string \"3\". You need the function that converts it to a number so level + 1 can be calculated. Compare the three options.",
    "The correct function is int. int(\"3\") converts \"3\" to the number 3. Then 3 + 1 = 4, which is the final output. str() would keep it as text, float() would give 3.0 (a decimal).",
  ],

  // ─── LOOPS ─────────────────────────────────────────────────────────────────

  // L1 S0 — range(3) to climb 3 steps
  loops_1_0: [
    "range(n) generates a sequence of numbers from 0 up to (but not including) n. range(3) produces 0, 1, 2 — exactly 3 values. A for loop runs its body once for each number, so range(3) makes the loop body run exactly 3 times.",
    "The blank in the template is the number inside range(): for step in range(___):. The hero needs to climb exactly 3 steps, meaning the loop must run 3 times. Whatever number you put in range() is how many times the loop runs.",
    "To run the loop 3 times, the blank is 3. range(3) gives 0, 1, 2 — three values, three loop passes. The hero climbs one step per pass.",
  ],

  // L1 S1 — xp = step * 2 (double XP)
  loops_1_1: [
    "Inside a loop, the loop variable changes on every pass. If step is the loop variable and you write xp = step * 2, Python multiplies that pass's step value by 2 to calculate XP. Each pass produces a different result.",
    "The blank in the template is the multiplier: xp = step * ___. The instruction says each step earns double XP. Doubling a number means multiplying by 2. The loop runs for steps 1 through 5.",
    "The blank is 2. On step 1: 1 × 2 = 2 XP. Step 2: 2 × 2 = 4 XP. Step 3: 3 × 2 = 6 XP. Step 4: 4 × 2 = 8 XP. Step 5: 5 × 2 = 10 XP. The five rewards are 2, 4, 6, 8, 10.",
  ],

  // L1 S2 — accumulator total_gold += section
  loops_1_2: [
    "An accumulator collects a running total across loop iterations. Set it to 0 before the loop starts. Inside the loop, add the current iteration's value to it each pass. After all iterations, the accumulator holds the grand total.",
    "The blank in the template is what gets added each pass: total_gold = total_gold + ___. The loop variable is section and it takes values 1, 2, 3, 4 in order. You want to add the current section's value to the running total each time.",
    "The blank is section. Trace the accumulation: 0 + 1 = 1, then 1 + 2 = 3, then 3 + 3 = 6, then 6 + 4 = 10. Total gold is 10.",
  ],

  // L2 S0 — for item in trail_items (keyword 'in')
  loops_2_0: [
    "A for...in loop iterates directly over the items in a list, one at a time. The loop variable takes the value of each item in order. for item in [\"a\", \"b\", \"c\"] gives item = \"a\" on pass 1, \"b\" on pass 2, \"c\" on pass 3.",
    "The blank in the template is the keyword that connects the loop variable to the list: for item ___ trail_items:. Python uses a specific keyword here. Compare the three options to find which one belongs in a for loop.",
    "The keyword is in — it tells Python to step through trail_items one item at a time. of and from are not used in Python for loops. The blank is in.",
  ],

  // L2 S1 — enumerate() gives (pos, item) pairs
  loops_2_1: [
    "enumerate() wraps a list and gives you both the index number AND the item on each iteration. Instead of just the item, each loop pass provides a pair — (index, item). You unpack the pair by naming two variables in the for statement.",
    "The blank in the template is the function that provides both position and item: for pos, item in ___(items):. Compare the options: one provides index+item pairs, one only gives numbers, one just converts types.",
    "The correct function is enumerate. enumerate(items) gives (0, \"gem\"), (1, \"shield\"), (2, \"scroll\") in order. range() would only give numbers with no items. The blank is enumerate.",
  ],

  // L2 S2 — list comprehension [g * 2 for g in gem_power]
  loops_2_2: [
    "A list comprehension creates a new list by applying an expression to every item in an existing list. The pattern is [expression for variable in list]. Whatever the expression produces for each item becomes the new item in the result list.",
    "The blank in the template is the multiplier: boosted = [g * ___ for g in gem_power]. The instruction says to double each gem's power. gem_power is [5, 10, 15]. Doubling means multiplying by what number?",
    "The blank is 2. The comprehension calculates: 5 × 2 = 10, 10 × 2 = 20, 15 × 2 = 30. The result is [10, 20, 30]. That is the boosted list.",
  ],

  // L3 S0 — nested loops, inner range(3)
  loops_3_0: [
    "In nested loops, the outer loop runs once and the ENTIRE inner loop runs from start to finish before the outer loop moves to its next iteration. Total executions = outer iterations × inner iterations.",
    "The blank is the inner loop's range value: for col in range(___):. The outer loop uses range(2) for 2 rows. The instruction says each row has 3 enemies — so the inner loop must run 3 times per row.",
    "The blank is 3. The inner loop runs 3 times for each of the 2 outer passes. Total attacks = 2 × 3 = 6. range(3) gives the inner loop exactly 3 iterations per row.",
  ],

  // L3 S1 — string multiplication "█" * level
  loops_3_1: [
    "In Python, multiplying a string by a number repeats it that many times. \"█\" * 3 produces \"███\". If you multiply by a loop variable, the repetition count changes on every pass as the variable increases.",
    "The blank in the template is what to multiply the block character by: meter = \"█\" * ___. The loop variable is level and it takes values 1, 2, 3. To make the meter grow with each level, the number of blocks should match the current level value.",
    "The blank is level. On level 1: \"█\" × 1 = \"█\". On level 2: \"█\" × 2 = \"██\". On level 3: \"█\" × 3 = \"███\". The meter grows because level increases each pass.",
  ],

  // L3 S2 — 2D map game_map[row].append(row + col)
  loops_3_2: [
    "Nested loops can build 2D structures. The outer loop adds rows, the inner loop fills each row with values. Combining the row and column indices in a formula gives each cell a unique calculated value.",
    "The blank is the operator in: game_map[row].append(row ___ col). Work out what operator produces the correct map [[0,1],[1,2]]: row=0,col=0 → 0; row=0,col=1 → 1; row=1,col=0 → 1; row=1,col=1 → 2.",
    "0+0=0, 0+1=1, 1+0=1, 1+1=2 — addition produces all four correct values. The blank is +. row + col gives each cell a value equal to the sum of its row and column index.",
  ],

  // L4 S0 — while stamina > 0
  loops_4_0: [
    "A while loop keeps running as long as its condition is True. Before every iteration, Python checks the condition — True means run the loop body, False means stop. The condition must eventually become False or the loop runs forever.",
    "The blank in the template is the comparison operator: while stamina ___ 0:. Stamina starts at 10 and decreases by 3 each pass. You want the loop to keep running as long as stamina is above zero.",
    "The blank is >. The condition is stamina > 0. Trace the values printed: 10 (> 0 ✓), 7 (> 0 ✓), 4 (> 0 ✓), 1 (> 0 ✓). After printing 1, stamina becomes -2 — -2 > 0 is False, so the loop stops.",
  ],

  // L4 S1 — break to stop searching
  loops_4_1: [
    "break immediately exits a loop the moment it is executed — no more iterations run, even if there are items left. The loop ends and Python continues with code after the loop. Use break when you've found what you need and there's no point continuing.",
    "The blank in the template is the keyword that stops the loop when the gem is found: if item == \"gem\": print(\"Found!\") ___. When the gem is found you want the loop to end immediately without checking remaining items.",
    "The keyword is break. When item equals \"gem\", the print runs and then break exits the loop. Before the gem, \"rock\" and \"stick\" each print a Checked: message. Once break runs, \"leaf\" and \"bone\" are never checked.",
  ],

  // L4 S2 — continue to skip one item
  loops_4_2: [
    "continue skips the rest of the current iteration and moves directly to the next one. Unlike break which exits the loop entirely, continue only skips the current pass — the loop keeps going with the remaining items.",
    "The blank in the template is the keyword: if i == 2: ___. When the index is 2 (the broken_gem), you want to skip it and move on. The loop must keep running after the skip — only index 2 should be omitted.",
    "The keyword is continue. When i == 2, Python skips the print() and jumps to the next iteration. The broken_gem at index 2 is skipped. sword (0), shield (1), potion (3), and key (4) are all printed.",
  ],

  // L5 S0 — list comprehension filter e >= 30
  loops_5_0: [
    "A list comprehension can filter a list using if. The pattern is [expression for item in list if condition]. Only items where the condition evaluates to True are included in the new list — others are dropped.",
    "The blank in the template is the filter threshold: strong = [e for e in enemies if e >= ___]. The instruction says enemies with power 30 or above count as strong. enemies is [10, 25, 30, 45, 50, 15]. The blank is the cutoff value.",
    "The blank is 30. The filter e >= 30 keeps 30, 45, and 50 and drops 10, 25, and 15. The result is [30, 45, 50] — the strong enemies.",
  ],

  // L5 S1 — sum() function
  loops_5_1: [
    "sum() is a Python built-in that adds every value in a list and returns the total. sum([1, 2, 3]) returns 6. It replaces a whole accumulator loop — one function call does all the work.",
    "The blank in the template is the function name: total_damage = ___(attacks). attacks is [25, 40, 35]. You want to add all three values together. Compare the three options to find which one sums a list.",
    "The correct function is sum. sum([25, 40, 35]) = 25 + 40 + 35 = 100. len() counts items, max() finds the largest — neither adds them. The blank is sum.",
  ],

  // L5 S2 — filter + transform [a + 10 for a if a >= 30]
  loops_5_2: [
    "A list comprehension can filter AND transform in one line: [expression for item in list if condition]. Only items passing the condition are included, and the expression transforms each one before adding it to the result.",
    "The blank in the template is the filter threshold: boosted = [a + 10 for a in attacks if a >= ___]. Only attacks of 30 or more earn the +10 boost. attacks is [15, 40, 25, 50, 35]. The blank is the minimum qualifying score.",
    "The blank is 30. Attacks >= 30 are: 40, 50, 35. Each gets +10 added: 50, 60, 45. Attacks 15 and 25 are filtered out entirely. The result is [50, 60, 45].",
  ],

  // ─── CONDITIONS ────────────────────────────────────────────────────────────

  // L1 S0 — if temp > 30
  conditions_1_0: [
    "Comparison operators check a relationship between two values and return True or False. > means 'greater than', < means 'less than', == means 'equal to'. In an if statement, only a True condition triggers the if block.",
    "The blank in the template is the comparison operator: if temp ___ 30:. temp is 35. The condition should detect that it's 'too hot' — meaning the temperature exceeds 30. Which operator checks if temp is greater than 30?",
    "The operator is >. temp > 30 becomes 35 > 30 — True. The if block runs and the hero rests in shade. The else block is skipped entirely.",
  ],

  // L1 S1 — if energy >= 20
  conditions_1_1: [
    ">= means 'greater than or equal to'. It returns True when the left value is either greater than OR exactly equal to the right value. In game terms, >= is used when a hero must 'meet or beat' a minimum requirement.",
    "The blank in the template is the minimum value: if energy >= ___:. The story says the barrier requires at least 20 energy to pass. energy is 15. The blank is the minimum energy level stated in the story.",
    "The blank is 20. The condition becomes 15 >= 20 — is 15 greater than or equal to 20? No, it's False. The else block runs and the hero needs to rest first.",
  ],

  // L1 S2 — path_a_danger > path_b_danger
  conditions_1_2: [
    "When comparing two variables, the operator determines which relationship you test. a > b asks 'is a bigger than b?'. The result (True or False) decides which branch runs — True takes the if path, False takes the else path.",
    "The blank in the template is the operator: if path_a_danger ___ path_b_danger: safe_path = \"B\". path_a_danger is 7 and path_b_danger is 3. If path A is MORE dangerous, the hero takes path B. Which operator tests 'more than'?",
    "The operator is >. 7 > 3 is True, so safe_path = \"B\". The hero takes path B (lower danger). If the operator were < instead, 7 < 3 would be False and the hero would incorrectly take path A.",
  ],

  // L2 S0 — == vs = (equality check)
  conditions_2_0: [
    "== checks whether two values are equal and returns True or False. It never changes a variable. = assigns a value to a variable — it does not compare. Mixing up == and = is one of the most common Python mistakes.",
    "The blank in the template is the comparison operator: print(hero_key ___ chest_code). hero_key is 42 and chest_code is 42. You want to check if they match, not assign — which operator compares for equality?",
    "The operator is ==. 42 == 42 returns True (match — the chest opens). 42 == \"42\" returns False because an integer and a string are different types even when they look the same.",
  ],

  // L2 S1 — != (not equal check)
  conditions_2_1: [
    "!= means 'not equal to'. It returns True when the two values are different, and False when they are the same. It is the opposite of ==. Games use != to check 'is this NOT what we expect?'",
    "The blank in the template is the operator: print(obstacle ___ \"flower\"). obstacle is \"rock\". You want to check that the obstacle is NOT a flower — which operator tests 'not equal to'?",
    "The operator is !=. \"rock\" != \"flower\" is True (they are different). \"rock\" != \"rock\" is False (they are the same). The first print gives True, the second gives False.",
  ],

  // L2 S2 — 'and' for both conditions
  conditions_2_2: [
    "The 'and' operator combines two conditions. It only returns True when BOTH conditions are True — if either one is False, the whole expression is False. Use 'and' when multiple requirements must all be met simultaneously.",
    "The blank in the template is the logical keyword: if has_rope ___ stamina >= 50:. has_rope is True and stamina is 80. The hero needs BOTH a rope AND enough stamina. Which keyword enforces both-must-be-True?",
    "The keyword is and. has_rope and stamina >= 50 → True and 80 >= 50 → True and True → True. Both conditions pass, so the hero crosses the bridge. If either were False, the whole expression would be False.",
  ],

  // L3 S0 — True and False (both-must-be-True)
  conditions_3_0: [
    "'and' returns True ONLY when both sides are True. If either side is False, the result is False. Think of it as a gate that only opens when every requirement is satisfied.",
    "The blank in the template is the operator: print(True ___ False). rune_a is True and rune_b is False. The gate requires both runes to be active — which keyword enforces that both must be True?",
    "The keyword is and. True and False = False (one rune is inactive — gate stays locked). True and True = True (both active — gate opens). Both runes must glow for the gate to open.",
  ],

  // L3 S1 — 'or' (at least one must be True)
  conditions_3_1: [
    "'or' returns True when AT LEAST ONE of its conditions is True. It only returns False when BOTH sides are False. 'or' is used when multiple options are acceptable — any one of them is enough.",
    "The blank in the template is the keyword: can_climb = sunny ___ warm. sunny is False, warm is True. The hero can climb if it's sunny OR if it's warm — either one is sufficient. Which keyword allows either to pass?",
    "The keyword is or. False or True = True — warm is True so the hero can climb even though it's not sunny. 'or' only fails when both sides are False. One True is always enough.",
  ],

  // L3 S2 — 'not' flips boolean
  conditions_3_2: [
    "'not' flips a boolean value. not True becomes False, and not False becomes True. It is used to check the OPPOSITE of a condition — 'if not poisoned' reads naturally as 'if the hero is healthy'.",
    "The blank in the template is the keyword: if ___ is_poisoned:. is_poisoned is False. You want the if block to run when the hero is NOT poisoned — which keyword flips False to True so the condition passes?",
    "The keyword is not. not is_poisoned → not False → True. The if block runs and the hero is ready to fight. If is_poisoned were True, not True would be False and the else block would run instead.",
  ],

  // L4 S0 — elif keyword for second condition
  conditions_4_0: [
    "'elif' stands for 'else if'. It adds an extra condition after the initial if. Python checks each condition from top to bottom and runs the FIRST branch whose condition is True, then skips all remaining branches. Only one branch ever executes.",
    "The blank in the template is the keyword: if danger >= 80: ... ___ danger >= 50: .... danger is 65. You need the keyword that introduces a second condition to check after the first if fails. In Python, 'else if' is written as one word.",
    "The keyword is elif. Python checks 65 >= 80 first — False, skip. Then checks 65 >= 50 — True, run this branch: 'proceed with caution'. The remaining branches are ignored because a match was found.",
  ],

  // L4 S1 — nested if, has_key inner condition
  conditions_4_1: [
    "Nested conditions check requirements in stages. The outer if checks one thing. Only when that passes does Python even evaluate the inner if. This creates a multi-step gate — like a door with two separate locks.",
    "The blank in the template is the inner condition: if hero_level >= 3: if ___: print(\"Enters the cave!\"). hero_level is 5 (passes the outer check). has_key is False. The inner condition should check whether the hero holds the required key.",
    "The inner condition is has_key. 5 >= 3 is True so Python enters the outer block. Then has_key is False — the inner if fails, so the else runs: 'needs a key!'. Level is high enough but the key is missing.",
  ],

  // L4 S2 — combined 'and' replaces nested ifs
  conditions_4_2: [
    "You can combine two conditions into one line using 'and'. This removes nested ifs and makes the code easier to read. if a and b is equivalent to an outer if checking a with an inner if checking b — but written in one clean line.",
    "The blank in the template is the keyword: if hero_level >= 3 ___ has_key:. hero_level is 5 and has_key is True. You want BOTH requirements checked at once in a single combined condition.",
    "The keyword is and. 5 >= 3 is True AND has_key is True — both pass, so the hero enters the cave. This is cleaner than two nested ifs: one line, two requirements, one branch.",
  ],

  // L5 S0 — 'in' keyword for membership test
  conditions_5_0: [
    "The 'in' keyword checks whether a value exists inside a collection such as a list or string. It returns True if the value is found, False if not. Python searches the entire collection automatically — you don't need a loop.",
    "The blank in the template is the keyword: print(\"gem\" ___ inventory). inventory is [\"sword\", \"gem\", \"potion\"]. You want to check whether \"gem\" is present in the list. Which keyword performs this membership test?",
    "The keyword is in. \"gem\" in inventory = True (gem is in the list). \"shield\" in inventory = False (shield is not in the list). The two print results are True then False.",
  ],

  // L5 S1 — ternary 'else' keyword
  conditions_5_1: [
    "A ternary expression is a one-line if/else. The pattern is: value_if_true if condition else value_if_false. Python evaluates the condition — True returns the first value, False returns the value after 'else'.",
    "The blank in the template is the keyword: status = \"healthy\" if hero_hp >= 50 ___ \"wounded\". hero_hp is 80. You need the keyword that introduces the fallback value when the condition is False — the same word used in regular if/else.",
    "The keyword is else. 80 >= 50 is True, so status = \"healthy\" (the value before 'if'). If hp were below 50, the condition would be False and status would be \"wounded\" (the value after 'else').",
  ],

  // L5 S2 — try/except ValueError
  conditions_5_2: [
    "try/except handles errors without crashing. Python tries the code inside 'try'. If an error occurs, it immediately jumps to 'except' instead of crashing the program. You write the specific error type you want to catch after 'except'.",
    "The blank in the template is the error type: try: damage = int(\"fire\") except ___: print(\"Invalid!\"). int(\"fire\") will fail because \"fire\" cannot be converted to a number. Python raises a specific error type for invalid int conversions.",
    "The error type is ValueError — that's what Python raises when int() receives a value it cannot convert. TypeError handles wrong types, but invalid string-to-int conversion is specifically a ValueError. Writing ValueError in the except line catches it cleanly.",
  ],

};
