/**
 * LESSON DATA — Version 2 (Python Edition)
 * ==========================================
 * Each concept has 5 difficulty levels, each with 3 steps.
 * All code examples use Python syntax.
 *
 * Steps have different shapes depending on the game modality:
 *   - codeSimulation: uses codeSnippet, traceQuestion, options, correctIndex
 *   - dragDrop:       uses codeBlocks, correctOrder, visualScene
 *   - speedCoding:    uses codeTemplate, blanks (each with options + correctIndex)
 */

const lessons = [
  // =====================
  // CONCEPT 1: VARIABLES
  // =====================
  {
    id: "variables",
    title: "Variables",
    concept: "Storing Data",
    icon: "x=",
    color: "from-cyan-500 to-blue-600",
    description: "Learn how to store and use data in your programs.",
    levels: [
      {
        level: 1,
        title: "Declaring Variables",
        steps: [
          {
            instruction: "What does this code output?",
            codeSnippet: 'name = "Alex"\nprint(name)',
            traceQuestion: "What gets printed?",
            codeBlocks: ['name = "Alex"', "print(name)"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: '___ = "Alex"\nprint(___)',
            blanks: [
              { position: 0, options: ["name", "123", "print"], correctIndex: 0 },
              { position: 1, options: ["name", '"Alex"', "print"], correctIndex: 0 },
            ],
            options: ['"Alex"', "name", "None"],
            correctIndex: 0,
            explanation:
              "Variables store values. When we write name = \"Alex\", the variable 'name' holds the text \"Alex\". print() displays whatever value is inside the variable.",
          },
          {
            instruction: "What is the value of score after this code runs?",
            codeSnippet: "score = 0\nscore = 10\nprint(score)",
            traceQuestion: "What is the value of score?",
            codeBlocks: ["score = 0", "score = 10", "print(score)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "score = 0\nscore = ___\nprint(score)",
            blanks: [
              { position: 0, options: ["10", "0", "score"], correctIndex: 0 },
            ],
            options: ["10", "0", "Error"],
            correctIndex: 0,
            explanation:
              "Variables can be reassigned. score starts as 0, then gets overwritten to 10. The latest assignment wins — Python simply replaces the old value with the new one.",
          },
          {
            instruction: "What happens when you run this code?",
            codeSnippet: 'greeting = "Hello"\nprint(greeting)\ngreeting = "Bye"\nprint(greeting)',
            traceQuestion: "What are the two outputs?",
            codeBlocks: ['greeting = "Hello"', "print(greeting)", 'greeting = "Bye"', "print(greeting)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'greeting = "Hello"\nprint(greeting)\ngreeting = "___"\nprint(greeting)',
            blanks: [
              { position: 0, options: ["Bye", "Hello", "greeting"], correctIndex: 0 },
            ],
            options: ["Hello then Bye", "Bye then Bye", "Hello then Hello"],
            correctIndex: 0,
            explanation:
              "The first print() runs when greeting is still \"Hello\". Then greeting gets reassigned to \"Bye\", so the second print() outputs \"Bye\". Code runs top to bottom, one line at a time.",
          },
        ],
      },
      {
        level: 2,
        title: "Types & Operations",
        steps: [
          {
            instruction: "What type of value is stored in 'age'?",
            codeSnippet: "age = 25\nprint(type(age))",
            traceQuestion: "What does type(age) return?",
            codeBlocks: ["age = 25", "print(type(age))"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "age = ___\nprint(type(age))",
            blanks: [
              { position: 0, options: ["25", '"25"', "True"], correctIndex: 0 },
            ],
            options: ["<class 'int'>", "<class 'str'>", "<class 'bool'>"],
            correctIndex: 0,
            explanation:
              "25 is an integer (int) — a whole number with no quotes. \"25\" would be a string. Python has several types: int, float, str, bool, list, dict, and more.",
          },
          {
            instruction: "What is the value of x after this code runs?",
            codeSnippet: "x = 5\nx = x + 3\nprint(x)",
            traceQuestion: "What is x?",
            codeBlocks: ["x = 5", "x = x + 3", "print(x)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "x = 5\nx = x + ___\nprint(x)",
            blanks: [
              { position: 0, options: ["3", "5", "8"], correctIndex: 0 },
            ],
            options: ["8", "5", "3"],
            correctIndex: 0,
            explanation:
              "x starts as 5. Then x = x + 3 means 'take current x (5), add 3, store result back in x'. So x becomes 8. This pattern of updating a variable with its own value is very common.",
          },
          {
            instruction: "What does this code print?",
            codeSnippet: 'a = "Hello"\nb = " World"\nc = a + b\nprint(c)',
            traceQuestion: "What is c?",
            codeBlocks: ['a = "Hello"', 'b = " World"', "c = a + b", "print(c)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'a = "Hello"\nb = " World"\nc = a ___ b\nprint(c)',
            blanks: [
              { position: 0, options: ["+", "-", "*"], correctIndex: 0 },
            ],
            options: ['"Hello World"', '"HelloWorld"', "Error"],
            correctIndex: 0,
            explanation:
              "When you use + with strings, Python concatenates (joins) them. 'Hello' + ' World' = 'Hello World'. Notice the space at the start of ' World' — that's what creates the space between words.",
          },
        ],
      },
      {
        level: 3,
        title: "String Operations",
        steps: [
          {
            instruction: "What does this f-string produce?",
            codeSnippet: 'name = "Sam"\nmsg = f"Hi, {name}!"\nprint(msg)',
            traceQuestion: "What is msg?",
            codeBlocks: ['name = "Sam"', 'msg = f"Hi, {name}!"', "print(msg)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'name = "Sam"\nmsg = f"Hi, {___}!"',
            blanks: [
              { position: 0, options: ["name", '"name"', "Sam"], correctIndex: 0 },
            ],
            options: ['"Hi, Sam!"', '"Hi, {name}!"', '"Hi, name!"'],
            correctIndex: 0,
            explanation:
              "f-strings (formatted strings) start with f before the quote. Inside them, {variable_name} inserts the value of that variable. This is the cleanest way to build strings in Python.",
          },
          {
            instruction: "What is the length of this string?",
            codeSnippet: 'word = "Code"\nprint(len(word))',
            traceQuestion: "What number gets printed?",
            codeBlocks: ['word = "Code"', "print(len(word))"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'word = "Code"\nprint(___(word))',
            blanks: [
              { position: 0, options: ["len", "size", "count"], correctIndex: 0 },
            ],
            options: ["4", "3", "5"],
            correctIndex: 0,
            explanation:
              "len() counts the number of characters in a string. 'Code' has 4 characters: C, o, d, e. len() works on strings, lists, and most other collections in Python.",
          },
          {
            instruction: "What does .upper() return?",
            codeSnippet: 'text = "hello"\nprint(text.upper())',
            traceQuestion: "What gets printed?",
            codeBlocks: ['text = "hello"', "print(text.upper())"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'text = "hello"\nprint(text.___())',
            blanks: [
              { position: 0, options: ["upper", "up", "capitalize"], correctIndex: 0 },
            ],
            options: ['"HELLO"', '"Hello"', '"hello"'],
            correctIndex: 0,
            explanation:
              ".upper() converts every character to uppercase. The original variable stays unchanged — it returns a new string. There's also .lower() for the reverse.",
          },
        ],
      },
      {
        level: 4,
        title: "Lists & Indexing",
        steps: [
          {
            instruction: "What does this list access return?",
            codeSnippet: 'colors = ["red", "green", "blue"]\nprint(colors[0])',
            traceQuestion: "What gets printed?",
            codeBlocks: ['colors = ["red", "green", "blue"]', "print(colors[0])"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'colors = ["red", "green", "blue"]\nprint(colors[___])',
            blanks: [
              { position: 0, options: ["0", "1", "3"], correctIndex: 0 },
            ],
            options: ['"red"', '"green"', '"blue"'],
            correctIndex: 0,
            explanation:
              "Lists are zero-indexed — the first item is at position 0, not 1. colors[0] is 'red', colors[1] is 'green', colors[2] is 'blue'. This catches many beginners off guard!",
          },
          {
            instruction: "What does .append() do?",
            codeSnippet: 'fruits = ["apple", "banana"]\nfruits.append("cherry")\nprint(fruits)',
            traceQuestion: "What is the list after append?",
            codeBlocks: ['fruits = ["apple", "banana"]', 'fruits.append("cherry")', "print(fruits)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'fruits = ["apple", "banana"]\nfruits.___(\"cherry\")',
            blanks: [
              { position: 0, options: ["append", "add", "insert"], correctIndex: 0 },
            ],
            options: ['["apple", "banana", "cherry"]', '["cherry", "apple", "banana"]', '["apple", "banana"]'],
            correctIndex: 0,
            explanation:
              ".append() adds an item to the END of a list. The list grows by one element. It modifies the original list directly (unlike string methods which return new strings).",
          },
          {
            instruction: "What does list slicing return?",
            codeSnippet: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:4])',
            traceQuestion: "What slice do we get?",
            codeBlocks: ["nums = [10, 20, 30, 40, 50]", "print(nums[1:4])"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "nums = [10, 20, 30, 40, 50]\nprint(nums[1:___])",
            blanks: [
              { position: 0, options: ["4", "3", "5"], correctIndex: 0 },
            ],
            options: ["[20, 30, 40]", "[10, 20, 30, 40]", "[20, 30]"],
            correctIndex: 0,
            explanation:
              "Slicing with [start:stop] gives you elements from index 'start' up to but NOT including 'stop'. nums[1:4] gives indices 1, 2, 3 → [20, 30, 40]. The stop index is always excluded.",
          },
        ],
      },
      {
        level: 5,
        title: "Dictionaries & Input",
        steps: [
          {
            instruction: "How do you access a dictionary value?",
            codeSnippet: 'player = {"name": "Alex", "score": 100}\nprint(player["name"])',
            traceQuestion: "What gets printed?",
            codeBlocks: ['player = {"name": "Alex", "score": 100}', 'print(player["name"])'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'player = {"name": "Alex", "score": 100}\nprint(player["___"])',
            blanks: [
              { position: 0, options: ["name", "score", "0"], correctIndex: 0 },
            ],
            options: ['"Alex"', "100", "Error"],
            correctIndex: 0,
            explanation:
              "Dictionaries store key-value pairs. You access values using their key in square brackets. player[\"name\"] returns \"Alex\". Unlike lists, dictionaries use keys (names) instead of numbered indices.",
          },
          {
            instruction: "What does this code produce?",
            codeSnippet: 'player = {"name": "Alex", "score": 100}\nplayer["score"] = 200\nprint(player)',
            traceQuestion: "What is the updated dictionary?",
            codeBlocks: ['player = {"name": "Alex", "score": 100}', 'player["score"] = 200', "print(player)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'player["score"] = ___',
            blanks: [
              { position: 0, options: ["200", "100", "score"], correctIndex: 0 },
            ],
            options: ['{"name": "Alex", "score": 200}', '{"name": "Alex", "score": 100}', "Error"],
            correctIndex: 0,
            explanation:
              "You update dictionary values by assigning to their key. player[\"score\"] = 200 replaces the old value (100) with 200. This is how you'd update a player's score in a game!",
          },
          {
            instruction: "What does int() do here?",
            codeSnippet: 'text = "42"\nnumber = int(text)\nprint(number + 8)',
            traceQuestion: "What is the final output?",
            codeBlocks: ['text = "42"', "number = int(text)", "print(number + 8)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'text = "42"\nnumber = ___(text)\nprint(number + 8)',
            blanks: [
              { position: 0, options: ["int", "str", "float"], correctIndex: 0 },
            ],
            options: ["50", '"428"', "Error"],
            correctIndex: 0,
            explanation:
              'int() converts a string to an integer. "42" is text, but int("42") becomes the number 42. Then 42 + 8 = 50. Without int(), Python would try to concatenate "42" + 8 and crash.',
          },
        ],
      },
    ],
  },

  // =====================
  // CONCEPT 2: LOOPS
  // =====================
  {
    id: "loops",
    title: "Loops",
    concept: "Repetition",
    icon: "for",
    color: "from-violet-500 to-purple-600",
    description: "Master the art of making code repeat itself.",
    levels: [
      {
        level: 1,
        title: "For Loops Basics",
        steps: [
          {
            instruction: "What does this loop print?",
            codeSnippet: "for i in range(3):\n    print(i)",
            traceQuestion: "What numbers get printed?",
            codeBlocks: ["for i in range(3):", "    print(i)"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "for i in range(___):\n    print(i)",
            blanks: [
              { position: 0, options: ["3", "2", "4"], correctIndex: 0 },
            ],
            options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"],
            correctIndex: 0,
            explanation:
              "range(3) generates numbers 0, 1, 2 — it starts at 0 and stops BEFORE 3. So the loop runs 3 times with i taking values 0, 1, 2. This is one of the most common patterns in Python.",
          },
          {
            instruction: "What does this loop output?",
            codeSnippet: "for i in range(1, 6):\n    print(i * 2)",
            traceQuestion: "What are the five outputs?",
            codeBlocks: ["for i in range(1, 6):", "    print(i * 2)"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "for i in range(1, 6):\n    print(i * ___)",
            blanks: [
              { position: 0, options: ["2", "1", "6"], correctIndex: 0 },
            ],
            options: ["2, 4, 6, 8, 10", "1, 2, 3, 4, 5", "2, 4, 6, 8"],
            correctIndex: 0,
            explanation:
              "range(1, 6) gives 1, 2, 3, 4, 5. Each time, we print i * 2. So: 1*2=2, 2*2=4, 3*2=6, 4*2=8, 5*2=10. Loops are powerful — 2 lines of code produced 5 outputs!",
          },
          {
            instruction: "What is 'total' after this loop?",
            codeSnippet: "total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)",
            traceQuestion: "What number gets printed?",
            codeBlocks: ["total = 0", "for i in range(1, 5):", "    total = total + i", "print(total)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "total = 0\nfor i in range(1, 5):\n    total = total + ___",
            blanks: [
              { position: 0, options: ["i", "1", "total"], correctIndex: 0 },
            ],
            options: ["10", "4", "6"],
            correctIndex: 0,
            explanation:
              "This loop sums the numbers 1 through 4. Round 1: total=0+1=1. Round 2: total=1+2=3. Round 3: total=3+3=6. Round 4: total=6+4=10. This accumulator pattern is extremely common in programming.",
          },
        ],
      },
      {
        level: 2,
        title: "Looping Through Lists",
        steps: [
          {
            instruction: "How do you loop through every item in this list?",
            codeSnippet: 'fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)',
            traceQuestion: "What three strings get printed?",
            codeBlocks: ['fruits = ["apple", "banana", "cherry"]', "for fruit in fruits:", "    print(fruit)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'fruits = ["apple", "banana", "cherry"]\nfor fruit ___ fruits:\n    print(fruit)',
            blanks: [
              { position: 0, options: ["in", "of", "from"], correctIndex: 0 },
            ],
            options: ["apple, banana, cherry", "0, 1, 2", "3"],
            correctIndex: 0,
            explanation:
              "Python's for...in loop iterates directly over list items. 'fruit' takes each value in turn: first 'apple', then 'banana', then 'cherry'. No index needed — clean and readable.",
          },
          {
            instruction: "What does enumerate() give us?",
            codeSnippet: 'colors = ["red", "green", "blue"]\nfor i, color in enumerate(colors):\n    print(i, color)',
            traceQuestion: "What gets printed?",
            codeBlocks: ['colors = ["red", "green", "blue"]', "for i, color in enumerate(colors):", "    print(i, color)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'for i, color in ___(colors):\n    print(i, color)',
            blanks: [
              { position: 0, options: ["enumerate", "range", "list"], correctIndex: 0 },
            ],
            options: ["0 red, 1 green, 2 blue", "red, green, blue", "0, 1, 2"],
            correctIndex: 0,
            explanation:
              "enumerate() gives you both the index AND the item on each iteration. It's like getting the best of both worlds — you know the position and the value. Very useful when you need to track where you are.",
          },
          {
            instruction: "What does this list comprehension produce?",
            codeSnippet: "nums = [1, 2, 3]\ndoubled = [n * 2 for n in nums]\nprint(doubled)",
            traceQuestion: "What is the doubled list?",
            codeBlocks: ["nums = [1, 2, 3]", "doubled = [n * 2 for n in nums]", "print(doubled)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "doubled = [n * ___ for n in nums]",
            blanks: [
              { position: 0, options: ["2", "3", "n"], correctIndex: 0 },
            ],
            options: ["[2, 4, 6]", "[1, 2, 3]", "[3, 6, 9]"],
            correctIndex: 0,
            explanation:
              "List comprehensions are Python's elegant way to create new lists. [n * 2 for n in nums] means 'for each n in nums, multiply by 2'. It's a one-liner replacement for a full for loop. Very Pythonic!",
          },
        ],
      },
      {
        level: 3,
        title: "Nested Loops",
        steps: [
          {
            instruction: "How many times does the inner print() run?",
            codeSnippet: "for i in range(2):\n    for j in range(3):\n        print(i, j)",
            traceQuestion: "Total number of outputs?",
            codeBlocks: ["for i in range(2):", "    for j in range(3):", "        print(i, j)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "for i in range(2):\n    for j in range(___):\n        print(i, j)",
            blanks: [
              { position: 0, options: ["3", "2", "6"], correctIndex: 0 },
            ],
            options: ["6 times", "5 times", "2 times"],
            correctIndex: 0,
            explanation:
              "Outer loop runs 2 times (i=0, i=1). For EACH outer iteration, inner loop runs 3 times (j=0,1,2). Total: 2 x 3 = 6. Nested loops multiply — be careful with large numbers!",
          },
          {
            instruction: "What pattern does this code draw?",
            codeSnippet: 'for i in range(1, 4):\n    print("*" * i)',
            traceQuestion: "What gets printed?",
            codeBlocks: ["for i in range(1, 4):", '    print("*" * i)'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'for i in range(1, 4):\n    print("*" * ___)',
            blanks: [
              { position: 0, options: ["i", "3", "1"], correctIndex: 0 },
            ],
            options: ["*\\n**\\n***", "***\\n***\\n***", "***"],
            correctIndex: 0,
            explanation:
              "String multiplication in Python: '*' * 3 gives '***'. When i=1: '*'. When i=2: '**'. When i=3: '***'. This creates a triangle pattern — a classic nested loop exercise!",
          },
          {
            instruction: "What does this grid-builder produce?",
            codeSnippet: "grid = []\nfor row in range(2):\n    grid.append([])\n    for col in range(2):\n        grid[row].append(row + col)\nprint(grid)",
            traceQuestion: "What is the final grid?",
            codeBlocks: ["grid = []", "for row in range(2):", "    grid.append([])", "    for col in range(2):", "        grid[row].append(row + col)", "print(grid)"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "grid[row].append(row ___ col)",
            blanks: [
              { position: 0, options: ["+", "*", "-"], correctIndex: 0 },
            ],
            options: ["[[0, 1], [1, 2]]", "[[0, 0], [1, 1]]", "[[1, 2], [3, 4]]"],
            correctIndex: 0,
            explanation:
              "Row 0: col 0 → 0+0=0, col 1 → 0+1=1 → [0,1]. Row 1: col 0 → 1+0=1, col 1 → 1+1=2 → [1,2]. Nested loops are perfect for building 2D data structures like grids and game boards.",
          },
        ],
      },
      {
        level: 4,
        title: "While Loops & Control",
        steps: [
          {
            instruction: "When does this while loop stop?",
            codeSnippet: "count = 10\nwhile count > 0:\n    print(count)\n    count = count - 3",
            traceQuestion: "What numbers get printed?",
            codeBlocks: ["count = 10", "while count > 0:", "    print(count)", "    count = count - 3"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "count = 10\nwhile count ___ 0:\n    count = count - 3",
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ["10, 7, 4, 1", "10, 7, 4", "10, 7, 4, 1, -2"],
            correctIndex: 0,
            explanation:
              "count starts at 10. Each round subtracts 3: 10→7→4→1. After printing 1, count becomes -2. Since -2 > 0 is False, the loop stops. While loops check the condition BEFORE each iteration.",
          },
          {
            instruction: "What does 'break' do inside a loop?",
            codeSnippet: "for i in range(10):\n    if i == 3:\n        break\n    print(i)",
            traceQuestion: "What gets printed?",
            codeBlocks: ["for i in range(10):", "    if i == 3:", "        break", "    print(i)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "for i in range(10):\n    if i == 3:\n        ___",
            blanks: [
              { position: 0, options: ["break", "continue", "return"], correctIndex: 0 },
            ],
            options: ["0, 1, 2", "0, 1, 2, 3", "0 through 9"],
            correctIndex: 0,
            explanation:
              "'break' immediately exits the loop. When i=3, break runs BEFORE print(i), so 3 is never printed. Only 0, 1, 2 appear. Break is useful for searching — stop as soon as you find what you need.",
          },
          {
            instruction: "What does 'continue' do here?",
            codeSnippet: "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
            traceQuestion: "What gets printed?",
            codeBlocks: ["for i in range(5):", "    if i == 2:", "        continue", "    print(i)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "    if i == 2:\n        ___",
            blanks: [
              { position: 0, options: ["continue", "break", "pass"], correctIndex: 0 },
            ],
            options: ["0, 1, 3, 4", "0, 1", "0, 1, 2, 3, 4"],
            correctIndex: 0,
            explanation:
              "'continue' skips the REST of the current iteration and jumps to the next one. When i=2, it skips print() and goes straight to i=3. Unlike break, the loop keeps running — it just skips one round.",
          },
        ],
      },
      {
        level: 5,
        title: "Advanced List Operations",
        steps: [
          {
            instruction: "What does this filter produce?",
            codeSnippet: "nums = [1, 2, 3, 4, 5, 6]\nevens = [n for n in nums if n % 2 == 0]\nprint(evens)",
            traceQuestion: "What is the evens list?",
            codeBlocks: ["nums = [1, 2, 3, 4, 5, 6]", "evens = [n for n in nums if n % 2 == 0]", "print(evens)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "evens = [n for n in nums if n % ___ == 0]",
            blanks: [
              { position: 0, options: ["2", "3", "1"], correctIndex: 0 },
            ],
            options: ["[2, 4, 6]", "[1, 3, 5]", "[1, 2, 3, 4, 5, 6]"],
            correctIndex: 0,
            explanation:
              "List comprehension with a condition: [n for n in nums if n % 2 == 0] keeps only numbers where n % 2 equals 0 (even numbers). It's a one-liner filter — very Pythonic!",
          },
          {
            instruction: "What does sum() calculate here?",
            codeSnippet: "nums = [10, 20, 30]\ntotal = sum(nums)\nprint(total)",
            traceQuestion: "What is total?",
            codeBlocks: ["nums = [10, 20, 30]", "total = sum(nums)", "print(total)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "total = ___(nums)",
            blanks: [
              { position: 0, options: ["sum", "len", "max"], correctIndex: 0 },
            ],
            options: ["60", "30", "3"],
            correctIndex: 0,
            explanation:
              "sum() adds up all values in a list: 10 + 20 + 30 = 60. Python has many built-in functions like sum(), len(), max(), min(), and sorted() that work on lists. No loops needed!",
          },
          {
            instruction: "What does this combined operation produce?",
            codeSnippet: "scores = [45, 88, 72, 55, 91]\npassing = [s + 5 for s in scores if s >= 70]\nprint(passing)",
            traceQuestion: "What is passing?",
            codeBlocks: ["scores = [45, 88, 72, 55, 91]", "passing = [s + 5 for s in scores if s >= 70]", "print(passing)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "passing = [s + 5 for s in scores if s >= ___]",
            blanks: [
              { position: 0, options: ["70", "50", "90"], correctIndex: 0 },
            ],
            options: ["[93, 77, 96]", "[88, 72, 91]", "[50, 93, 77, 60, 96]"],
            correctIndex: 0,
            explanation:
              "This comprehension filters AND transforms: first keep scores >= 70 (88, 72, 91), then add 5 to each (93, 77, 96). One line replaces a for loop with an if statement inside. Powerful and clean!",
          },
        ],
      },
    ],
  },

  // =====================
  // CONCEPT 3: CONDITIONS
  // =====================
  {
    id: "conditions",
    title: "Conditions",
    concept: "Decision Making",
    icon: "if",
    color: "from-emerald-500 to-green-600",
    description: "Teach your programs to make smart decisions.",
    levels: [
      {
        level: 1,
        title: "If / Else Basics",
        steps: [
          {
            instruction: "What does this code print?",
            codeSnippet: 'temp = 35\nif temp > 30:\n    print("Hot!")\nelse:\n    print("Nice weather")',
            traceQuestion: "Which branch runs?",
            codeBlocks: ["temp = 35", "if temp > 30:", '    print("Hot!")', "else:", '    print("Nice weather")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'temp = 35\nif temp ___ 30:\n    print("Hot!")',
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ['"Hot!"', '"Nice weather"', "Both"],
            correctIndex: 0,
            explanation:
              "temp is 35. The condition checks: is 35 > 30? Yes! So the if-block runs and prints 'Hot!'. The else block is skipped entirely. Only ONE branch ever runs.",
          },
          {
            instruction: "What is the output of this code?",
            codeSnippet: 'age = 15\nif age >= 18:\n    print("Can vote")\nelse:\n    print("Too young to vote")',
            traceQuestion: "Which message appears?",
            codeBlocks: ["age = 15", "if age >= 18:", '    print("Can vote")', "else:", '    print("Too young to vote")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'if age >= ___:\n    print("Can vote")',
            blanks: [
              { position: 0, options: ["18", "15", "21"], correctIndex: 0 },
            ],
            options: ['"Too young to vote"', '"Can vote"', "Nothing"],
            correctIndex: 0,
            explanation:
              "age is 15. Is 15 >= 18? No! So the if-block is skipped and the else-block runs: 'Too young to vote'. The >= operator means 'greater than or equal to'.",
          },
          {
            instruction: "What value does 'bigger' hold?",
            codeSnippet: "a = 7\nb = 12\nif a > b:\n    bigger = a\nelse:\n    bigger = b\nprint(bigger)",
            traceQuestion: "What is bigger?",
            codeBlocks: ["a = 7", "b = 12", "if a > b:", "    bigger = a", "else:", "    bigger = b", "print(bigger)"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: "if a ___ b:\n    bigger = a\nelse:\n    bigger = b",
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ["12", "7", "Error"],
            correctIndex: 0,
            explanation:
              "Is 7 > 12? No. So the else-block runs: bigger = b = 12. This is a classic pattern for finding the larger of two values. (Shortcut: Python has max(a, b) built in!)",
          },
        ],
      },
      {
        level: 2,
        title: "Comparison Operators",
        steps: [
          {
            instruction: "What's the difference between == and =?",
            codeSnippet: 'x = 5       # assignment\nprint(x == 5)   # comparison\nprint(x == "5")  # different types',
            traceQuestion: "What are the two outputs?",
            codeBlocks: ["x = 5", "print(x == 5)", 'print(x == "5")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "x = 5\nprint(x ___ 5)   # True",
            blanks: [
              { position: 0, options: ["==", "=", "!="], correctIndex: 0 },
            ],
            options: ["True, False", "True, True", "5, 5"],
            correctIndex: 0,
            explanation:
              "= is assignment (x = 5 stores the value). == is comparison (x == 5 asks 'is x equal to 5?'). In Python, 5 == \"5\" is False because an integer and a string are different types. Python doesn't auto-convert.",
          },
          {
            instruction: "What does != mean?",
            codeSnippet: "x = 10\nprint(x != 5)\nprint(x != 10)",
            traceQuestion: "What are the two results?",
            codeBlocks: ["x = 10", "print(x != 5)", "print(x != 10)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "x = 10\nprint(x ___ 5)   # True",
            blanks: [
              { position: 0, options: ["!=", "==", ">"], correctIndex: 0 },
            ],
            options: ["True, False", "False, True", "True, True"],
            correctIndex: 0,
            explanation:
              "!= means 'not equal to'. 10 != 5 is True (they're different). 10 != 10 is False (they're the same). It's the opposite of ==.",
          },
          {
            instruction: "What does this combined condition check?",
            codeSnippet: 'score = 85\nif score >= 70 and score < 90:\n    print("Grade B")',
            traceQuestion: "Does 'Grade B' get printed?",
            codeBlocks: ["score = 85", "if score >= 70 and score < 90:", '    print("Grade B")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "if score >= 70 ___ score < 90:",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ["Yes — 85 is between 70 and 90", "No — one condition fails", "Error"],
            correctIndex: 0,
            explanation:
              "'and' means BOTH conditions must be true. Is 85 >= 70? Yes. Is 85 < 90? Yes. Both true, so the whole condition is True. Range checks like this are very common in real code.",
          },
        ],
      },
      {
        level: 3,
        title: "Logical Operators",
        steps: [
          {
            instruction: "What does the 'and' operator do?",
            codeSnippet: "a = True\nb = False\nprint(a and b)\nprint(a and True)",
            traceQuestion: "What are the two outputs?",
            codeBlocks: ["a = True", "b = False", "print(a and b)", "print(a and True)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "print(True ___ False)",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ["False, True", "True, True", "False, False"],
            correctIndex: 0,
            explanation:
              "'and' returns True ONLY when BOTH sides are True. True and False = False (one side fails). True and True = True (both pass). Think of it as: 'Are ALL conditions met?'",
          },
          {
            instruction: "What does the 'or' operator do?",
            codeSnippet: "sunny = False\nwarm = True\nprint(sunny or warm)",
            traceQuestion: "Is the result True or False?",
            codeBlocks: ["sunny = False", "warm = True", "print(sunny or warm)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "print(False ___ True)",
            blanks: [
              { position: 0, options: ["or", "and", "not"], correctIndex: 0 },
            ],
            options: ["True", "False", "Error"],
            correctIndex: 0,
            explanation:
              "'or' returns True when AT LEAST ONE side is True. False or True = True. Only False or False would give False. Think of it as: 'Is ANY condition met?'",
          },
          {
            instruction: "What does 'not' do here?",
            codeSnippet: 'logged_in = False\nif not logged_in:\n    print("Please sign in")',
            traceQuestion: "Does the message print?",
            codeBlocks: ["logged_in = False", "if not logged_in:", '    print("Please sign in")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "if ___ logged_in:\n    print(\"Please sign in\")",
            blanks: [
              { position: 0, options: ["not", "and", "or"], correctIndex: 0 },
            ],
            options: ["Yes — not False is True", "No — logged_in is False", "Error"],
            correctIndex: 0,
            explanation:
              "'not' flips a boolean. not False = True, not True = False. Here, logged_in is False, so 'not logged_in' is True, and the if-block runs. Very common pattern: 'if NOT logged in, show login prompt'.",
          },
        ],
      },
      {
        level: 4,
        title: "Elif & Nesting",
        steps: [
          {
            instruction: "Which grade does a score of 82 get?",
            codeSnippet: 'score = 82\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint(grade)',
            traceQuestion: "What is grade?",
            codeBlocks: ["score = 82", "if score >= 90:", '    grade = "A"', "elif score >= 80:", '    grade = "B"', "elif score >= 70:", '    grade = "C"', "else:", '    grade = "F"', "print(grade)"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            visualScene: "mountain",
            codeTemplate: 'if score >= 90:\n    grade = "A"\n___ score >= 80:\n    grade = "B"',
            blanks: [
              { position: 0, options: ["elif", "else if", "if"], correctIndex: 0 },
            ],
            options: ['"B"', '"A"', '"C"'],
            correctIndex: 0,
            explanation:
              "82 >= 90? No. 82 >= 80? Yes! So grade = 'B'. Once a condition matches, the rest are skipped — it won't check 82 >= 70 even though that's also true. Python uses 'elif' (not 'else if'). Order matters!",
          },
          {
            instruction: "What message does this nested condition print?",
            codeSnippet: 'age = 20\nhas_id = False\n\nif age >= 18:\n    if has_id:\n        print("Entry allowed")\n    else:\n        print("Need ID")\nelse:\n    print("Too young")',
            traceQuestion: "Which message appears?",
            codeBlocks: ["age = 20", "has_id = False", "if age >= 18:", "    if has_id:", '        print("Entry allowed")', "    else:", '        print("Need ID")', "else:", '    print("Too young")'],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            visualScene: "mountain",
            codeTemplate: "if age >= 18:\n    if ___:\n        print(\"Entry allowed\")",
            blanks: [
              { position: 0, options: ["has_id", "age", "True"], correctIndex: 0 },
            ],
            options: ['"Need ID"', '"Entry allowed"', '"Too young"'],
            correctIndex: 0,
            explanation:
              "First check: 20 >= 18? Yes, enter outer if. Second check: has_id is False, so the inner else runs: 'Need ID'. Nested conditions let you check multiple criteria step by step. Indentation shows the structure.",
          },
          {
            instruction: "Simplify this nested condition:",
            codeSnippet: 'age = 20\nhas_id = True\n\nif age >= 18 and has_id:\n    print("Entry allowed")\nelse:\n    print("Access denied")',
            traceQuestion: "What does this simplified version print?",
            codeBlocks: ["age = 20", "has_id = True", "if age >= 18 and has_id:", '    print("Entry allowed")', "else:", '    print("Access denied")'],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "if age >= 18 ___ has_id:",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ['"Entry allowed"', '"Access denied"', "Error"],
            correctIndex: 0,
            explanation:
              "Using 'and' combines both checks into one line: 20 >= 18 is True AND has_id is True, so the whole condition is True. This is cleaner than nesting. Flatten when you can!",
          },
        ],
      },
      {
        level: 5,
        title: "Advanced Conditions",
        steps: [
          {
            instruction: "What does the 'in' keyword check?",
            codeSnippet: 'fruits = ["apple", "banana", "cherry"]\nprint("banana" in fruits)\nprint("grape" in fruits)',
            traceQuestion: "What are the two outputs?",
            codeBlocks: ['fruits = ["apple", "banana", "cherry"]', 'print("banana" in fruits)', 'print("grape" in fruits)'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'print("banana" ___ fruits)',
            blanks: [
              { position: 0, options: ["in", "of", "=="], correctIndex: 0 },
            ],
            options: ["True, False", "True, True", "False, False"],
            correctIndex: 0,
            explanation:
              "'in' checks if a value exists in a collection. 'banana' is in the list → True. 'grape' is not → False. Works with lists, strings, dictionaries, and more. Very readable!",
          },
          {
            instruction: "What does this ternary expression return?",
            codeSnippet: 'age = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(status)',
            traceQuestion: "What is status?",
            codeBlocks: ["age = 20", 'status = "adult" if age >= 18 else "minor"', "print(status)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'status = "adult" if age >= 18 ___ "minor"',
            blanks: [
              { position: 0, options: ["else", "or", "and"], correctIndex: 0 },
            ],
            options: ['"adult"', '"minor"', "20"],
            correctIndex: 0,
            explanation:
              'Python\'s ternary: value_if_true if condition else value_if_false. Since 20 >= 18 is True, status = "adult". It\'s a one-line if/else — great for simple assignments.',
          },
          {
            instruction: "What does this try/except catch?",
            codeSnippet: 'try:\n    number = int("hello")\n    print(number)\nexcept ValueError:\n    print("Not a valid number")',
            traceQuestion: "What gets printed?",
            codeBlocks: ["try:", '    number = int("hello")', "    print(number)", "except ValueError:", '    print("Not a valid number")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'try:\n    number = int("hello")\nexcept ___:\n    print("Not a valid number")',
            blanks: [
              { position: 0, options: ["ValueError", "TypeError", "Error"], correctIndex: 0 },
            ],
            options: ['"Not a valid number"', "Error crashes the program", '"hello"'],
            correctIndex: 0,
            explanation:
              'int("hello") fails because "hello" isn\'t a number — it raises a ValueError. The except block catches that error and prints a friendly message instead of crashing. Try/except is essential for robust programs!',
          },
        ],
      },
    ],
  },
];

export default lessons;
