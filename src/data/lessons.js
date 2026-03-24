/**
 * LESSON DATA — Version 2 (Teen/Young Adult Edition)
 * ===================================================
 * Each concept has 5 difficulty levels, each with 3 steps.
 * Steps now have different shapes depending on the game modality:
 *
 *   - codeSimulation: uses `codeSnippet`, `traceQuestion`, options, correctIndex
 *   - dragDrop:       uses `codeBlocks`, `correctOrder`, `visualScene`
 *   - speedCoding:    uses `codeTemplate`, `blanks` (each with options + correctIndex)
 *
 * All three modalities ALSO get: instruction, explanation, options, correctIndex
 * (the generic fallback fields).
 *
 * Fields per concept:
 *   id          – unique identifier (used in URLs)
 *   title       – display name
 *   concept     – short label
 *   icon        – text icon (code-style, not emoji)
 *   color       – Tailwind gradient for cards
 *   description – one-line summary for home page
 *   levels      – array of 5 level objects, each containing steps
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
            // Code Simulation data
            codeSnippet: 'let name = "Alex";\nconsole.log(name);',
            traceQuestion: "What gets printed to the console?",
            // Drag & Drop data
            codeBlocks: ['let name = "Alex";', "console.log(name);"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            // Speed Coding data
            codeTemplate: 'let ___ = "Alex";\nconsole.log(___);',
            blanks: [
              { position: 0, options: ["name", "123", "let"], correctIndex: 0 },
              { position: 1, options: ["name", '"Alex"', "let"], correctIndex: 0 },
            ],
            // Shared
            options: ['"Alex"', "name", "undefined"],
            correctIndex: 0,
            explanation:
              "Variables store values. When we write let name = \"Alex\", the variable 'name' holds the text \"Alex\". console.log() prints whatever value is inside the variable.",
          },
          {
            instruction: "Which keyword declares a variable that can be reassigned?",
            codeSnippet: "let score = 0;\nscore = 10;\nconsole.log(score);",
            traceQuestion: "What is the value of score?",
            codeBlocks: ["let score = 0;", "score = 10;", "console.log(score);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "___ score = 0;\nscore = 10;",
            blanks: [
              { position: 0, options: ["let", "const", "var"], correctIndex: 0 },
            ],
            options: ["let", "const", "function"],
            correctIndex: 0,
            explanation:
              "'let' declares a variable that can be changed later. 'const' creates a variable that CANNOT be reassigned. Use 'let' when the value needs to change.",
          },
          {
            instruction: "What happens when you run this code?",
            codeSnippet: 'const greeting = "Hello";\ngreeting = "Bye";',
            traceQuestion: "Does this code run successfully?",
            codeBlocks: ['const greeting = "Hello";', 'greeting = "Bye";'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: '___ greeting = "Hello";',
            blanks: [
              { position: 0, options: ["const", "let", "var"], correctIndex: 0 },
            ],
            options: ["It prints 'Bye'", "Error — can't reassign a const", "It prints 'Hello'"],
            correctIndex: 1,
            explanation:
              "const means 'constant' — the value can't change. Trying to reassign a const variable throws an error. Use const for values that should never change.",
          },
        ],
      },
      {
        level: 2,
        title: "Types & Reassignment",
        steps: [
          {
            instruction: "What type of value is stored in 'age'?",
            codeSnippet: "let age = 25;\nconsole.log(typeof age);",
            traceQuestion: "What does typeof age return?",
            codeBlocks: ["let age = 25;", "console.log(typeof age);"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "let age = ___;\nconsole.log(typeof age);",
            blanks: [
              { position: 0, options: ["25", '"25"', "true"], correctIndex: 0 },
            ],
            options: ['"number"', '"string"', '"boolean"'],
            correctIndex: 0,
            explanation:
              "25 is a number (no quotes). \"25\" would be a string. JavaScript has several types: number, string, boolean, undefined, null, object, and more.",
          },
          {
            instruction: "What is the value of x after this code runs?",
            codeSnippet: "let x = 5;\nx = x + 3;\nconsole.log(x);",
            traceQuestion: "What is x?",
            codeBlocks: ["let x = 5;", "x = x + 3;", "console.log(x);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "let x = 5;\nx = x + ___;",
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
            codeSnippet: 'let a = "Hello";\nlet b = " World";\nlet c = a + b;\nconsole.log(c);',
            traceQuestion: "What is c?",
            codeBlocks: ['let a = "Hello";', 'let b = " World";', "let c = a + b;", "console.log(c);"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'let a = "Hello";\nlet b = " World";\nlet c = a ___ b;',
            blanks: [
              { position: 0, options: ["+", "-", "*"], correctIndex: 0 },
            ],
            options: ['"Hello World"', '"HelloWorld"', "Error"],
            correctIndex: 0,
            explanation:
              "When you use + with strings, JavaScript concatenates (joins) them. 'Hello' + ' World' = 'Hello World'. Notice the space at the start of ' World' — that's what creates the space between words.",
          },
        ],
      },
      {
        level: 3,
        title: "String Operations",
        steps: [
          {
            instruction: "What does this template literal produce?",
            codeSnippet: 'let name = "Sam";\nlet msg = `Hi, ${name}!`;\nconsole.log(msg);',
            traceQuestion: "What is msg?",
            codeBlocks: ['let name = "Sam";', "let msg = `Hi, ${name}!`;", "console.log(msg);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'let name = "Sam";\nlet msg = `Hi, ___!`;',
            blanks: [
              { position: 0, options: ["${name}", "name", "{name}"], correctIndex: 0 },
            ],
            options: ['"Hi, Sam!"', '"Hi, ${name}!"', '"Hi, name!"'],
            correctIndex: 0,
            explanation:
              "Template literals use backticks (`) instead of quotes. Inside them, ${...} inserts the value of a variable. This is cleaner than string concatenation with +.",
          },
          {
            instruction: "What is the length of this string?",
            codeSnippet: 'let word = "Code";\nconsole.log(word.length);',
            traceQuestion: "What number gets printed?",
            codeBlocks: ['let word = "Code";', "console.log(word.length);"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'let word = "Code";\nconsole.log(word.___);',
            blanks: [
              { position: 0, options: ["length", "size", "count"], correctIndex: 0 },
            ],
            options: ["4", "3", "5"],
            correctIndex: 0,
            explanation:
              ".length counts the number of characters in a string. 'Code' has 4 characters: C, o, d, e. Strings are zero-indexed, but .length gives the actual count.",
          },
          {
            instruction: "What does .toUpperCase() return?",
            codeSnippet: 'let text = "hello";\nconsole.log(text.toUpperCase());',
            traceQuestion: "What gets printed?",
            codeBlocks: ['let text = "hello";', "console.log(text.toUpperCase());"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'let text = "hello";\nconsole.log(text.___());',
            blanks: [
              { position: 0, options: ["toUpperCase", "toUp", "capitalize"], correctIndex: 0 },
            ],
            options: ['"HELLO"', '"Hello"', '"hello"'],
            correctIndex: 0,
            explanation:
              ".toUpperCase() converts every character to uppercase. The original variable stays unchanged — it returns a new string. There's also .toLowerCase() for the reverse.",
          },
        ],
      },
      {
        level: 4,
        title: "Scope Basics",
        steps: [
          {
            instruction: "Can we access 'x' outside the if block?",
            codeSnippet: "if (true) {\n  let x = 10;\n}\nconsole.log(x);",
            traceQuestion: "What happens when this runs?",
            codeBlocks: ["if (true) {", "  let x = 10;", "}", "console.log(x);"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "if (true) {\n  ___ x = 10;\n}",
            blanks: [
              { position: 0, options: ["let", "var", "const"], correctIndex: 0 },
            ],
            options: ["Error — x is not defined", "10", "undefined"],
            correctIndex: 0,
            explanation:
              "'let' and 'const' are block-scoped — they only exist inside the { } where they were declared. Outside those braces, x doesn't exist. This prevents variables from leaking into other parts of your code.",
          },
          {
            instruction: "What value does y have at the end?",
            codeSnippet: "let y = 1;\n\nfunction addFive() {\n  y = y + 5;\n}\n\naddFive();\nconsole.log(y);",
            traceQuestion: "What is y after calling addFive()?",
            codeBlocks: ["let y = 1;", "function addFive() {", "  y = y + 5;", "}", "addFive();", "console.log(y);"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "let y = 1;\nfunction addFive() {\n  y = y + ___;\n}\naddFive();",
            blanks: [
              { position: 0, options: ["5", "1", "y"], correctIndex: 0 },
            ],
            options: ["6", "1", "5"],
            correctIndex: 0,
            explanation:
              "y is declared outside the function (global scope), so addFive() can access and modify it. y starts at 1, then 1 + 5 = 6. Functions can read and write variables from their outer scope.",
          },
          {
            instruction: "What does this code print?",
            codeSnippet: "let a = 1;\n\nfunction test() {\n  let a = 99;\n  console.log(a);\n}\n\ntest();\nconsole.log(a);",
            traceQuestion: "What are the two outputs?",
            codeBlocks: ["let a = 1;", "function test() {", "  let a = 99;", "  console.log(a);", "}", "test();", "console.log(a);"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: "let a = 1;\nfunction test() {\n  let a = ___;\n  console.log(a);\n}",
            blanks: [
              { position: 0, options: ["99", "1", "a"], correctIndex: 0 },
            ],
            options: ["99 then 1", "99 then 99", "1 then 1"],
            correctIndex: 0,
            explanation:
              "There are TWO separate 'a' variables. The 'let a = 99' inside test() creates a new local 'a' that shadows the outer one. Inside test(), a is 99. Outside, the original a is still 1.",
          },
        ],
      },
      {
        level: 5,
        title: "Complex Expressions",
        steps: [
          {
            instruction: "What does this expression evaluate to?",
            codeSnippet: 'let result = 5 + "3";\nconsole.log(result);\nconsole.log(typeof result);',
            traceQuestion: "What is result and what type is it?",
            codeBlocks: ['let result = 5 + "3";', "console.log(result);", "console.log(typeof result);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'let result = 5 + "3";\n// result is: ___',
            blanks: [
              { position: 0, options: ['"53"', "8", "53"], correctIndex: 0 },
            ],
            options: ['"53" (string)', "8 (number)", "Error"],
            correctIndex: 0,
            explanation:
              "When you add a number to a string, JavaScript converts the number to a string and concatenates them. 5 + \"3\" = \"53\" (a string). This is called type coercion and is a common source of bugs!",
          },
          {
            instruction: "What is the value of total?",
            codeSnippet: "let a = 10;\nlet b = 3;\nlet total = a % b;\nconsole.log(total);",
            traceQuestion: "What does the % operator return?",
            codeBlocks: ["let a = 10;", "let b = 3;", "let total = a % b;", "console.log(total);"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "let a = 10;\nlet b = 3;\nlet total = a ___ b;",
            blanks: [
              { position: 0, options: ["%", "/", "*"], correctIndex: 0 },
            ],
            options: ["1", "3", "3.33"],
            correctIndex: 0,
            explanation:
              "The % operator is called modulo — it returns the REMAINDER after division. 10 / 3 = 3 remainder 1. So 10 % 3 = 1. This is useful for checking if a number is even (n % 2 === 0) or cycling through values.",
          },
          {
            instruction: "What does this ternary expression return?",
            codeSnippet: 'let age = 20;\nlet status = age >= 18 ? "adult" : "minor";\nconsole.log(status);',
            traceQuestion: "What is status?",
            codeBlocks: ["let age = 20;", 'let status = age >= 18 ? "adult" : "minor";', "console.log(status);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'let age = 20;\nlet status = age >= 18 ? "___" : "minor";',
            blanks: [
              { position: 0, options: ["adult", "minor", "20"], correctIndex: 0 },
            ],
            options: ['"adult"', '"minor"', "20"],
            correctIndex: 0,
            explanation:
              'The ternary operator (condition ? valueIfTrue : valueIfFalse) is a shortcut for if/else. Since 20 >= 18 is true, it returns "adult". It\'s a concise way to assign values based on conditions.',
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
        title: "Basic For Loops",
        steps: [
          {
            instruction: "How many times does this loop run?",
            codeSnippet: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
            traceQuestion: "What numbers get printed?",
            codeBlocks: ["for (let i = 0; i < 3; i++) {", "  console.log(i);", "}"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "for (let i = 0; i < ___; i++) {\n  console.log(i);\n}",
            blanks: [
              { position: 0, options: ["3", "2", "4"], correctIndex: 0 },
            ],
            options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"],
            correctIndex: 0,
            explanation:
              "The loop starts with i = 0, runs while i < 3, and adds 1 each time. So i goes: 0, 1, 2. When i becomes 3, the condition i < 3 is false and the loop stops. Three iterations total.",
          },
          {
            instruction: "What does this loop print?",
            codeSnippet: "for (let i = 1; i <= 5; i++) {\n  console.log(i * 2);\n}",
            traceQuestion: "What are the five outputs?",
            codeBlocks: ["for (let i = 1; i <= 5; i++) {", "  console.log(i * 2);", "}"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "for (let i = 1; i <= 5; i++) {\n  console.log(i * ___);  \n}",
            blanks: [
              { position: 0, options: ["2", "1", "5"], correctIndex: 0 },
            ],
            options: ["2, 4, 6, 8, 10", "1, 2, 3, 4, 5", "2, 4, 6, 8"],
            correctIndex: 0,
            explanation:
              "i goes from 1 to 5. Each time, we print i * 2. So: 1*2=2, 2*2=4, 3*2=6, 4*2=8, 5*2=10. Loops are powerful — 3 lines of code produced 5 outputs!",
          },
          {
            instruction: "What is 'total' after this loop?",
            codeSnippet: "let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total = total + i;\n}\nconsole.log(total);",
            traceQuestion: "What number gets printed?",
            codeBlocks: ["let total = 0;", "for (let i = 1; i <= 4; i++) {", "  total = total + i;", "}", "console.log(total);"],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total = total + ___;\n}",
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
        title: "Looping Through Arrays",
        steps: [
          {
            instruction: "How do you loop through every item in this array?",
            codeSnippet: 'let fruits = ["apple", "banana", "cherry"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}',
            traceQuestion: "What three strings get printed?",
            codeBlocks: ['let fruits = ["apple", "banana", "cherry"];', "for (let i = 0; i < fruits.length; i++) {", "  console.log(fruits[i]);", "}"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'let fruits = ["apple", "banana", "cherry"];\nfor (let i = 0; i < fruits.___; i++) {\n  console.log(fruits[i]);\n}',
            blanks: [
              { position: 0, options: ["length", "size", "count"], correctIndex: 0 },
            ],
            options: ["apple, banana, cherry", "0, 1, 2", "3"],
            correctIndex: 0,
            explanation:
              "fruits.length is 3, so i goes 0, 1, 2. fruits[0] is 'apple', fruits[1] is 'banana', fruits[2] is 'cherry'. Using .length means the loop always fits the array, even if you add more items later.",
          },
          {
            instruction: "What does this for...of loop do?",
            codeSnippet: 'let colors = ["red", "green", "blue"];\nfor (let color of colors) {\n  console.log(color);\n}',
            traceQuestion: "What gets printed?",
            codeBlocks: ['let colors = ["red", "green", "blue"];', "for (let color of colors) {", "  console.log(color);", "}"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'let colors = ["red", "green", "blue"];\nfor (let color ___ colors) {\n  console.log(color);\n}',
            blanks: [
              { position: 0, options: ["of", "in", "from"], correctIndex: 0 },
            ],
            options: ["red, green, blue", "0, 1, 2", "red"],
            correctIndex: 0,
            explanation:
              "for...of is a cleaner way to loop through arrays. Instead of using an index, 'color' directly holds each item. First loop: color='red', second: 'green', third: 'blue'. Simpler and less error-prone.",
          },
          {
            instruction: "What array does .map() produce here?",
            codeSnippet: "let nums = [1, 2, 3];\nlet doubled = nums.map(n => n * 2);\nconsole.log(doubled);",
            traceQuestion: "What is the doubled array?",
            codeBlocks: ["let nums = [1, 2, 3];", "let doubled = nums.map(n => n * 2);", "console.log(doubled);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "let nums = [1, 2, 3];\nlet doubled = nums.map(n => n * ___);",
            blanks: [
              { position: 0, options: ["2", "3", "n"], correctIndex: 0 },
            ],
            options: ["[2, 4, 6]", "[1, 2, 3]", "[3, 6, 9]"],
            correctIndex: 0,
            explanation:
              ".map() creates a NEW array by applying a function to every element. n => n * 2 doubles each number: 1→2, 2→4, 3→6. The original array stays unchanged. Map is a functional programming staple.",
          },
        ],
      },
      {
        level: 3,
        title: "Nested Loops",
        steps: [
          {
            instruction: "How many times does the inner console.log run?",
            codeSnippet: "for (let i = 0; i < 2; i++) {\n  for (let j = 0; j < 3; j++) {\n    console.log(i, j);\n  }\n}",
            traceQuestion: "Total number of outputs?",
            codeBlocks: ["for (let i = 0; i < 2; i++) {", "  for (let j = 0; j < 3; j++) {", "    console.log(i, j);", "  }", "}"],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "for (let i = 0; i < 2; i++) {\n  for (let j = 0; j < ___; j++) {\n    console.log(i, j);\n  }\n}",
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
            codeSnippet: 'let result = "";\nfor (let i = 1; i <= 3; i++) {\n  for (let j = 0; j < i; j++) {\n    result += "*";\n  }\n  result += "\\n";\n}\nconsole.log(result);',
            traceQuestion: "What gets printed?",
            codeBlocks: ['let result = "";', "for (let i = 1; i <= 3; i++) {", '  for (let j = 0; j < i; j++) {', '    result += "*";', "  }", '  result += "\\n";', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: 'for (let i = 1; i <= 3; i++) {\n  for (let j = 0; j < ___; j++) {\n    result += "*";\n  }\n}',
            blanks: [
              { position: 0, options: ["i", "3", "j"], correctIndex: 0 },
            ],
            options: ["*\\n**\\n***", "***\\n***\\n***", "***"],
            correctIndex: 0,
            explanation:
              "When i=1, inner loop runs 1 time: '*'. When i=2, inner runs 2 times: '**'. When i=3: '***'. The \\n adds a new line. This creates a triangle — nested loops are great for 2D patterns!",
          },
          {
            instruction: "What does this grid-builder produce?",
            codeSnippet: "let grid = [];\nfor (let row = 0; row < 2; row++) {\n  grid[row] = [];\n  for (let col = 0; col < 2; col++) {\n    grid[row][col] = row + col;\n  }\n}\nconsole.log(grid);",
            traceQuestion: "What is the final grid array?",
            codeBlocks: ["let grid = [];", "for (let row = 0; row < 2; row++) {", "  grid[row] = [];", "  for (let col = 0; col < 2; col++) {", "    grid[row][col] = row + col;", "  }", "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: "grid[row][col] = row ___ col;",
            blanks: [
              { position: 0, options: ["+", "*", "-"], correctIndex: 0 },
            ],
            options: ["[[0,1],[1,2]]", "[[0,0],[1,1]]", "[[1,2],[3,4]]"],
            correctIndex: 0,
            explanation:
              "Row 0: col 0 → 0+0=0, col 1 → 0+1=1 → [0,1]. Row 1: col 0 → 1+0=1, col 1 → 1+1=2 → [1,2]. Nested loops are perfect for building 2D data structures like grids and game boards.",
          },
        ],
      },
      {
        level: 4,
        title: "While Loops & Break",
        steps: [
          {
            instruction: "When does this while loop stop?",
            codeSnippet: "let count = 10;\nwhile (count > 0) {\n  console.log(count);\n  count = count - 3;\n}",
            traceQuestion: "What numbers get printed?",
            codeBlocks: ["let count = 10;", "while (count > 0) {", "  console.log(count);", "  count = count - 3;", "}"],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "let count = 10;\nwhile (count ___ 0) {\n  count = count - 3;\n}",
            blanks: [
              { position: 0, options: [">", "<", "==="], correctIndex: 0 },
            ],
            options: ["10, 7, 4, 1", "10, 7, 4", "10, 7, 4, 1, -2"],
            correctIndex: 0,
            explanation:
              "count starts at 10. Each round subtracts 3: 10→7→4→1. After printing 1, count becomes -2. Since -2 > 0 is false, the loop stops. While loops check the condition BEFORE each iteration.",
          },
          {
            instruction: "What does 'break' do inside a loop?",
            codeSnippet: "for (let i = 0; i < 10; i++) {\n  if (i === 3) {\n    break;\n  }\n  console.log(i);\n}",
            traceQuestion: "What gets printed?",
            codeBlocks: ["for (let i = 0; i < 10; i++) {", "  if (i === 3) {", "    break;", "  }", "  console.log(i);", "}"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "for (let i = 0; i < 10; i++) {\n  if (i === 3) {\n    ___;\n  }\n}",
            blanks: [
              { position: 0, options: ["break", "continue", "return"], correctIndex: 0 },
            ],
            options: ["0, 1, 2", "0, 1, 2, 3", "0 through 9"],
            correctIndex: 0,
            explanation:
              "'break' immediately exits the loop. When i=3, break runs BEFORE console.log, so 3 is never printed. Only 0, 1, 2 appear. Break is useful for searching — stop as soon as you find what you need.",
          },
          {
            instruction: "What does 'continue' do here?",
            codeSnippet: "for (let i = 0; i < 5; i++) {\n  if (i === 2) {\n    continue;\n  }\n  console.log(i);\n}",
            traceQuestion: "What gets printed?",
            codeBlocks: ["for (let i = 0; i < 5; i++) {", "  if (i === 2) {", "    continue;", "  }", "  console.log(i);", "}"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "if (i === 2) {\n  ___;\n}",
            blanks: [
              { position: 0, options: ["continue", "break", "stop"], correctIndex: 0 },
            ],
            options: ["0, 1, 3, 4", "0, 1", "0, 1, 2, 3, 4"],
            correctIndex: 0,
            explanation:
              "'continue' skips the REST of the current iteration and jumps to the next one. When i=2, it skips console.log and goes straight to i=3. Unlike break, the loop keeps running — it just skips one round.",
          },
        ],
      },
      {
        level: 5,
        title: "Loop Patterns",
        steps: [
          {
            instruction: "What does this .filter() produce?",
            codeSnippet: "let nums = [1, 2, 3, 4, 5, 6];\nlet evens = nums.filter(n => n % 2 === 0);\nconsole.log(evens);",
            traceQuestion: "What is the evens array?",
            codeBlocks: ["let nums = [1, 2, 3, 4, 5, 6];", "let evens = nums.filter(n => n % 2 === 0);", "console.log(evens);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "let evens = nums.filter(n => n % ___ === 0);",
            blanks: [
              { position: 0, options: ["2", "3", "1"], correctIndex: 0 },
            ],
            options: ["[2, 4, 6]", "[1, 3, 5]", "[1, 2, 3, 4, 5, 6]"],
            correctIndex: 0,
            explanation:
              ".filter() creates a new array containing only elements that pass a test. n % 2 === 0 checks if a number is even (divisible by 2). Only 2, 4, and 6 pass, so they become the new array.",
          },
          {
            instruction: "What does .reduce() calculate here?",
            codeSnippet: "let nums = [10, 20, 30];\nlet sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(sum);",
            traceQuestion: "What is sum?",
            codeBlocks: ["let nums = [10, 20, 30];", "let sum = nums.reduce((acc, n) => acc + n, 0);", "console.log(sum);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "let sum = nums.reduce((acc, n) => acc ___ n, 0);",
            blanks: [
              { position: 0, options: ["+", "*", "-"], correctIndex: 0 },
            ],
            options: ["60", "30", "600"],
            correctIndex: 0,
            explanation:
              ".reduce() accumulates a single value from an array. Starting at 0 (the initial value): 0+10=10, 10+20=30, 30+30=60. It 'reduces' the whole array down to one result. Very powerful for totals, averages, etc.",
          },
          {
            instruction: "What does chaining .filter().map() produce?",
            codeSnippet: "let scores = [45, 88, 72, 55, 91];\nlet result = scores\n  .filter(s => s >= 70)\n  .map(s => s + 5);\nconsole.log(result);",
            traceQuestion: "What is result?",
            codeBlocks: ["let scores = [45, 88, 72, 55, 91];", "let result = scores", "  .filter(s => s >= 70)", "  .map(s => s + 5);", "console.log(result);"],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "scores\n  .filter(s => s >= ___)\n  .map(s => s + 5);",
            blanks: [
              { position: 0, options: ["70", "50", "90"], correctIndex: 0 },
            ],
            options: ["[93, 77, 96]", "[88, 72, 91]", "[50, 93, 77, 60, 96]"],
            correctIndex: 0,
            explanation:
              "First, .filter(s >= 70) keeps only 88, 72, 91. Then .map(s + 5) adds 5 to each: 93, 77, 96. Chaining array methods is a powerful pattern — filter what you need, then transform it.",
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
            codeSnippet: 'let temp = 35;\nif (temp > 30) {\n  console.log("Hot!");\n} else {\n  console.log("Nice weather");\n}',
            traceQuestion: "Which branch runs?",
            codeBlocks: ["let temp = 35;", "if (temp > 30) {", '  console.log("Hot!");', "} else {", '  console.log("Nice weather");', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: 'let temp = 35;\nif (temp ___ 30) {\n  console.log("Hot!");\n}',
            blanks: [
              { position: 0, options: [">", "<", "==="], correctIndex: 0 },
            ],
            options: ['"Hot!"', '"Nice weather"', "Both"],
            correctIndex: 0,
            explanation:
              "temp is 35. The condition checks: is 35 > 30? Yes! So the if-block runs and prints 'Hot!'. The else block is skipped entirely. Only ONE branch ever runs.",
          },
          {
            instruction: "What is the output of this code?",
            codeSnippet: 'let age = 15;\nif (age >= 18) {\n  console.log("Can vote");\n} else {\n  console.log("Too young to vote");\n}',
            traceQuestion: "Which message appears?",
            codeBlocks: ["let age = 15;", "if (age >= 18) {", '  console.log("Can vote");', "} else {", '  console.log("Too young to vote");', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: 'if (age >= ___) {\n  console.log("Can vote");\n}',
            blanks: [
              { position: 0, options: ["18", "15", "21"], correctIndex: 0 },
            ],
            options: ['"Too young to vote"', '"Can vote"', "Nothing"],
            correctIndex: 0,
            explanation:
              "age is 15. Is 15 >= 18? No! So the if-block is skipped and the else-block runs: 'Too young to vote'. The >= operator means 'greater than or equal to'.",
          },
          {
            instruction: "What value does 'max' hold?",
            codeSnippet: "let a = 7;\nlet b = 12;\nlet max;\nif (a > b) {\n  max = a;\n} else {\n  max = b;\n}\nconsole.log(max);",
            traceQuestion: "What is max?",
            codeBlocks: ["let a = 7;", "let b = 12;", "let max;", "if (a > b) {", "  max = a;", "} else {", "  max = b;", "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            visualScene: "mountain",
            codeTemplate: "if (a ___ b) {\n  max = a;\n} else {\n  max = b;\n}",
            blanks: [
              { position: 0, options: [">", "<", "==="], correctIndex: 0 },
            ],
            options: ["12", "7", "undefined"],
            correctIndex: 0,
            explanation:
              "Is 7 > 12? No. So the else-block runs: max = b = 12. This is a classic pattern for finding the larger of two values. (Shortcut: Math.max(a, b) does the same thing!)",
          },
        ],
      },
      {
        level: 2,
        title: "Comparison Operators",
        steps: [
          {
            instruction: "What's the difference between == and ===?",
            codeSnippet: 'console.log(5 == "5");   // ?\nconsole.log(5 === "5");  // ?',
            traceQuestion: "What are the two outputs?",
            codeBlocks: ['console.log(5 == "5");', 'console.log(5 === "5");'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'console.log(5 ___ "5"); // true\nconsole.log(5 === "5"); // false',
            blanks: [
              { position: 0, options: ["==", "===", "!="], correctIndex: 0 },
            ],
            options: ["true, false", "true, true", "false, false"],
            correctIndex: 0,
            explanation:
              "== (loose equality) converts types before comparing: 5 and '5' are 'equal enough'. === (strict equality) requires SAME type AND value: number 5 !== string '5'. Always prefer === to avoid surprises.",
          },
          {
            instruction: "What does this comparison evaluate to?",
            codeSnippet: 'let x = 0;\nconsole.log(x !== 0);\nconsole.log(x !== "");',
            traceQuestion: "What are the two results?",
            codeBlocks: ["let x = 0;", "console.log(x !== 0);", 'console.log(x !== "");'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "let x = 0;\nconsole.log(x ___ 0);",
            blanks: [
              { position: 0, options: ["!==", "===", "!="], correctIndex: 0 },
            ],
            options: ["false, true", "true, false", "false, false"],
            correctIndex: 0,
            explanation:
              "!== means 'strictly not equal'. 0 !== 0 is false (they're equal). 0 !== '' is true (different types, and strict comparison). Always use !== instead of != for the same reason you use === over ==.",
          },
          {
            instruction: "Which comparison makes this condition true?",
            codeSnippet: 'let score = 85;\nif (score >= 70 && score < 90) {\n  console.log("Grade B");\n}',
            traceQuestion: "Does 'Grade B' get printed?",
            codeBlocks: ["let score = 85;", "if (score >= 70 && score < 90) {", '  console.log("Grade B");', "}"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "if (score >= 70 ___ score < 90) {",
            blanks: [
              { position: 0, options: ["&&", "||", "!"], correctIndex: 0 },
            ],
            options: ["Yes — 85 is between 70 and 90", "No — one condition fails", "Error"],
            correctIndex: 0,
            explanation:
              "&& means AND — both conditions must be true. Is 85 >= 70? Yes. Is 85 < 90? Yes. Both true, so the whole condition is true. Range checks like this are very common in real code.",
          },
        ],
      },
      {
        level: 3,
        title: "Logical Operators",
        steps: [
          {
            instruction: "What does the && operator do?",
            codeSnippet: "let a = true;\nlet b = false;\nconsole.log(a && b);\nconsole.log(a && true);",
            traceQuestion: "What are the two outputs?",
            codeBlocks: ["let a = true;", "let b = false;", "console.log(a && b);", "console.log(a && true);"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "console.log(true ___ false);",
            blanks: [
              { position: 0, options: ["&&", "||", "!"], correctIndex: 0 },
            ],
            options: ["false, true", "true, true", "false, false"],
            correctIndex: 0,
            explanation:
              "&& (AND) returns true ONLY when BOTH sides are true. true && false = false (one side fails). true && true = true (both pass). Think of it as: 'Are ALL conditions met?'",
          },
          {
            instruction: "What does the || operator do?",
            codeSnippet: "let sunny = false;\nlet warm = true;\nconsole.log(sunny || warm);",
            traceQuestion: "Is the result true or false?",
            codeBlocks: ["let sunny = false;", "let warm = true;", "console.log(sunny || warm);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "console.log(false ___ true);",
            blanks: [
              { position: 0, options: ["||", "&&", "!"], correctIndex: 0 },
            ],
            options: ["true", "false", "Error"],
            correctIndex: 0,
            explanation:
              "|| (OR) returns true when AT LEAST ONE side is true. false || true = true. Only false || false would give false. Think of it as: 'Is ANY condition met?'",
          },
          {
            instruction: "What does the ! operator do?",
            codeSnippet: "let loggedIn = false;\nif (!loggedIn) {\n  console.log(\"Please sign in\");\n}",
            traceQuestion: "Does the message print?",
            codeBlocks: ["let loggedIn = false;", "if (!loggedIn) {", '  console.log("Please sign in");', "}"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "if (___loggedIn) {\n  console.log(\"Please sign in\");\n}",
            blanks: [
              { position: 0, options: ["!", "!!", "~"], correctIndex: 0 },
            ],
            options: ["Yes — !false is true", "No — loggedIn is false", "Error"],
            correctIndex: 0,
            explanation:
              "! (NOT) flips a boolean. !false = true, !true = false. Here, loggedIn is false, so !loggedIn is true, and the if-block runs. Very common pattern: 'if NOT logged in, show login prompt'.",
          },
        ],
      },
      {
        level: 4,
        title: "Else If & Nesting",
        steps: [
          {
            instruction: "Which grade does a score of 82 get?",
            codeSnippet: 'let score = 82;\nlet grade;\nif (score >= 90) {\n  grade = "A";\n} else if (score >= 80) {\n  grade = "B";\n} else if (score >= 70) {\n  grade = "C";\n} else {\n  grade = "F";\n}\nconsole.log(grade);',
            traceQuestion: "What is grade?",
            codeBlocks: ["let score = 82;", "if (score >= 90) {", '  grade = "A";', "} else if (score >= 80) {", '  grade = "B";', "} else if (score >= 70) {", '  grade = "C";', "} else {", '  grade = "F";', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            visualScene: "mountain",
            codeTemplate: 'if (score >= 90) {\n  grade = "A";\n} else if (score >= ___) {\n  grade = "B";\n}',
            blanks: [
              { position: 0, options: ["80", "85", "70"], correctIndex: 0 },
            ],
            options: ['"B"', '"A"', '"C"'],
            correctIndex: 0,
            explanation:
              "82 >= 90? No. 82 >= 80? Yes! So grade = 'B'. Once a condition matches, the rest are skipped — it won't check 82 >= 70 even though that's also true. Order matters in else-if chains!",
          },
          {
            instruction: "What message does this nested condition print?",
            codeSnippet: 'let age = 20;\nlet hasID = false;\n\nif (age >= 18) {\n  if (hasID) {\n    console.log("Entry allowed");\n  } else {\n    console.log("Need ID");\n  }\n} else {\n  console.log("Too young");\n}',
            traceQuestion: "Which message appears?",
            codeBlocks: ["let age = 20;", "let hasID = false;", "if (age >= 18) {", "  if (hasID) {", '    console.log("Entry allowed");', "  } else {", '    console.log("Need ID");', "  }", "} else {", '  console.log("Too young");', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            visualScene: "mountain",
            codeTemplate: "if (age >= 18) {\n  if (___) {\n    // allowed\n  }\n}",
            blanks: [
              { position: 0, options: ["hasID", "age", "true"], correctIndex: 0 },
            ],
            options: ['"Need ID"', '"Entry allowed"', '"Too young"'],
            correctIndex: 0,
            explanation:
              "First check: 20 >= 18? Yes, enter outer if. Second check: hasID is false, so the inner else runs: 'Need ID'. Nested conditions let you check multiple criteria step by step.",
          },
          {
            instruction: "Can you simplify this nested condition?",
            codeSnippet: 'let age = 20;\nlet hasID = true;\n\nif (age >= 18 && hasID) {\n  console.log("Entry allowed");\n} else {\n  console.log("Access denied");\n}',
            traceQuestion: "What does this simplified version print?",
            codeBlocks: ["let age = 20;", "let hasID = true;", "if (age >= 18 && hasID) {", '  console.log("Entry allowed");', "} else {", '  console.log("Access denied");', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: "if (age >= 18 ___ hasID) {",
            blanks: [
              { position: 0, options: ["&&", "||", "!"], correctIndex: 0 },
            ],
            options: ['"Entry allowed"', '"Access denied"', "Error"],
            correctIndex: 0,
            explanation:
              "Using && combines both checks into one line: 20 >= 18 is true AND hasID is true, so the whole condition is true. This is cleaner than nesting. Flatten when you can!",
          },
        ],
      },
      {
        level: 5,
        title: "Switch & Ternary",
        steps: [
          {
            instruction: "What does this switch statement output?",
            codeSnippet: 'let day = "Mon";\nswitch (day) {\n  case "Mon":\n  case "Tue":\n  case "Wed":\n  case "Thu":\n  case "Fri":\n    console.log("Weekday");\n    break;\n  default:\n    console.log("Weekend");\n}',
            traceQuestion: "What gets printed?",
            codeBlocks: ['let day = "Mon";', "switch (day) {", '  case "Mon":', '  case "Fri":', '    console.log("Weekday");', "    break;", "  default:", '    console.log("Weekend");', "}"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            visualScene: "mountain",
            codeTemplate: 'switch (day) {\n  case "Mon":\n    console.log("___");\n    break;\n}',
            blanks: [
              { position: 0, options: ["Weekday", "Weekend", "Monday"], correctIndex: 0 },
            ],
            options: ['"Weekday"', '"Weekend"', '"Mon"'],
            correctIndex: 0,
            explanation:
              "switch matches day against each case. 'Mon' matches the first case. Cases without break 'fall through' to the next — all weekday cases share the same code block. Break stops the fall-through.",
          },
          {
            instruction: "Rewrite this if/else as a ternary:",
            codeSnippet: 'let age = 16;\nlet canDrive = age >= 16 ? "Yes" : "No";\nconsole.log(canDrive);',
            traceQuestion: "What is canDrive?",
            codeBlocks: ["let age = 16;", 'let canDrive = age >= 16 ? "Yes" : "No";', "console.log(canDrive);"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'let canDrive = age >= 16 ? "Yes" ___ "No";',
            blanks: [
              { position: 0, options: [":", "?", "&&"], correctIndex: 0 },
            ],
            options: ['"Yes"', '"No"', "16"],
            correctIndex: 0,
            explanation:
              "The ternary operator: condition ? valueIfTrue : valueIfFalse. 16 >= 16 is true, so canDrive = 'Yes'. Ternaries are great for simple either/or assignments. Don't use them for complex logic — it gets unreadable.",
          },
          {
            instruction: "What does this optional chaining return?",
            codeSnippet: 'let user = { name: "Alex", address: null };\nconsole.log(user.address?.city);',
            traceQuestion: "What is user.address?.city?",
            codeBlocks: ['let user = { name: "Alex", address: null };', "console.log(user.address?.city);"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "console.log(user.address___city);",
            blanks: [
              { position: 0, options: ["?.", ".", ".."], correctIndex: 0 },
            ],
            options: ["undefined", "null", "Error"],
            correctIndex: 0,
            explanation:
              "?. (optional chaining) safely accesses nested properties. Since address is null, normally .city would throw an error. But ?. short-circuits and returns undefined instead. No crash! Very useful for real-world data.",
          },
        ],
      },
    ],
  },
];

export default lessons;
