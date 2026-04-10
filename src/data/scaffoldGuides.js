/**
 * SCAFFOLD GUIDES
 * ================
 * Each entry is keyed by "conceptId_level_stepIndex" (e.g. "variables_1_0").
 * Each entry is an array of 3 strings — one per scaffold phase.
 *
 * Phase 0 — Introduce the core Python concept. No examples, no question values.
 * Phase 1 — Guide the user's focus toward this specific question.
 * Phase 2 — Help narrow down the answer choices without giving the answer away.
 *
 * Design rule: never show worked examples or concrete calculations. Teach the
 * concept, direct attention, then help eliminate wrong options — distinctly
 * different from the Example First method.
 */

export const scaffoldGuides = {

  // ─── VARIABLES ─────────────────────────────────────────────────────────────

  // L1 S0 — set hero name, read print()
  variables_1_0: [
    "A variable is a named storage location in Python. When you assign a value to a variable, Python stores that value and remembers it by the variable's name. The variable name is written on the left of = and the value on the right.",
    "Look at the code: one line creates a variable and stores a value in it. The next line calls print() using that variable name. When print() receives a variable, it looks up the stored value and displays it — not the variable name itself.",
    "The variable was assigned one specific value on the first line. That exact value is what print() will display. Find the answer choice that matches what was stored in the variable.",
  ],

  // L1 S1 — reassignment overwrites, hero_hp = 100
  variables_1_1: [
    "A variable can be assigned a new value after it already has one. When this happens, the previous value is completely replaced — Python always remembers only the most recent assignment. Earlier values are gone.",
    "Trace the code from top to bottom: find every line that assigns to the variable and note the order. The value the variable holds when print() runs is the value from the last assignment before that print().",
    "Two assignments happen in sequence. Only the final assignment before print() matters — it overwrites everything before it. Locate that last assignment and match its value to the answer choices.",
  ],

  // L1 S2 — two prints, variable changes between them
  variables_1_2: [
    "Python runs code line by line, top to bottom, without skipping. If a variable's value changes between two print() calls, each print() captures a different value — the one the variable held at that exact moment in the sequence.",
    "Look for two separate print() calls and identify what the variable holds each time they run. The variable is assigned a value, then printed, then reassigned, then printed again. Both values matter and they appear in order.",
    "The answer shows two outputs — one per print() call. The first output is the value from the first assignment; the second is the value after reassignment. Find the answer that lists both values in the correct order.",
  ],

  // L2 S0 — type(hero_hp) returns int
  variables_2_0: [
    "Python automatically gives every value a type based on how it is written. A plain whole number has the type int. A value written inside quotes has the type str. A True or False value has the type bool. The type depends on the format, not on what the value looks like.",
    "The question asks which value makes type() return int. Look at the three options and consider what type each one would be based purely on how it is written — is there a plain number, a quoted value, and a True/False option?",
    "An integer is a plain whole number written without any quotes and without a decimal point. Only one of the three options fits that description exactly. Eliminate options that use quotes or represent a True/False value.",
  ],

  // L2 S1 — hero_xp = hero_xp + 30
  variables_2_1: [
    "A variable can be updated using its own current value in a calculation. The right side of the assignment is evaluated first — using the current stored value — and the result then replaces what was in the variable. This is how games track stats that change over time.",
    "The template shows a variable being added to a number. The story tells you exactly how much XP was earned. That stated amount is the number that belongs in the blank — it is what gets added to the current variable value.",
    "The blank is the amount being added, not the final result. Read the description to find the specific XP amount earned. Place that number in the blank, then calculate the new total to check which answer choice is correct.",
  ],

  // L2 S2 — string concatenation with +
  variables_2_2: [
    "The + operator can be used between two strings to join them into one combined string. This is called concatenation. Not all operators work on strings — some are only for numbers, and some have no meaning when applied to text.",
    "The blank is the operator that joins two string variables into a single combined string. Think about which of the three options performs text joining rather than subtraction or multiplication.",
    "Only one operator joins strings in Python. Subtraction (-) has no meaning for strings. Multiplication (*) repeats a single string rather than joining two different ones. Find the operator that combines two strings into one.",
  ],

  // L3 S0 — f-string, {hero} inside curly braces
  variables_3_0: [
    "An f-string embeds variable values directly inside a piece of text. You activate it by placing f before the opening quote. Inside the string, anything written between curly braces {} is treated as a variable name and replaced with that variable's actual value when the string is created.",
    "The blank is what goes inside the curly braces in the f-string. A variable was defined earlier in the code to hold the hero's name. The curly braces should contain that variable's name — written without quotes.",
    "Look at the first line of the code to find the variable holding the hero's name. That exact variable name, without quotes, is what goes between the curly braces. Check the options and identify which one matches a variable defined in the code.",
  ],

  // L3 S1 — len() counts characters
  variables_3_1: [
    "Python has built-in functions that perform specific operations on values. These functions take an input inside parentheses and return a result. Different built-in functions measure, convert, or transform values in different ways.",
    "The blank is a function name. The code is producing a number that represents something about the hero's name string. Think about what kind of built-in function takes a string and returns a number that measures the text.",
    "One function counts the number of characters in a string. The other options either do not exist in Python or perform a completely different operation. Find the option that specifically measures text length.",
  ],

  // L3 S2 — .upper() converts to ALL CAPS
  variables_3_2: [
    "String methods are built-in actions that can be called on any string. You call them using dot notation after the string or variable. Different string methods perform different transformations — some change letter casing, some search text, some split or join strings.",
    "The blank is a string method name. The code converts the battle cry before printing it. Consider what transformation represents a battle cry being shouted — think about how shouting is typically represented in written text.",
    "Shouting in text is represented by all uppercase letters. One of the three options converts all letters to uppercase. One only capitalises the first letter. One does not exist as a valid Python string method. Identify the all-uppercase option and eliminate the rest.",
  ],

  // L4 S0 — list index [0] for first item
  variables_4_0: [
    "Lists in Python are ordered collections that store multiple values. Each item sits at a numbered position called an index. Python has a specific rule for what number it uses as the starting index — it is not the number you might expect.",
    "The blank is the index number that accesses the first item in the list. Python uses a specific numbering system for positions. Think about what number Python assigns to the very first position in any list.",
    "Python indexes start at 0, not 1. The first item is always at index 0, the second at index 1, and so on. Look at the answer options and find the one that represents the correct index for the first position.",
  ],

  // L4 S1 — .append() adds to end of list
  variables_4_1: [
    "Lists have built-in methods that modify their contents. Different methods add, remove, or rearrange items in different ways. When you want to add a single new item to a list, you choose the method designed specifically for that purpose.",
    "The blank is the method name. The goal is to add a new item to the end of the inventory. Think about which list method adds one item to the end — not to a specific position, not replacing an existing item, but appending to the end.",
    "One method adds a single item to the end of a list. Another handles insertion at a specific index. A third option is not a valid Python list method. Identify the one specifically designed for adding to the end.",
  ],

  // L4 S2 — list slicing [1:4]
  variables_4_2: [
    "List slicing extracts a section of a list using [start:stop]. The start index is included in the result, but the stop index is NOT included — it marks where to stop before. So the result contains everything from start up to but not including stop.",
    "The blank is the stop value. You want to include items at specific index positions. Remember the stop value must be set one position beyond the last index you want — because the stop itself is excluded from the result.",
    "Identify the last index you want to include. The stop value is not that index — it is the next one after it. Count one beyond the last desired index and match that number to the answer choices.",
  ],

  // L5 S0 — dict access hero["name"]
  variables_5_0: [
    "Dictionaries store data as key-value pairs. Unlike lists which use number indexes, dictionaries use descriptive string keys to access their values. You retrieve a value by writing its key inside square brackets after the dictionary name.",
    "The blank is the key string that accesses the hero's name. Look at the dictionary definition earlier in the code to see what keys are available and what each one maps to. Identify which key is paired with the name value.",
    "The dictionary has several keys, each mapped to a different type of data. Find the key whose value is the hero's name. Eliminate keys that map to numbers or other data types — only one key holds the name.",
  ],

  // L5 S1 — dict update hero["level"] = 2
  variables_5_1: [
    "Dictionary values can be updated by assigning a new value to an existing key. The syntax is the same as variable assignment but uses the key in square brackets. Only the targeted key changes — all other keys and values in the dictionary stay the same.",
    "The blank is the new value for the level key. The story says the hero levelled up. Look at the current level value stored in the dictionary and determine what the next level would be after levelling up once.",
    "The hero starts at a specific level and advances by one. The blank is the new level number after that single advancement. Find the answer option that is one more than the current level shown in the dictionary.",
  ],

  // L5 S2 — int() type conversion
  variables_5_2: [
    "Python has type conversion functions that change a value from one type to another. Each function converts to a specific type: one to integer, one to string, one to decimal number. The right function to use depends on what type you need the result to be.",
    "The blank is a function name. The difficulty value is stored as a string, but the code needs to add a number to it. Python cannot perform arithmetic on strings — you must convert the string to a number type first. Which conversion produces a whole number?",
    "You need the function that converts a string into a plain whole number (integer). One option converts to integer, one converts to a decimal, one converts to string (it's already a string). Find the function that produces an integer result.",
  ],

  // ─── LOOPS ─────────────────────────────────────────────────────────────────

  // L1 S0 — range(3) to climb 3 steps
  loops_1_0: [
    "range() is a Python function that generates a sequence of numbers for a loop to use. The number you pass into range() determines how long the sequence is — and that directly controls how many times the loop body runs.",
    "The blank is the number inside range(). The hero needs to complete a specific number of steps. Think about the direct relationship between the number you give range() and how many iterations the loop performs.",
    "The loop runs exactly as many times as the number inside range(). If the hero needs a specific number of steps, the number inside range() must equal that. Match the range value to the number of steps required.",
  ],

  // L1 S1 — xp = step * 2 (double XP)
  loops_1_1: [
    "Inside a loop, the loop variable holds a different value on every iteration. You can use the loop variable in calculations within the loop body. Each iteration produces a different result because the loop variable changes each time.",
    "The blank is the multiplier in the XP calculation. The description says each step earns 'double' XP. Think about what 'double' means as a multiplication — what number do you multiply by to double a value?",
    "Doubling a value means multiplying by a specific number. The blank is that multiplier. Think about the multiplication that produces a result exactly twice as large as the original, then find that number in the options.",
  ],

  // L1 S2 — accumulator total_gold += section
  loops_1_2: [
    "An accumulator is a variable that collects a running total across loop iterations. It starts at an initial value before the loop begins. On each iteration, a new amount is added to it. After the loop ends, it holds the combined total of all additions.",
    "The blank is what gets added to the running total on each iteration. The loop variable represents a changing value on each pass. Think about whether the running total should grow by the loop variable's current value, or by some fixed amount.",
    "The total should grow by a different amount on each pass — not a fixed constant. The value that changes each pass is the loop variable itself. The blank is the loop variable name, not a number.",
  ],

  // L2 S0 — for item in trail_items (keyword 'in')
  loops_2_0: [
    "A Python for loop uses a specific keyword that connects the loop variable to the collection being iterated. This keyword is a fixed part of for loop syntax — it appears between the loop variable name and the collection name every time.",
    "The blank is the keyword between the loop variable and the list. Read the three options and think about which one is used in every Python for loop statement. The sentence reads: 'for item ___ trail_items' — which word makes this valid Python?",
    "Python for loops always use one specific keyword here. The other two options are either from other programming languages or are not valid in this position. Find the single keyword that is always written in Python for loops after the variable name.",
  ],

  // L2 S1 — enumerate() gives (pos, item) pairs
  loops_2_1: [
    "Some Python functions can wrap a list and provide extra information during iteration. Standard iteration gives you one value per pass. Certain built-in functions provide additional data alongside each item — such as the item's position number.",
    "The blank is the function that provides both an index and an item on each pass. The loop unpacks two values — a position and an item — so the function must produce a pair each time. Which of the options yields both a number and a value together per iteration?",
    "One function produces (index, item) pairs during iteration. One only generates a sequence of numbers with no items. One performs type conversion. The function you need must output both a position and an item on every pass.",
  ],

  // L2 S2 — list comprehension [g * 2 for g in gem_power]
  loops_2_2: [
    "A list comprehension creates a new list by applying a transformation to every item in an existing list. The expression before the 'for' keyword defines what calculation is performed on each item. The result is a new list containing all the transformed values.",
    "The blank is the multiplier applied to each gem's power value. The description says to 'double' each gem's power. Think about what multiplication doubles a value — what number multiplied by the original gives exactly twice the original?",
    "The blank is a number — the multiplier. To verify your answer, think through what happens to each value in the list when multiplied by that number. The resulting values should each be exactly twice the original.",
  ],

  // L3 S0 — nested loops, inner range(3)
  loops_3_0: [
    "Nested loops have an outer loop and an inner loop. For each single iteration of the outer loop, the entire inner loop runs from start to finish before the outer loop advances. The inner loop's range controls how many times it runs per outer iteration.",
    "The blank is the inner loop's range value. The outer loop handles rows. The description states how many items appear in each row. The inner loop must run once for each item in a row — count how many items per row from the description.",
    "Read the description to find how many items each row contains. The inner range value equals that number. As a check, multiply the outer range by the inner range — the product should equal the total number of actions described.",
  ],

  // L3 S1 — string multiplication "█" * level
  loops_3_1: [
    "In Python, multiplying a string by a number repeats that string that many times. The result is one longer string made of repeated copies. When you use a loop variable as the repeat count, the length changes on every iteration as the variable increases.",
    "The blank is what the block character is multiplied by. The meter should grow longer on each loop pass. Look at the loop variable — it increases each iteration. Think about using the loop variable itself as the multiplier so the bar grows with each pass.",
    "Using a fixed number as the multiplier would produce the same-length bar every pass. Using the loop variable makes the bar grow in step with the current iteration. The blank is the name of the loop variable, not a fixed number.",
  ],

  // L3 S2 — 2D map game_map[row].append(row + col)
  loops_3_2: [
    "Nested loops can build 2D structures where the outer variable represents one dimension and the inner variable represents another. Combining both loop variables in a formula assigns each position a unique calculated value based on its row and column.",
    "The blank is the operator that combines the row and column variables. Look at the expected output map and work out what relationship exists between each cell's value and its row and column position. Test each operator against the expected values.",
    "Apply each operator option to the row and column index of every cell in the expected output. The correct operator must produce the right value for every single cell — eliminate any operator that gives a wrong value even once.",
  ],

  // L4 S0 — while stamina > 0
  loops_4_0: [
    "A while loop checks a condition before each iteration. If the condition is True, the loop body runs; if it is False, the loop stops. The condition uses a comparison operator to test the current state of a variable against a threshold.",
    "The blank is the comparison operator. The loop should keep running while stamina is positive — meaning above zero. Think about which comparison operator specifically tests whether a value is greater than another value.",
    "Greater than (>) checks if the left value is strictly above the right. The loop must run while stamina is above zero and stop when it is not. Find the operator that returns True only when the variable is higher than the threshold.",
  ],

  // L4 S1 — break to stop searching
  loops_4_1: [
    "Python has a keyword that immediately exits a loop from inside the loop body. When this keyword is executed, the loop stops entirely — no further iterations run, even if there are items left to process. Execution continues with code after the loop.",
    "The blank is the keyword that ends the loop the moment the target item is found. Once the gem is located, there is no need to check any remaining items — the search is complete. Think about which keyword causes the loop to exit immediately.",
    "One keyword exits the loop entirely. Another skips just the current iteration but keeps the loop running. The blank requires a full stop — the loop must end the moment the item is found. Find the keyword for complete loop termination.",
  ],

  // L4 S2 — continue to skip one item
  loops_4_2: [
    "Python has a keyword that skips the rest of the current iteration and jumps directly to the next one. Unlike full loop exit, the loop itself keeps going — only the current pass is cut short. This lets you selectively skip certain items while continuing the loop.",
    "The blank is the keyword for skipping one specific index. The loop should ignore printing for that one item but continue normally for all others. Think about which keyword skips the current pass without stopping the whole loop.",
    "One keyword skips the current iteration and continues the loop. One keyword exits the loop entirely. The broken item should be skipped, but the remaining items must still be processed. Find the keyword that skips without stopping.",
  ],

  // L5 S0 — list comprehension filter e >= 30
  loops_5_0: [
    "A list comprehension can include a filter condition using 'if'. Only items where the condition is True are included in the new list — items that fail the condition are left out entirely. The threshold value in the condition sets the boundary between included and excluded.",
    "The blank is the threshold value in the filter condition. The description states a specific minimum power level that qualifies an enemy as 'strong'. That minimum value is explicitly stated in the description — use it as the threshold number.",
    "Read the description carefully for the exact cutoff power level. The blank is that stated number. Verify by mentally checking which enemies in the list meet the condition and confirming the resulting list makes sense.",
  ],

  // L5 S1 — sum() function
  loops_5_1: [
    "Python has built-in functions that compute aggregate values from a list in a single call. Different functions produce different kinds of results — some count, some find extremes, some compute totals. The right function depends on what kind of aggregate you need.",
    "The blank is a function name. The code needs to calculate the combined total of all values in a list. Think about which built-in function takes a list and returns the sum of all its values.",
    "One function adds all values in a list together and returns the total. One counts how many items are in the list. One finds the largest value. You need the function that produces the arithmetic sum. Find it among the options.",
  ],

  // L5 S2 — filter + transform [a + 10 for a if a >= 30]
  loops_5_2: [
    "A list comprehension can both filter and transform in a single expression. The filter condition excludes items that don't qualify, and the transformation expression modifies the items that do qualify before placing them in the new list.",
    "The blank is the filter threshold. The description states a minimum attack score required to earn the bonus. Only attacks at or above this score receive the transformation. Find that specific minimum value in the question description.",
    "The description explicitly states the cutoff value. Items below it are excluded entirely — they receive no transformation and do not appear in the result. The blank is the exact minimum score stated. Read the description carefully to find it.",
  ],

  // ─── CONDITIONS ────────────────────────────────────────────────────────────

  // L1 S0 — if temp > 30
  conditions_1_0: [
    "Comparison operators compare two values and return either True or False. Different operators test different relationships: greater than, less than, equal to, and more. The result of the comparison determines which branch of an if statement executes.",
    "The blank is the comparison operator. The condition should detect when the temperature is 'too hot' — when it exceeds a certain value. Think about which operator specifically tests whether a value is greater than another value.",
    "Greater than (>) returns True when the left side is strictly above the right side. The condition needs to detect temperature that exceeds the threshold — not equal to it, not below it. Identify the operator for 'strictly greater than'.",
  ],

  // L1 S1 — if energy >= 20
  conditions_1_1: [
    "The >= operator tests whether a value is greater than or equal to a threshold. It returns True when the value either exceeds the threshold or matches it exactly. This is used when something must 'meet or beat' a minimum requirement.",
    "The blank is the minimum energy value required. The story states a specific energy level needed to pass the barrier. The current energy value is different from the requirement — the condition tests whether the current value meets that requirement.",
    "The required minimum is stated in the description. The blank is that specific number. After placing it, evaluate whether the current energy value passes or fails the condition — this tells you which branch runs.",
  ],

  // L1 S2 — path_a_danger > path_b_danger
  conditions_1_2: [
    "You can compare two variables directly using a comparison operator. The operator tests the relationship between their current values — which is larger, which is smaller, or whether they are equal. The result is still True or False.",
    "The blank is the operator. The condition decides which path is safer by comparing danger levels. The hero takes path B if path A is MORE dangerous. Think about which operator tests whether the left variable is greater than the right variable.",
    "Greater than (>) returns True if the left variable's value exceeds the right variable's value. If that is True, path A is more dangerous and path B is chosen. Substitute the known values to verify which branch runs with the correct operator.",
  ],

  // L2 S0 — == vs = (equality check)
  conditions_2_0: [
    "Python uses two different symbols that look similar but do completely different things. One assigns a value to a variable and changes it. The other compares two values to check if they are equal, returning True or False without changing anything.",
    "The blank is a symbol used to compare two values. The code is testing whether two values match — it should not modify any variable, only check for equality. Think about which symbol performs a comparison rather than an assignment.",
    "Assignment uses a single equals sign (=) and changes a variable's value. Equality comparison uses two equals signs (==) and only tests — it changes nothing. The blank needs a comparison, not an assignment.",
  ],

  // L2 S1 — != (not equal check)
  conditions_2_1: [
    "The != operator tests whether two values are NOT equal. It returns True when the values are different and False when they are the same. It is the logical opposite of ==, used when you want to detect a mismatch rather than a match.",
    "The blank is the comparison operator. The code checks that an obstacle is NOT a specific thing — you need to detect a difference, not a match. Which operator tests 'these two values are different from each other'?",
    "Not equal (!=) returns True when values differ. Equal (==) returns True when they match. You need the operator that detects a difference. After placing it, the first comparison should return True and the second should return False.",
  ],

  // L2 S2 — 'and' for both conditions
  conditions_2_2: [
    "The 'and' logical operator combines two conditions. It returns True only when both conditions are True at the same time. If either condition is False, the whole expression is False. It enforces that multiple requirements are all satisfied simultaneously.",
    "The blank is a logical keyword. The hero must satisfy two requirements at the same time — possessing the rope AND having enough stamina. Think about which keyword requires both conditions to be True for the combined result to be True.",
    "The keyword 'and' requires both sides to be True. The keyword 'or' only requires one side to be True. The hero needs both requirements met simultaneously — one alone is not enough. Find the keyword that enforces both at once.",
  ],

  // L3 S0 — True and False (both-must-be-True)
  conditions_3_0: [
    "The 'and' operator evaluates two boolean values and returns True only when both are True. If either side is False, the result is False regardless of the other side. It acts like a gate that only opens when every requirement is satisfied.",
    "The blank is the logical keyword between two boolean variables. The gate requires both runes to be active — meaning both must be True. Which keyword produces True only when both sides are True, and False if even one is False?",
    "With 'and', a single False makes the whole result False. With 'or', one True is enough. One rune is True and one is False — determine which keyword produces False in this case, meaning the gate remains locked.",
  ],

  // L3 S1 — 'or' (at least one must be True)
  conditions_3_1: [
    "The 'or' logical operator returns True when at least one of its conditions is True. It only returns False when both conditions are False at the same time. It is used when multiple options are acceptable — any single one of them is sufficient.",
    "The blank is a logical keyword. The hero can climb if it is sunny OR if it is warm — either condition alone is enough. Think about which keyword returns True when at least one of the two conditions is True.",
    "With 'or', one True is enough — the other side's value does not matter. With 'and', both must be True. One condition is False and one is True — determine which keyword produces True in this situation.",
  ],

  // L3 S2 — 'not' flips boolean
  conditions_3_2: [
    "The 'not' keyword reverses a boolean value: it turns True into False and False into True. It is used when you want code to run when a condition is NOT met — the opposite of the condition's current value.",
    "The blank is the keyword that inverts the boolean condition. The if block should run when the hero is healthy — meaning when is_poisoned is False. Think about which keyword flips a False value to True so the condition passes.",
    "Applying 'not' to a False value gives True, which allows the if block to run. Without 'not', a False condition would skip the if block and run the else instead. Find the keyword that performs this boolean inversion.",
  ],

  // L4 S0 — elif keyword for second condition
  conditions_4_0: [
    "'elif' allows you to chain additional conditions after an initial if. It stands for 'else if' and is only checked when the previous condition was False. Python tests the chain from top to bottom and runs only the first branch whose condition is True.",
    "The blank is the keyword that introduces a second conditional check. After the first if fails, you need to test another condition before falling through to else. Think about which keyword adds a chained condition in a Python if statement.",
    "The keyword 'elif' introduces a chained condition. 'else' runs without a condition — it handles everything not caught above. Starting a fresh 'if' would create a separate independent statement. The blank needs the keyword for chained conditions.",
  ],

  // L4 S1 — nested if, has_key inner condition
  conditions_4_1: [
    "Conditions can be nested — one if statement placed inside another. The inner if is only evaluated when the outer if's condition is True. This creates a multi-step check where later requirements are only tested after earlier ones are satisfied.",
    "The blank is the inner condition. The outer check already passed. The inner condition checks a separate requirement for entering the cave. Look at the variables available in the code and identify which one represents whether the hero has what is needed.",
    "The code has a level variable and a key variable. The outer condition already checked the level requirement. The inner condition must check the remaining requirement — whether the hero possesses the key. Find the variable that represents key possession.",
  ],

  // L4 S2 — combined 'and' replaces nested ifs
  conditions_4_2: [
    "Two nested if statements checking separate requirements can be rewritten as a single if statement using a logical operator. This produces the same result with fewer lines and is easier to read. The logical operator must enforce that both requirements are met.",
    "The blank is the logical keyword that joins both conditions on one line. Both requirements — the level check and the key check — must be satisfied simultaneously. Think about which keyword enforces that both conditions must be True at the same time.",
    "The combined condition must be True only when both requirements pass. 'and' requires both sides to be True. 'or' would pass with just one. The blank must keep both requirements in force — find the keyword that does this.",
  ],

  // L5 S0 — 'in' keyword for membership test
  conditions_5_0: [
    "Python has a keyword that checks whether a value exists anywhere inside a collection. It searches the entire collection automatically and returns True if the value is found, False if not. This avoids the need to loop manually through every item.",
    "The blank is the keyword for a membership test. The code checks whether a specific item exists inside a list. Look at the options and think about which keyword performs the 'is this item inside this collection?' check.",
    "The keyword 'in' tests for membership in a collection. The other options are logical or comparison operators — they do not search collections for a specific value. Find the keyword specifically used for containment checks.",
  ],

  // L5 S1 — ternary 'else' keyword
  conditions_5_1: [
    "A ternary expression writes a simple if/else decision on a single line. It has the form: true_value if condition else false_value. If the condition is True, the expression evaluates to the first value. If False, it evaluates to the value after the separating keyword.",
    "The blank is the keyword separating the condition from the fallback value. When the condition is False, the blank keyword introduces the alternative. Think about which word in a normal if/else statement marks the 'otherwise' path.",
    "In a regular multi-line if/else, the word 'else' introduces the alternative branch. The ternary expression uses that same keyword for the same purpose. The blank is the word that signals 'use this value when the condition is False'.",
  ],

  // L5 S2 — try/except ValueError
  conditions_5_2: [
    "Python's try/except structure handles errors without crashing the program. The 'try' block contains code that might fail. If an error occurs, Python jumps to the 'except' block. You write the specific error type you want to catch right after the 'except' keyword.",
    "The blank is the error type. The try block attempts to convert a string to an integer. When the string cannot be converted (because it is not a valid number), Python raises a specific named error. Think about what type of error an invalid conversion produces.",
    "Converting an invalid string to an integer raises a ValueError — the value provided was of the right type (string) but the wrong kind (not a number). TypeError would mean the wrong type entirely. The blank is the specific error type that int() raises when conversion fails.",
  ],

};
