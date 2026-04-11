/**
 * LESSON DATA — CodeCraft: Mountain Quest Edition
 * =================================================
 * Each concept teaches Python through building a mountain climbing game.
 * The user IS the game developer — every lesson writes real game code.
 *
 * EXTENSIBILITY: To add a new concept, just add a new object to the array below.
 * Include an `intro` object and `sceneId` per level. No component code changes needed.
 *
 * Step fields:
 *   instruction        — generic fallback instruction
 *   instructions       — { codeSimulation, dragDrop, speedCoding } per-modality overrides
 *   gameAction         — tells the scene WHAT to animate (e.g., "heroClimbSteps")
 *   sceneConfig        — optional config for the scene (itemEmoji, statChange, etc.)
 *   codeSnippet        — for Code Simulation mode
 *   traceQuestion      — question shown in Code Simulation
 *   codeBlocks         — for Drag & Drop mode
 *   correctOrder       — correct arrangement of code blocks
 *   visualScene        — (legacy) scene hint for drag-drop visual
 *   codeTemplate       — for Speed Coding mode (blanks shown as ___)
 *   blanks             — array of { position, options, correctIndex }
 *   options            — multiple choice answers
 *   correctIndex       — index of correct answer
 *   explanation         — shown after answering
 *   storyContext       — narrative framing text (optional)
 */

const lessons = [
  // ==========================================
  // CONCEPT 1: VARIABLES — "Setting Up the Game"
  // ==========================================
  {
    id: "variables",
    title: "Variables",
    concept: "Setting Up the Game",
    icon: "x=",
    color: "from-cyan-500 to-blue-600",
    description: "Every game starts with data — create your hero and set up the world.",
    intro: {
      whyItMatters: "Every game stores data — your hero's name, health, score. Variables are the containers that hold it all.",
      codePreview: 'hero_name = "{heroName}"\nhero_hp = 100\nprint(hero_name)',
      funFact: "Every app you've ever used relies on variables — from TikTok to Spotify.",
    },
    levels: [
      // --- VARIABLES LEVEL 1: Create Your Hero ---
      {
        level: 1,
        title: "Create Your Hero",
        sceneId: "hero-spawn",
        completion: {
          message: "Your hero is alive! You created variables to store a name, set health points, and built a title screen.",
          tip: "Variables are like labeled containers — they hold data your game needs to remember.",
          nextPreview: "Next up: Learn about data types — integers, strings, and more!",
        },
        steps: [
          {
            instruction: "Your Mountain Quest game needs a hero. Let's create one!",
            instructions: {
              codeSimulation: "Trace through this code — what name does your hero get?",
              dragDrop: "Arrange the code to create your hero and display their name.",
              speedCoding: "Complete the code to set your hero's name.",
            },
            gameAction: "heroNameSet",
            storyContext: "Every game starts with a hero. Let's write the code that creates yours.",
            codeSnippet: 'hero_name = "{heroName}"\nprint(hero_name)',
            traceQuestion: "What name gets printed?",
            codeBlocks: ['hero_name = "{heroName}"', "print(hero_name)"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: '___ = "{heroName}"\nprint(___)',
            blanks: [
              { position: 0, options: ["hero_name", "123", "print"], correctIndex: 0 },
              { position: 1, options: ["hero_name", '"{heroName}"', "print"], correctIndex: 0 },
            ],
            options: ['"{heroName}"', "hero_name", "None"],
            correctIndex: 0,
            hint: "Look at line 1 — what text value is assigned to hero_name?",
            explanation:
              'Variables store values. hero_name = "{heroName}" creates a container called hero_name holding the text "{heroName}". print() displays it.',
          },
          {
            instruction: "Now give your hero a starting health of 100.",
            instructions: {
              codeSimulation: "Your hero's health gets updated. What is the final value?",
              dragDrop: "Arrange the code to set and then update your hero's health.",
              speedCoding: "Complete the code to set your hero's starting health.",
            },
            gameAction: "heroStatsInit",
            sceneConfig: { statChange: "+100 HP" },
            storyContext: "Heroes need health points to survive the mountain climb.",
            codeSnippet: "hero_hp = 0\nhero_hp = 100\nprint(hero_hp)",
            traceQuestion: "What is hero_hp after this code runs?",
            codeBlocks: ["hero_hp = 0", "hero_hp = 100", "print(hero_hp)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "hero_hp = 0\nhero_hp = ___\nprint(hero_hp)",
            blanks: [
              { position: 0, options: ["100", "0", "hero_hp"], correctIndex: 0 },
            ],
            options: ["100", "0", "Error"],
            correctIndex: 0,
            hint: "hero_hp is assigned twice — when a variable is assigned twice, only the last value counts.",
            explanation:
              "Variables can be reassigned. hero_hp starts as 0, then gets overwritten to 100. The latest assignment wins — Python replaces the old value with the new one.",
          },
          {
            instruction: "Set up the game title and display it before the adventure begins.",
            instructions: {
              codeSimulation: "The game displays two messages. What are they?",
              dragDrop: "Arrange the code to show the game title, then update it.",
              speedCoding: "Complete the code to set the game's welcome message.",
            },
            gameAction: "heroDataStore",
            storyContext: "Let's build the title screen for Mountain Quest.",
            codeSnippet: 'title = "Mountain Quest"\nprint(title)\ntitle = "Mountain Quest: The Climb"\nprint(title)',
            traceQuestion: "What are the two outputs?",
            codeBlocks: ['title = "Mountain Quest"', "print(title)", 'title = "Mountain Quest: The Climb"', "print(title)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'title = "Mountain Quest"\nprint(title)\ntitle = "Mountain Quest: ___"\nprint(title)',
            blanks: [
              { position: 0, options: ["The Climb", "Game Over", "title"], correctIndex: 0 },
            ],
            options: ["Mountain Quest then Mountain Quest: The Climb", "Mountain Quest: The Climb twice", "Mountain Quest twice"],
            correctIndex: 0,
            hint: "The first print() runs while title is still the short name. Then title changes — what does the second print() see?",
            explanation:
              "The first print() runs when title is still \"Mountain Quest\". Then title gets reassigned, so the second print() outputs the new value. Code runs top to bottom, one line at a time.",
          },
        ],
      },

      // --- VARIABLES LEVEL 2: Hero Stats ---
      {
        level: 2,
        title: "Hero Stats & Types",
        sceneId: "mountain-camp",
        completion: {
          message: "You mastered data types! Your hero now has typed stats — integers for HP, strings for names, and expressions for XP.",
          tip: "Python has int, float, str, and bool. Using the wrong type is the #1 cause of bugs in games!",
          nextPreview: "Next: Build dynamic game messages with f-strings and string methods!",
        },
        steps: [
          {
            instruction: "Your hero needs numerical stats. What type is hero_hp?",
            instructions: {
              codeSimulation: "Check what data type Python uses for your hero's health.",
              dragDrop: "Arrange the code to define and check your hero's HP type.",
              speedCoding: "Complete the code to set your hero's HP as a number.",
            },
            gameAction: "heroStoreData",
            sceneConfig: { statChange: "HP: integer" },
            codeSnippet: "hero_hp = 100\nprint(type(hero_hp))",
            traceQuestion: "What does type(hero_hp) return?",
            codeBlocks: ["hero_hp = 100", "print(type(hero_hp))"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "hero_hp = ___\nprint(type(hero_hp))",
            blanks: [
              { position: 0, options: ["100", '"100"', "True"], correctIndex: 0 },
            ],
            options: ["<class 'int'>", "<class 'str'>", "<class 'bool'>"],
            correctIndex: 0,
            hint: "Health points are whole numbers — no quotes around them. Look at the three options: one has quotes (making it text), one is True/False. Which option is a plain number?",
            explanation:
              "100 is an integer (int) — a whole number with no quotes. \"100\" would be a string. Python has several types: int, float, str, bool.",
          },
          {
            instruction: "Your hero gains XP after a battle. Update the score!",
            instructions: {
              codeSimulation: "Your hero earned XP! Trace through to find the new total.",
              dragDrop: "Arrange the code to calculate your hero's new XP total.",
              speedCoding: "Your hero earned 30 XP in this battle. Complete the code to add exactly 30 to their score.",
            },
            gameAction: "heroCollectItem",
            sceneConfig: { statChange: "+30 XP", itemEmoji: "⭐", itemName: "XP orb" },
            codeSnippet: "hero_xp = 50\nhero_xp = hero_xp + 30\nprint(hero_xp)",
            traceQuestion: "What is hero_xp after the battle?",
            codeBlocks: ["hero_xp = 50", "hero_xp = hero_xp + 30", "print(hero_xp)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "hero_xp = 50\nhero_xp = hero_xp + ___\nprint(hero_xp)",
            blanks: [
              { position: 0, options: ["30", "50", "80"], correctIndex: 0 },
            ],
            options: ["80", "50", "30"],
            correctIndex: 0,
            hint: "hero_xp = hero_xp + ___ means 'current XP plus the battle reward'. Look at the scene description — how much XP did this battle award?",
            explanation:
              "hero_xp starts as 50. Then hero_xp = hero_xp + 30 means 'take current hero_xp (50), add 30, store result back'. So hero_xp becomes 80.",
          },
          {
            instruction: "Combine your hero's name with a title for the victory screen.",
            instructions: {
              codeSimulation: "Trace through this string concatenation — what message appears?",
              dragDrop: "Arrange the code to build the victory message.",
              speedCoding: "Complete the code to join your hero's name with a title.",
            },
            gameAction: "heroDataStore",
            codeSnippet: 'name = "{heroName}"\ntitle = " the Brave"\nfull_title = name + title\nprint(full_title)',
            traceQuestion: "What is full_title?",
            codeBlocks: ['name = "{heroName}"', 'title = " the Brave"', "full_title = name + title", "print(full_title)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: 'name = "{heroName}"\ntitle = " the Brave"\nfull_title = name ___ title\nprint(full_title)',
            blanks: [
              { position: 0, options: ["+", "-", "*"], correctIndex: 0 },
            ],
            options: ['"{heroName} the Brave"', '"{heroName}theBrave"', "Error"],
            correctIndex: 0,
            hint: "The + operator joins strings. Notice ' the Brave' starts with a space — that space will appear in the result.",
            explanation:
              "When you use + with strings, Python concatenates (joins) them. '{heroName}' + ' the Brave' = '{heroName} the Brave'. Notice the space at the start of ' the Brave'.",
          },
        ],
      },

      // --- VARIABLES LEVEL 3: Game Text System ---
      {
        level: 3,
        title: "Building the Game Display",
        sceneId: "mountain-camp",
        completion: {
          message: "Your game can now talk! F-strings, len(), and .upper() let you build dynamic, personalized game text.",
          tip: "f-strings are Python's most popular way to build messages — used by 90% of Python developers.",
          nextPreview: "Next: Build an inventory system with Python lists!",
        },
        steps: [
          {
            instruction: "Build a dynamic game message using f-strings!",
            instructions: {
              codeSimulation: "Trace the f-string — what message does the game display?",
              dragDrop: "Arrange the code to create a dynamic game message.",
              speedCoding: "Complete the f-string to display your hero's greeting.",
            },
            gameAction: "heroDataStore",
            storyContext: "Games need to display personalized messages. F-strings make this easy.",
            codeSnippet: 'hero = "{heroName}"\nmsg = f"Welcome, {hero}! Your quest begins."\nprint(msg)',
            traceQuestion: "What message gets displayed?",
            codeBlocks: ['hero = "{heroName}"', 'msg = f"Welcome, {hero}! Your quest begins."', "print(msg)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'hero = "{heroName}"\nmsg = f"Welcome, {___}! Your quest begins."',
            blanks: [
              { position: 0, options: ["hero", '"hero"', "{heroName}"], correctIndex: 0 },
            ],
            options: ['"Welcome, {heroName}! Your quest begins."', '"Welcome, {hero}! Your quest begins."', '"Welcome, hero! Your quest begins."'],
            correctIndex: 0,
            hint: "In an f-string, {hero} gets replaced with whatever value is stored in the hero variable.",
            explanation:
              "f-strings start with f before the quote. Inside curly braces, Python inserts the variable's value. This is how games build dynamic text — every message can be personalized!",
          },
          {
            instruction: "Use len() to count the number of characters in your hero's name.",
            instructions: {
              codeSimulation: "What number does len() return for your hero's name?",
              dragDrop: "Arrange the code to measure and display the hero's name length.",
              speedCoding: "Complete the code to count how many characters are in your hero's name using len().",
            },
            gameAction: "heroStoreData",
            codeSnippet: 'hero = "{heroName}"\nname_length = len(hero)\nprint(f"Name: {hero} ({name_length} chars)")',
            traceQuestion: "What gets displayed?",
            codeBlocks: ['hero = "{heroName}"', "name_length = len(hero)", 'print(f"Name: {hero} ({name_length} chars)")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'hero = "{heroName}"\nname_length = ___(hero)',
            blanks: [
              { position: 0, options: ["len", "size", "count"], correctIndex: 0 },
            ],
            options: ['{heroName} with character count', "Error", "Just the name"],
            correctIndex: 0,
            hint: "len() counts the characters in hero's name, then the f-string builds a message showing both the name and the count.",
            explanation:
              "len() counts the number of characters in a string. Games use len() for things like checking if a username is too long or measuring text for the UI.",
          },
          {
            instruction: "Create a battle cry command for your hero!",
            instructions: {
              codeSimulation: "What does .upper() do to the battle cry?",
              dragDrop: "Arrange the code to create and shout the battle cry.",
              speedCoding: "Complete the code to make the battle cry ALL CAPS.",
            },
            gameAction: "heroLearnSkill",
            sceneConfig: { itemEmoji: "📣", itemName: "Battle Cry skill" },
            codeSnippet: 'cry = "charge"\nprint(cry.upper())',
            traceQuestion: "What gets printed?",
            codeBlocks: ['cry = "charge"', "print(cry.upper())"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'cry = "charge"\nprint(cry.___())',
            blanks: [
              { position: 0, options: ["upper", "up", "capitalize"], correctIndex: 0 },
            ],
            options: ['"CHARGE"', '"Charge"', '"charge"'],
            correctIndex: 0,
            hint: ".upper() converts every letter to UPPERCASE. What does \"charge\" look like in all caps?",
            explanation:
              ".upper() converts every character to uppercase — perfect for battle cries and alert messages in games! The original variable stays unchanged.",
          },
        ],
      },

      // --- VARIABLES LEVEL 4: Inventory System ---
      {
        level: 4,
        title: "Building the Inventory",
        sceneId: "mountain-camp",
        completion: {
          message: "Inventory system built! You used lists to store items, .append() to add new ones, and slicing to access ranges.",
          tip: "Lists are zero-indexed — the first item is always at position 0. Even senior devs forget this sometimes!",
          nextPreview: "Next: Create your full hero profile using dictionaries!",
        },
        steps: [
          {
            instruction: "Create your hero's starting inventory as a list!",
            instructions: {
              codeSimulation: "Your hero picks up items. What's the first item in the list?",
              dragDrop: "Arrange the code to create the inventory and check the first item.",
              speedCoding: "Complete the code to access the first inventory item.",
            },
            gameAction: "heroBuildInventory",
            sceneConfig: { itemEmoji: "🎒", statChange: "Inventory: 3 items" },
            codeSnippet: 'inventory = ["sword", "shield", "potion"]\nprint(inventory[0])',
            traceQuestion: "What item gets printed?",
            codeBlocks: ['inventory = ["sword", "shield", "potion"]', "print(inventory[0])"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'inventory = ["sword", "shield", "potion"]\nprint(inventory[___])',
            blanks: [
              { position: 0, options: ["0", "1", "3"], correctIndex: 0 },
            ],
            options: ['"sword"', '"shield"', '"potion"'],
            correctIndex: 0,
            hint: "Lists start counting from 0. inventory[0] is the FIRST item in the list.",
            explanation:
              "Lists are zero-indexed — the first item is at position 0. inventory[0] is 'sword'. This catches many beginners — games count from 0!",
          },
          {
            instruction: "Your hero found a new item on the trail! Add it to inventory.",
            instructions: {
              codeSimulation: "After finding a map, what does the inventory look like?",
              dragDrop: "Arrange the code to add a new item to the inventory.",
              speedCoding: "Complete the code to add 'map' to the inventory.",
            },
            gameAction: "heroCollectItem",
            sceneConfig: { itemEmoji: "🗺️", itemName: "a map", statChange: "+1 item" },
            codeSnippet: 'inventory = ["sword", "shield"]\ninventory.append("map")\nprint(inventory)',
            traceQuestion: "What is the inventory after append?",
            codeBlocks: ['inventory = ["sword", "shield"]', 'inventory.append("map")', "print(inventory)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'inventory = ["sword", "shield"]\ninventory.___("map")',
            blanks: [
              { position: 0, options: ["append", "add", "insert"], correctIndex: 0 },
            ],
            options: ['["sword", "shield", "map"]', '["map", "sword", "shield"]', '["sword", "shield"]'],
            correctIndex: 0,
            hint: ".append() always adds the new item to the END of the list.",
            explanation:
              ".append() adds an item to the END of a list. The inventory grows by one — just like picking up items in a real game!",
          },
          {
            instruction: "Check a range of items in the inventory using slicing.",
            instructions: {
              codeSimulation: "What slice of the inventory do we get?",
              dragDrop: "Arrange the code to slice the inventory and see specific items.",
              speedCoding: "Complete the code to get items at positions 1 through 3.",
            },
            gameAction: "heroStoreData",
            codeSnippet: 'items = ["sword", "shield", "potion", "map", "rope"]\nprint(items[1:4])',
            traceQuestion: "What slice do we get?",
            codeBlocks: ['items = ["sword", "shield", "potion", "map", "rope"]', "print(items[1:4])"],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'items = ["sword", "shield", "potion", "map", "rope"]\nprint(items[1:___])',
            blanks: [
              { position: 0, options: ["4", "3", "5"], correctIndex: 0 },
            ],
            options: ['["shield", "potion", "map"]', '["sword", "shield", "potion", "map"]', '["shield", "potion"]'],
            correctIndex: 0,
            hint: "items[1:4] gives indices 1, 2, 3 — the stop number (4) is NOT included.",
            explanation:
              "Slicing with [start:stop] gives elements from index 'start' up to but NOT including 'stop'. items[1:4] gives indices 1, 2, 3. The stop index is always excluded.",
          },
        ],
      },

      // --- VARIABLES LEVEL 5: Hero Profile (Dictionaries) ---
      {
        level: 5,
        title: "The Hero Profile",
        sceneId: "mountain-camp",
        completion: {
          message: "Hero profile complete! Dictionaries let you store complex game data with named keys — like a real game engine.",
          tip: "Dictionaries are Python's most versatile data structure. Every JSON API you'll ever use works like a dictionary!",
          nextPreview: "Variables mastered! Next concept: Loops — make your hero climb the mountain!",
        },
        steps: [
          {
            instruction: "Build your hero's full profile as a dictionary!",
            instructions: {
              codeSimulation: "Look up your hero's name from the profile dictionary.",
              dragDrop: "Arrange the code to create the hero profile and access the name.",
              speedCoding: "Complete the code to look up your hero's name.",
            },
            gameAction: "heroStoreData",
            sceneConfig: { statChange: "Profile created!" },
            codeSnippet: 'hero = {"name": "{heroName}", "hp": 100, "level": 1}\nprint(hero["name"])',
            traceQuestion: "What gets printed?",
            codeBlocks: ['hero = {"name": "{heroName}", "hp": 100, "level": 1}', 'print(hero["name"])'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: 'hero = {"name": "{heroName}", "hp": 100}\nprint(hero["___"])',
            blanks: [
              { position: 0, options: ["name", "hp", "0"], correctIndex: 0 },
            ],
            options: ['"{heroName}"', "100", "Error"],
            correctIndex: 0,
            hint: 'hero["name"] looks up the value stored under the key "name" in the dictionary.',
            explanation:
              'Dictionaries store key-value pairs. hero["name"] returns "{heroName}". Unlike lists, dictionaries use keys (names) instead of numbered indices. Perfect for game entity data!',
          },
          {
            instruction: "Your hero leveled up! Update the profile.",
            instructions: {
              codeSimulation: "After the level-up code runs, what does the profile look like?",
              dragDrop: "Arrange the code to update your hero's level in the profile.",
              speedCoding: "Complete the code to set your hero's level to 2.",
            },
            gameAction: "heroCollectItem",
            sceneConfig: { statChange: "Level UP!", itemEmoji: "⬆️", itemName: "a level up" },
            codeSnippet: 'hero = {"name": "{heroName}", "hp": 100, "level": 1}\nhero["level"] = 2\nprint(hero)',
            traceQuestion: "What is the updated profile?",
            codeBlocks: ['hero = {"name": "{heroName}", "hp": 100, "level": 1}', 'hero["level"] = 2', "print(hero)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'hero["level"] = ___',
            blanks: [
              { position: 0, options: ["2", "1", "level"], correctIndex: 0 },
            ],
            options: ['{"name": "{heroName}", "hp": 100, "level": 2}', '{"name": "{heroName}", "hp": 100, "level": 1}', "Error"],
            correctIndex: 0,
            hint: 'hero["level"] = 2 overwrites the old level value. The rest of the dictionary stays unchanged.',
            explanation:
              'You update dictionary values by assigning to their key. hero["level"] = 2 replaces 1 with 2. This is exactly how games track player stats!',
          },
          {
            instruction: "Convert user input for the game's difficulty selector.",
            instructions: {
              codeSimulation: "The player types a difficulty number. What does int() do?",
              dragDrop: "Arrange the code to convert text input into a number.",
              speedCoding: "Complete the code to convert the text input to a number.",
            },
            gameAction: "heroLearnSkill",
            sceneConfig: { itemEmoji: "🔧", itemName: "type conversion" },
            codeSnippet: 'difficulty = "3"\nlevel = int(difficulty)\nprint(level + 1)',
            traceQuestion: "What is the final output?",
            codeBlocks: ['difficulty = "3"', "level = int(difficulty)", "print(level + 1)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'difficulty = "3"\nlevel = ___(difficulty)\nprint(level + 1)',
            blanks: [
              { position: 0, options: ["int", "str", "float"], correctIndex: 0 },
            ],
            options: ["4", '"31"', "Error"],
            correctIndex: 0,
            hint: 'int() converts "3" from text to the number 3. Then 3 + 1 = ?',
            explanation:
              'int() converts a string to an integer. "3" is text, but int("3") becomes the number 3. Then 3 + 1 = 4. Games always need to convert player input from text to numbers!',
          },
        ],
      },
    ],
  },

  // ==========================================
  // CONCEPT 2: LOOPS — "The Climb Begins"
  // ==========================================
  {
    id: "loops",
    title: "Loops",
    concept: "The Climb Begins",
    icon: "for",
    color: "from-violet-500 to-purple-600",
    description: "Make your hero climb, fight, and collect — all with the power of loops.",
    intro: {
      whyItMatters: "Want your hero to climb 10 mountain steps? Loops repeat code so you don't write the same line 10 times.",
      codePreview: "for step in range(5):\n    climb()\n    print(f\"Step {step}!\")",
      funFact: "Video game engines run a loop 60 times per second to animate everything on screen.",
    },
    levels: [
      // --- LOOPS LEVEL 1: Climbing Steps ---
      {
        level: 1,
        title: "Climbing the Mountain",
        sceneId: "mountain-trail",
        completion: {
          message: "Your hero is climbing! For loops with range() let you repeat actions — like taking steps up a mountain.",
          tip: "range(n) always starts at 0 and stops BEFORE n. range(5) gives 0,1,2,3,4 — that's 5 numbers!",
          nextPreview: "Next: Loop through lists to collect trail items!",
        },
        steps: [
          {
            instruction: "Write a loop to make your hero climb 3 mountain steps!",
            instructions: {
              codeSimulation: "Trace through the climb loop — what step numbers does {heroName} take?",
              dragDrop: "Arrange the code to make {heroName} climb 3 steps.",
              speedCoding: "The hero needs to climb exactly 3 steps. What value goes in range() to make the loop run 3 times?",
            },
            gameAction: "heroClimbSteps",
            storyContext: "The mountain has many steps. Loops let your hero climb them automatically.",
            codeSnippet: "for step in range(3):\n    print(f\"Climbing step {step}\")",
            traceQuestion: "What step numbers get printed?",
            codeBlocks: ["for step in range(3):", '    print(f"Climbing step {step}")'],
            correctOrder: [0, 1],
            visualScene: "mountain",
            codeTemplate: "for step in range(___):\n    print(f\"Climbing step {step}\")",
            blanks: [
              { position: 0, options: ["3", "2", "4"], correctIndex: 0 },
            ],
            options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"],
            correctIndex: 0,
            hint: "range(n) runs the loop exactly n times. The hero needs to climb 3 steps — so what number goes in range()?",
            explanation:
              "range(3) generates 0, 1, 2 — it starts at 0 and stops BEFORE 3. So the loop runs 3 times. This is how games animate step-by-step movement!",
          },
          {
            instruction: "Your hero earns double XP for each step. Calculate the rewards!",
            instructions: {
              codeSimulation: "Trace the XP calculation for each step — what are the five rewards?",
              dragDrop: "Arrange the code to calculate XP rewards for each step.",
              speedCoding: "Each step earns the hero XP based on a multiplier. What multiplier means 'double'?",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "⭐" },
            codeSnippet: "for step in range(1, 6):\n    xp = step * 2\n    print(f\"Step {step}: +{xp} XP\")",
            traceQuestion: "What are the five XP rewards?",
            codeBlocks: ["for step in range(1, 6):", "    xp = step * 2", '    print(f"Step {step}: +{xp} XP")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "for step in range(1, 6):\n    xp = step * ___",
            blanks: [
              { position: 0, options: ["2", "1", "6"], correctIndex: 0 },
            ],
            options: ["2, 4, 6, 8, 10", "1, 2, 3, 4, 5", "2, 4, 6, 8"],
            correctIndex: 0,
            hint: "The formula is xp = step * ___. The word 'double' in the instruction tells you what the multiplier should be — what does doubling a number mean mathematically?",
            explanation:
              "range(1, 6) gives 1, 2, 3, 4, 5. Each step earns step * 2 XP. Loops are powerful — 3 lines of code produced 5 rewards!",
          },
          {
            instruction: "Calculate the total gold collected across all trail sections.",
            instructions: {
              codeSimulation: "Your hero picks up gold on each trail section. What's the total?",
              dragDrop: "Arrange the code to sum up gold from each trail section.",
              speedCoding: "Complete the accumulator loop to total up the gold.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "🪙" },
            codeSnippet: "total_gold = 0\nfor section in range(1, 5):\n    total_gold = total_gold + section\nprint(f\"Total gold: {total_gold}\")",
            traceQuestion: "What is the total gold?",
            codeBlocks: ["total_gold = 0", "for section in range(1, 5):", "    total_gold = total_gold + section", 'print(f"Total gold: {total_gold}")'],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "total_gold = 0\nfor section in range(1, 5):\n    total_gold = total_gold + ___",
            blanks: [
              { position: 0, options: ["section", "1", "total_gold"], correctIndex: 0 },
            ],
            options: ["10", "4", "6"],
            correctIndex: 0,
            hint: "Track the running total: 0+1=1, 1+2=3, 3+3=6, 6+4=?",
            explanation:
              "This accumulator pattern sums 1+2+3+4 = 10 gold. Round by round: 0+1=1, 1+2=3, 3+3=6, 6+4=10. Games use this pattern to calculate scores, damage totals, and more.",
          },
        ],
      },

      // --- LOOPS LEVEL 2: Collecting Items ---
      {
        level: 2,
        title: "Trail Item Collection",
        sceneId: "mountain-trail",
        completion: {
          message: "Item collection mastered! for...in loops, enumerate(), and list comprehensions are your trail-walking tools.",
          tip: "List comprehensions are uniquely Pythonic — most languages don't have them. They're a Python superpower!",
          nextPreview: "Next: Fight enemy waves with nested loops!",
        },
        steps: [
          {
            instruction: "Loop through items on the trail and pick each one up!",
            instructions: {
              codeSimulation: "Your hero walks the trail. What items does {heroName} find?",
              dragDrop: "Arrange the code to loop through trail items.",
              speedCoding: "Complete the loop to iterate over the items list.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "🎒" },
            codeSnippet: 'trail_items = ["gem", "potion", "key"]\nfor item in trail_items:\n    print(f"Found: {item}!")',
            traceQuestion: "What three items does the hero find?",
            codeBlocks: ['trail_items = ["gem", "potion", "key"]', "for item in trail_items:", '    print(f"Found: {item}!")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'trail_items = ["gem", "potion", "key"]\nfor item ___ trail_items:\n    print(f"Found: {item}!")',
            blanks: [
              { position: 0, options: ["in", "of", "from"], correctIndex: 0 },
            ],
            options: ["gem, potion, key", "0, 1, 2", "3"],
            correctIndex: 0,
            hint: "The loop variable 'item' takes each value from the list in order, from left to right.",
            explanation:
              "Python's for...in loop iterates directly over list items. 'item' takes each value: first 'gem', then 'potion', then 'key'. No index needed — clean and readable.",
          },
          {
            instruction: "Track which trail position each item was found at.",
            instructions: {
              codeSimulation: "enumerate() gives position AND item. What's the output?",
              dragDrop: "Arrange the code to show position numbers alongside items.",
              speedCoding: "Complete the code to get both position and item name.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "📍" },
            codeSnippet: 'items = ["gem", "shield", "scroll"]\nfor pos, item in enumerate(items):\n    print(f"Position {pos}: {item}")',
            traceQuestion: "What gets printed?",
            codeBlocks: ['items = ["gem", "shield", "scroll"]', "for pos, item in enumerate(items):", '    print(f"Position {pos}: {item}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'for pos, item in ___(items):\n    print(f"Position {pos}: {item}")',
            blanks: [
              { position: 0, options: ["enumerate", "range", "list"], correctIndex: 0 },
            ],
            options: ["0 gem, 1 shield, 2 scroll", "gem, shield, scroll", "0, 1, 2"],
            correctIndex: 0,
            hint: "enumerate() gives (index, item) pairs. The first pair is (0, 'gem'), the second is (1, 'shield').",
            explanation:
              "enumerate() gives you both the index AND the item. It's like a trail map — you know the position and what's there. Very useful for inventory management!",
          },
          {
            instruction: "Double the power of all collected gems using a list comprehension!",
            instructions: {
              codeSimulation: "Trace through — what are the doubled gem values?",
              dragDrop: "Arrange the code to create a doubled power list.",
              speedCoding: "Complete the list comprehension to double each gem's power.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "💎" },
            codeSnippet: "gem_power = [5, 10, 15]\nboosted = [g * 2 for g in gem_power]\nprint(boosted)",
            traceQuestion: "What is the boosted list?",
            codeBlocks: ["gem_power = [5, 10, 15]", "boosted = [g * 2 for g in gem_power]", "print(boosted)"],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "boosted = [g * ___ for g in gem_power]",
            blanks: [
              { position: 0, options: ["2", "3", "g"], correctIndex: 0 },
            ],
            options: ["[10, 20, 30]", "[5, 10, 15]", "[15, 30, 45]"],
            correctIndex: 0,
            hint: "Multiply each number in gem_power by 2: 5×2=10, 10×2=20, 15×2=30.",
            explanation:
              "List comprehensions are Python's elegant one-liner for transforming lists. [g * 2 for g in gem_power] doubles each value. Games use this for batch calculations like power-ups!",
          },
        ],
      },

      // --- LOOPS LEVEL 3: Enemy Waves ---
      {
        level: 3,
        title: "Fighting Enemy Waves",
        sceneId: "mountain-battle",
        completion: {
          message: "Enemy waves defeated! Nested loops multiply iterations — perfect for grids, maps, and battle formations.",
          tip: "Nested loops run inner × outer times. A 10×10 grid = 100 iterations. Game maps use this exact pattern!",
          nextPreview: "Next: While loops and break/continue for training!",
        },
        steps: [
          {
            instruction: "The enemy formation has 2 rows with 3 enemies in each row. Write a nested loop to attack every enemy!",
            instructions: {
              codeSimulation: "2 rows × 3 enemies each — count the total attacks in this nested loop battle.",
              dragDrop: "Arrange the nested loop that attacks 2 rows of 3 enemies each.",
              speedCoding: "The inner loop attacks every enemy in a single row. Look at the grid structure — what should range() equal for the columns?",
            },
            gameAction: "heroFightWave",
            codeSnippet: "for row in range(2):\n    for col in range(3):\n        print(f\"Attack ({row},{col})!\")",
            traceQuestion: "Total number of attacks?",
            codeBlocks: ["for row in range(2):", "    for col in range(3):", '        print(f"Attack ({row},{col})!")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "# 2 rows, 3 enemies per row\nfor row in range(2):\n    for col in range(___):\n        print(f\"Attack!\")",
            blanks: [
              { position: 0, options: ["3", "2", "6"], correctIndex: 0 },
            ],
            options: ["6 attacks", "5 attacks", "2 attacks"],
            correctIndex: 0,
            hint: "The outer loop uses range(2) for 2 rows. The inner loop mirrors that idea — look at the instruction to find how many enemies are in each row, then use that number for range().",
            explanation:
              "Outer loop runs 2 times, inner runs 3 times each. Total: 2 × 3 = 6 attacks. Nested loops multiply — games use them for grids, maps, and enemy formations!",
          },
          {
            instruction: "Draw a power meter that grows with each level!",
            instructions: {
              codeSimulation: "What pattern does this power meter draw?",
              dragDrop: "Arrange the code to build a growing power meter.",
              speedCoding: "Complete the code to make the meter grow each row.",
            },
            gameAction: "heroClimbSteps",
            codeSnippet: 'for level in range(1, 4):\n    meter = "█" * level\n    print(f"Power: {meter}")',
            traceQuestion: "What does the meter look like?",
            codeBlocks: ["for level in range(1, 4):", '    meter = "█" * level', '    print(f"Power: {meter}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'for level in range(1, 4):\n    meter = "█" * ___',
            blanks: [
              { position: 0, options: ["level", "3", "1"], correctIndex: 0 },
            ],
            options: ["█, ██, ███", "███, ███, ███", "███"],
            correctIndex: 0,
            hint: "'█' * level copies the block 'level' times. level=1 gives █, level=2 gives ██, level=3 gives ███.",
            explanation:
              "String multiplication: '█' * 3 gives '███'. Each level grows the meter. This is how games draw health bars and progress indicators!",
          },
          {
            instruction: "Build a 2D game map using nested loops!",
            instructions: {
              codeSimulation: "Trace through the map builder — what grid is created?",
              dragDrop: "Arrange the code to build a 2×2 game grid.",
              speedCoding: "Complete the code to fill each cell with row + col.",
            },
            gameAction: "heroStoreData",
            codeSnippet: "game_map = []\nfor row in range(2):\n    game_map.append([])\n    for col in range(2):\n        game_map[row].append(row + col)\nprint(game_map)",
            traceQuestion: "What is the final map?",
            codeBlocks: ["game_map = []", "for row in range(2):", "    game_map.append([])", "    for col in range(2):", "        game_map[row].append(row + col)", "print(game_map)"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "game_map[row].append(row ___ col)",
            blanks: [
              { position: 0, options: ["+", "*", "-"], correctIndex: 0 },
            ],
            options: ["[[0, 1], [1, 2]]", "[[0, 0], [1, 1]]", "[[1, 2], [3, 4]]"],
            correctIndex: 0,
            hint: "Each cell value = row + col. Row 0: [0+0, 0+1]. Row 1: [1+0, 1+1].",
            explanation:
              "Nested loops build 2D structures. Row 0: 0+0=0, 0+1=1. Row 1: 1+0=1, 1+1=2. This is exactly how game engines generate tile maps and terrain!",
          },
        ],
      },

      // --- LOOPS LEVEL 4: While Loops & Training ---
      {
        level: 4,
        title: "Training Until Ready",
        sceneId: "mountain-trail",
        completion: {
          message: "Training complete! While loops run until a condition is false. Break stops early, continue skips ahead.",
          tip: "While loops are powerful but dangerous — forget to change the condition and you get an infinite loop!",
          nextPreview: "Next: Advanced battle system with filtering and built-in functions!",
        },
        steps: [
          {
            instruction: "Your hero trains until stamina runs out. When does training stop?",
            instructions: {
              codeSimulation: "Trace the stamina drain — what values does {heroName} train at?",
              dragDrop: "Arrange the while loop to train until stamina runs out.",
              speedCoding: "Complete the condition that keeps the training going.",
            },
            gameAction: "heroTrainLoop",
            codeSnippet: "stamina = 10\nwhile stamina > 0:\n    print(f\"Training! Stamina: {stamina}\")\n    stamina = stamina - 3",
            traceQuestion: "What stamina values get printed?",
            codeBlocks: ["stamina = 10", "while stamina > 0:", '    print(f"Training! Stamina: {stamina}")', "    stamina = stamina - 3"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "stamina = 10\nwhile stamina ___ 0:\n    stamina = stamina - 3",
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ["10, 7, 4, 1", "10, 7, 4", "10, 7, 4, 1, -2"],
            correctIndex: 0,
            hint: "Stamina prints BEFORE subtracting: 10, 7, 4, 1. After printing 1, stamina becomes -2 — does -2 > 0 pass?",
            explanation:
              "Stamina goes 10→7→4→1. After printing 1, stamina becomes -2, and -2 > 0 is False so the loop stops. While loops check BEFORE each round — like a game checking if you have enough energy.",
          },
          {
            instruction: "Search for a rare item and stop as soon as you find it!",
            instructions: {
              codeSimulation: "Trace the search — when does 'break' trigger?",
              dragDrop: "Arrange the code to search and break on finding 'gem'.",
              speedCoding: "Complete the code to stop searching when the gem is found.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "💎" },
            codeSnippet: 'trail = ["rock", "stick", "gem", "leaf", "bone"]\nfor item in trail:\n    if item == "gem":\n        print(f"Found the gem!")\n        break\n    print(f"Checked: {item}")',
            traceQuestion: "What gets printed before finding the gem?",
            codeBlocks: ['trail = ["rock", "stick", "gem", "leaf", "bone"]', "for item in trail:", '    if item == "gem":', '        print("Found the gem!")', "        break", '    print(f"Checked: {item}")'],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: '    if item == "gem":\n        print("Found!")\n        ___',
            blanks: [
              { position: 0, options: ["break", "continue", "return"], correctIndex: 0 },
            ],
            options: ["rock, stick, then Found!", "rock, stick, gem, then Found!", "All five items"],
            correctIndex: 0,
            hint: "The loop checks items one by one. It prints each item until it hits 'gem', then break stops the loop — gem itself is never printed.",
            explanation:
              "'break' exits the loop immediately when the gem is found. Only 'rock' and 'stick' are checked before it. Games use break for searches — stop as soon as you find what you need!",
          },
          {
            instruction: "Skip damaged items on the trail using 'continue'.",
            instructions: {
              codeSimulation: "Which items does the hero actually pick up?",
              dragDrop: "Arrange the code to skip the broken item with continue.",
              speedCoding: "Complete the code to skip item at position 2.",
            },
            gameAction: "heroCollectLoop",
            sceneConfig: { itemEmoji: "🎒" },
            codeSnippet: 'items = ["sword", "shield", "broken_gem", "potion", "key"]\nfor i, item in enumerate(items):\n    if i == 2:\n        continue\n    print(f"Picked up: {item}")',
            traceQuestion: "What items does the hero keep?",
            codeBlocks: ['items = ["sword", "shield", "broken_gem", "potion", "key"]', "for i, item in enumerate(items):", "    if i == 2:", "        continue", '    print(f"Picked up: {item}")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "    if i == 2:\n        ___",
            blanks: [
              { position: 0, options: ["continue", "break", "pass"], correctIndex: 0 },
            ],
            options: ["sword, shield, potion, key", "sword, shield", "All five items"],
            correctIndex: 0,
            hint: "continue skips index 2 (broken_gem) but the loop keeps going. All other items are printed.",
            explanation:
              "'continue' skips the current item and moves to the next. The broken_gem at index 2 is skipped, but the loop keeps going. Unlike break, the loop continues running!",
          },
        ],
      },

      // --- LOOPS LEVEL 5: Advanced Combat ---
      {
        level: 5,
        title: "Advanced Battle System",
        sceneId: "mountain-battle",
        completion: {
          message: "Battle system complete! Filtering, sum(), and conditional comprehensions make your combat engine powerful.",
          tip: "Python's built-in functions (sum, len, max, min) work on any list. No imports needed!",
          nextPreview: "Loops mastered! Next concept: Conditions — navigate obstacles with if/else logic!",
        },
        steps: [
          {
            instruction: "Filter out only the powerful enemies using a list comprehension!",
            instructions: {
              codeSimulation: "Which enemies pass the power filter?",
              dragDrop: "Arrange the code to filter enemies by power level.",
              speedCoding: "Enemies with power 30 or above are considered strong. Complete the filter to keep only those enemies — what number goes in the blank?",
            },
            gameAction: "heroFightWave",
            codeSnippet: "enemies = [10, 25, 30, 45, 50, 15]\nstrong = [e for e in enemies if e >= 30]\nprint(f\"Strong enemies: {strong}\")",
            traceQuestion: "Which enemies are strong (>= 30)?",
            codeBlocks: ["enemies = [10, 25, 30, 45, 50, 15]", "strong = [e for e in enemies if e >= 30]", 'print(f"Strong enemies: {strong}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "strong = [e for e in enemies if e >= ___]",
            blanks: [
              { position: 0, options: ["30", "50", "10"], correctIndex: 0 },
            ],
            options: ["[30, 45, 50]", "[10, 25, 15]", "[10, 25, 30, 45, 50, 15]"],
            correctIndex: 0,
            hint: "The threshold is 30 — enemies with power >= 30 count as strong. Look at the list [10, 25, 30, 45, 50, 15]: which values would pass e >= 30?",
            explanation:
              "List comprehension with a filter: keeps only values >= 30. One line replaces a loop + if statement. Games use this to filter enemies, items, and more!",
          },
          {
            instruction: "Calculate total damage from all attacks in the battle.",
            instructions: {
              codeSimulation: "What's the total damage from all three attacks?",
              dragDrop: "Arrange the code to sum up battle damage.",
              speedCoding: "Complete the code to total the damage values.",
            },
            gameAction: "heroFightWave",
            codeSnippet: "attacks = [25, 40, 35]\ntotal_damage = sum(attacks)\nprint(f\"{heroName} dealt {total_damage} total damage!\")",
            traceQuestion: "What is total_damage?",
            codeBlocks: ["attacks = [25, 40, 35]", "total_damage = sum(attacks)", 'print(f"Total damage: {total_damage}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "total_damage = ___(attacks)",
            blanks: [
              { position: 0, options: ["sum", "len", "max"], correctIndex: 0 },
            ],
            options: ["100", "35", "3"],
            correctIndex: 0,
            hint: "sum() adds all values in the list. 25 + 40 + 35 = ?",
            explanation:
              "sum() adds all values: 25 + 40 + 35 = 100. Python has built-in functions like sum(), len(), max(), min() that work on lists. No manual loops needed!",
          },
          {
            instruction: "Apply a power boost to qualifying attacks before the final battle!",
            instructions: {
              codeSimulation: "Which attacks get boosted and by how much?",
              dragDrop: "Arrange the code to filter and boost strong attacks.",
              speedCoding: "Only attacks of 30 or more earn the +10 boost. What minimum score goes in the filter?",
            },
            gameAction: "heroFightWave",
            codeSnippet: "attacks = [15, 40, 25, 50, 35]\nboosted = [a + 10 for a in attacks if a >= 30]\nprint(f\"Boosted attacks: {boosted}\")",
            traceQuestion: "What are the boosted attack values?",
            codeBlocks: ["attacks = [15, 40, 25, 50, 35]", "boosted = [a + 10 for a in attacks if a >= 30]", 'print(f"Boosted attacks: {boosted}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: "boosted = [a + 10 for a in attacks if a >= ___]",
            blanks: [
              { position: 0, options: ["30", "50", "10"], correctIndex: 0 },
            ],
            options: ["[50, 60, 45]", "[40, 50, 35]", "[25, 50, 35, 60, 45]"],
            correctIndex: 0,
            hint: "The threshold is 30 — attacks of 30 or more get the boost. From [15, 40, 25, 50, 35], which values pass a >= 30 check? Those are the ones that get +10.",
            explanation:
              "Filter (>= 30) keeps 40, 50, 35. Then +10 each: 50, 60, 45. One line filters AND transforms — this is peak Python! Games use this for buff calculations.",
          },
        ],
      },
    ],
  },

  // ==========================================
  // CONCEPT 3: CONDITIONS — "Decisions on the Mountain"
  // ==========================================
  {
    id: "conditions",
    title: "Conditions",
    concept: "Decisions on the Mountain",
    icon: "if",
    color: "from-emerald-500 to-green-600",
    description: "Your hero encounters obstacles — write the logic to navigate them.",
    intro: {
      whyItMatters: "The mountain is full of obstacles. Rocks, rivers, weather changes. Your hero needs if/else logic to decide what to do.",
      codePreview: 'if obstacle == "rock":\n    go_around()\nelif obstacle == "river":\n    use_boat()\nelse:\n    keep_walking()',
      funFact: "AI chatbots, game NPCs, and traffic lights all use conditional logic to make decisions.",
    },
    levels: [
      // --- CONDITIONS LEVEL 1: Weather Check ---
      {
        level: 1,
        title: "Weather Check",
        sceneId: "mountain-obstacle",
        completion: {
          message: "Weather system online! if/else lets your game react to conditions — only one branch ever runs.",
          tip: "The comparison operators (>, <, >=, <=, ==, !=) always return True or False. That's all if needs!",
          nextPreview: "Next: Handle obstacles on the mountain trail!",
        },
        steps: [
          {
            instruction: "Check the temperature before your hero continues climbing!",
            instructions: {
              codeSimulation: "Is it too hot to climb? Trace the condition to find out.",
              dragDrop: "Arrange the weather check code for your hero.",
              speedCoding: "Complete the condition to check if it's too hot.",
            },
            gameAction: "heroCheckWeather",
            sceneConfig: { varDisplay: "temp = 35", conditionLabel: "if temp > 30:", successAction: "→ rest in shade" },
            storyContext: "Mountain weather changes fast. Your game needs to check conditions before the hero moves.",
            codeSnippet: 'temp = 35\nif temp > 30:\n    print("{heroName}: Too hot! Rest in shade.")\nelse:\n    print("{heroName}: Perfect weather. Keep climbing!")',
            traceQuestion: "What does {heroName} say?",
            codeBlocks: ["temp = 35", "if temp > 30:", '    print("Too hot! Rest in shade.")', "else:", '    print("Perfect weather. Keep climbing!")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'temp = 35\nif temp ___ 30:\n    print("Too hot!")',
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ['"Too hot! Rest in shade."', '"Perfect weather. Keep climbing!"', "Both"],
            correctIndex: 0,
            hint: "The blank is a comparison operator. 'Too hot' means the temperature exceeds a limit — which operator tests whether a value is above another: >, <, or ==?",
            explanation:
              "temp is 35. Is 35 > 30? Yes! So the if-block runs. The else is skipped entirely. Only ONE branch ever runs — your game picks the right response.",
          },
          {
            storyContext: "{heroName} reaches an energy barrier on the mountain path. The barrier requires at least 20 energy points to pass — any less and the hero must stop and rest. {heroName} currently has 15 energy. What will your code decide?",
            instruction: "Fill in the minimum energy needed to pass the barrier.",
            instructions: {
              codeSimulation: "{heroName} has 15 energy but needs at least 20. Trace what the condition decides.",
              dragDrop: "Arrange the energy check — the barrier requires at least 20 energy points.",
              speedCoding: "The barrier blocks heroes who don't have enough energy. Read the story — what energy level must the hero meet to pass?",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: "energy = 15", conditionLabel: "if energy >= 20:", successAction: "→ charges ahead!" },
            codeSnippet: 'energy = 15\nif energy >= 20:\n    print("{heroName} charges ahead!")\nelse:\n    print("{heroName} needs to rest first.")',
            traceQuestion: "{heroName} has 15 energy. The barrier needs 20. What gets printed?",
            codeBlocks: ["energy = 15", "if energy >= 20:", '    print("Charges ahead!")', "else:", '    print("Needs to rest first.")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'if energy >= ___:\n    print("Charges ahead!")',
            blanks: [
              { position: 0, options: ["20", "15", "10"], correctIndex: 0 },
            ],
            options: ['"{heroName} needs to rest first."', '"{heroName} charges ahead!"', "Nothing"],
            correctIndex: 0,
            hint: "The story context tells you exactly what energy level the barrier requires. Once you fill in that threshold, ask: does energy = 15 satisfy the >= condition? Which branch runs?",
            explanation:
              "energy is 15. Is 15 >= 20? No! So the else-block runs and {heroName} needs to rest. The >= operator means 'greater than or equal to'. Your game protects the hero from overexertion.",
          },
          {
            instruction: "Compare two paths — which one is safer?",
            instructions: {
              codeSimulation: "Your hero picks the safer path. Which danger level wins?",
              dragDrop: "Arrange the code to find the safer path.",
              speedCoding: "Complete the condition to compare path dangers.",
            },
            gameAction: "heroForkPath",
            sceneConfig: { varDisplay: "a=7 · b=3", conditionLabel: "if a > b:", successAction: "→ take path B", pathALabel: "⚠ A: 7", pathBLabel: "✓ B: 3" },
            codeSnippet: "path_a_danger = 7\npath_b_danger = 3\nif path_a_danger > path_b_danger:\n    safe_path = \"B\"\nelse:\n    safe_path = \"A\"\nprint(f\"{heroName} takes path {safe_path}\")",
            traceQuestion: "Which path does the hero take?",
            codeBlocks: ["path_a_danger = 7", "path_b_danger = 3", "if path_a_danger > path_b_danger:", '    safe_path = "B"', "else:", '    safe_path = "A"', 'print(f"Takes path {safe_path}")'],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            visualScene: "mountain",
            codeTemplate: "if path_a_danger ___ path_b_danger:\n    safe_path = \"B\"",
            blanks: [
              { position: 0, options: [">", "<", "=="], correctIndex: 0 },
            ],
            options: ["Path B (safer)", "Path A (safer)", "Error"],
            correctIndex: 0,
            hint: "You want the safer path — lower danger wins. If path A has MORE danger, which comparison operator correctly identifies that path_a_danger is greater than path_b_danger?",
            explanation:
              "Is 7 > 3? Yes. Path A is more dangerous, so the hero takes Path B. This is a classic pattern for finding the best option — games use it everywhere!",
          },
        ],
      },

      // --- CONDITIONS LEVEL 2: Obstacles ---
      {
        level: 2,
        title: "Handling Obstacles",
        sceneId: "mountain-obstacle",
        completion: {
          message: "Obstacle handling unlocked! == checks equality, != checks difference, and 'and' combines conditions.",
          tip: "== compares values, = assigns them. Mixing these up is the most common Python mistake!",
          nextPreview: "Next: Logic gates — and, or, not for complex decisions!",
        },
        steps: [
          {
            instruction: "Your hero finds a locked chest. Does the key match?",
            instructions: {
              codeSimulation: "Does the hero's key code match the chest? Trace the == check.",
              dragDrop: "Arrange the code to check if the key matches.",
              speedCoding: "Complete the equality check for the chest key.",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: "key=42 · code=42", conditionLabel: "if key == code:", successAction: "→ chest unlocked!" },
            codeSnippet: 'hero_key = 42\nchest_code = 42\nprint(hero_key == chest_code)\nprint(hero_key == "42")',
            traceQuestion: "What are the two results?",
            codeBlocks: ["hero_key = 42", "chest_code = 42", "print(hero_key == chest_code)", 'print(hero_key == "42")'],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "hero_key = 42\nchest_code = 42\nprint(hero_key ___ chest_code)",
            blanks: [
              { position: 0, options: ["==", "=", "!="], correctIndex: 0 },
            ],
            options: ["True, False", "True, True", "42, 42"],
            correctIndex: 0,
            hint: "42 == 42 compares two integers (same type, same value). But 42 == \"42\" compares a number to a string — different types.",
            explanation:
              "== checks equality. 42 == 42 is True (match!). But 42 == \"42\" is False — an integer and string are different types. Games must check types carefully!",
          },
          {
            instruction: "Check if an obstacle is NOT a safe type before the hero proceeds.",
            instructions: {
              codeSimulation: "Is the obstacle dangerous? Trace the != check.",
              dragDrop: "Arrange the code to check if the obstacle isn't safe.",
              speedCoding: "Complete the operator to check whether the obstacle type differs.",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: 'obstacle = "rock"', conditionLabel: 'obstacle != "flower":', successAction: "→ danger detected!" },
            codeSnippet: 'obstacle = "rock"\nprint(obstacle != "flower")\nprint(obstacle != "rock")',
            traceQuestion: "What are the two results?",
            codeBlocks: ['obstacle = "rock"', 'print(obstacle != "flower")', 'print(obstacle != "rock")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'obstacle = "rock"\nprint(obstacle ___ "flower")',
            blanks: [
              { position: 0, options: ["!=", "==", ">"], correctIndex: 0 },
            ],
            options: ["True, False", "False, True", "True, True"],
            correctIndex: 0,
            hint: "\"rock\" != \"flower\" asks: are these different? They are — True. \"rock\" != \"rock\" asks the same — they're the same, so False.",
            explanation:
              "!= means 'not equal to'. 'rock' != 'flower' is True (different). 'rock' != 'rock' is False (same). Games use != to check if something ISN'T what you expect.",
          },
          {
            instruction: "Your hero needs BOTH a rope AND enough stamina to cross the bridge.",
            instructions: {
              codeSimulation: "Can {heroName} cross? Both conditions must be true.",
              dragDrop: "Arrange the code to check both requirements.",
              speedCoding: "Complete the logical operator — both requirements must be true to cross.",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: "has_rope=True · stamina=80", conditionLabel: "if has_rope and stamina >= 50:", successAction: "→ crosses bridge!" },
            codeSnippet: 'has_rope = True\nstamina = 80\nif has_rope and stamina >= 50:\n    print("{heroName} crosses the bridge!")\nelse:\n    print("Can\'t cross yet.")',
            traceQuestion: "Can the hero cross?",
            codeBlocks: ["has_rope = True", "stamina = 80", "if has_rope and stamina >= 50:", '    print("Crosses the bridge!")', "else:", '    print("Can\'t cross yet.")'],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "if has_rope ___ stamina >= 50:",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ["Yes — has rope AND enough stamina", "No — one condition fails", "Error"],
            correctIndex: 0,
            hint: "has_rope = True AND stamina = 80 (which is >= 50). Both sides of 'and' must be True — are they?",
            explanation:
              "'and' means BOTH conditions must be true. has_rope is True AND 80 >= 50 is True. Both pass! The hero crosses. Games use 'and' for multi-requirement checks.",
          },
        ],
      },

      // --- CONDITIONS LEVEL 3: Logic Gates ---
      {
        level: 3,
        title: "Logic Gates",
        sceneId: "mountain-obstacle",
        completion: {
          message: "Logic gates mastered! 'and' needs both True, 'or' needs at least one, 'not' flips the value.",
          tip: "Boolean logic powers everything from AI to traffic lights. These three operators are universal!",
          nextPreview: "Next: Multiple paths with elif chains!",
        },
        steps: [
          {
            instruction: "The magic gate needs both runes to be active. Complete the logic check.",
            instructions: {
              codeSimulation: "Are both runes active? Trace the 'and' logic.",
              dragDrop: "Arrange the code to check both rune conditions.",
              speedCoding: "Complete the logical operator — the gate needs both runes simultaneously.",
            },
            gameAction: "heroFinalGate",
            sceneConfig: { varDisplay: "rune_a=True · rune_b=False", conditionLabel: "if rune_a and rune_b:", successAction: "→ gate opens!" },
            codeSnippet: "rune_a = True\nrune_b = False\nprint(rune_a and rune_b)\nprint(rune_a and True)",
            traceQuestion: "What are the two gate results?",
            codeBlocks: ["rune_a = True", "rune_b = False", "print(rune_a and rune_b)", "print(rune_a and True)"],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "print(rune_a ___ rune_b)",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ["False, True", "True, True", "False, False"],
            correctIndex: 0,
            hint: "'and' only gives True when BOTH sides are True. rune_a=True, rune_b=False — what is True and False?",
            explanation:
              "'and' returns True ONLY when BOTH sides are True. True and False = False (gate stays locked). True and True = True (gate opens). Both runes must glow!",
          },
          {
            instruction: "The hero can climb if at least one weather condition is true.",
            instructions: {
              codeSimulation: "Is it okay to climb? Only one condition needs to be true.",
              dragDrop: "Arrange the 'or' logic for the weather check.",
              speedCoding: "Complete the logical operator — either weather condition is enough to climb.",
            },
            gameAction: "heroCheckWeather",
            sceneConfig: { varDisplay: "sunny=F · warm=T", conditionLabel: "can_climb = sunny or warm:", successAction: "→ can climb: True!" },
            codeSnippet: "sunny = False\nwarm = True\ncan_climb = sunny or warm\nprint(f\"Can climb: {can_climb}\")",
            traceQuestion: "Can the hero climb?",
            codeBlocks: ["sunny = False", "warm = True", "can_climb = sunny or warm", 'print(f"Can climb: {can_climb}")'],
            correctOrder: [0, 1, 2, 3],
            visualScene: "mountain",
            codeTemplate: "can_climb = sunny ___ warm",
            blanks: [
              { position: 0, options: ["or", "and", "not"], correctIndex: 0 },
            ],
            options: ["True — warm is enough", "False — it's not sunny", "Error"],
            correctIndex: 0,
            hint: "'or' only needs ONE side to be True. sunny=False but warm=True — does that pass?",
            explanation:
              "'or' returns True when AT LEAST ONE side is True. Not sunny but warm? Still True! Only False or False would block the climb.",
          },
          {
            instruction: "Check the hero's health status before allowing them to fight.",
            instructions: {
              codeSimulation: "Is {heroName} poisoned? What does 'not' do to the check?",
              dragDrop: "Arrange the 'not' check for poison status.",
              speedCoding: "Complete the logical operator to flip the poison check.",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: "is_poisoned = False", conditionLabel: "if not is_poisoned:", successAction: "→ ready to fight!" },
            codeSnippet: 'is_poisoned = False\nif not is_poisoned:\n    print("{heroName} is healthy! Ready to fight.")\nelse:\n    print("{heroName} needs an antidote first.")',
            traceQuestion: "Can the hero fight?",
            codeBlocks: ["is_poisoned = False", "if not is_poisoned:", '    print("Healthy! Ready to fight.")', "else:", '    print("Needs an antidote.")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: "if ___ is_poisoned:\n    print(\"Ready to fight.\")",
            blanks: [
              { position: 0, options: ["not", "and", "or"], correctIndex: 0 },
            ],
            options: ["Yes — not False is True", "No — is_poisoned is False", "Error"],
            correctIndex: 0,
            hint: "is_poisoned = False. 'not False' flips it to True. So 'if not is_poisoned' → 'if True' → the if-block runs.",
            explanation:
              "'not' flips a boolean. not False = True. The hero is NOT poisoned, so they can fight! Very common pattern: 'if NOT in danger, proceed'.",
          },
        ],
      },

      // --- CONDITIONS LEVEL 4: Multiple Paths ---
      {
        level: 4,
        title: "Multiple Paths (elif)",
        sceneId: "mountain-obstacle",
        completion: {
          message: "Multi-path logic built! elif chains handle many options, and nested conditions go deeper.",
          tip: "elif is short for 'else if'. Python stops checking as soon as it finds the first True condition.",
          nextPreview: "Final level: The Summit Gate — ternaries, 'in', and try/except!",
        },
        steps: [
          {
            instruction: "The mountain has different terrains. Pick the right action for each!",
            instructions: {
              codeSimulation: "With danger level 65, which action does the hero take?",
              dragDrop: "Arrange the elif chain for the danger level check.",
              speedCoding: "Complete the keyword that introduces a second conditional check.",
            },
            gameAction: "heroForkPath",
            sceneConfig: { varDisplay: "danger = 65", conditionLabel: "elif danger >= 50:", successAction: "→ proceed with caution", pathALabel: "≥80: retreat", pathBLabel: "≥50: caution" },
            codeSnippet: 'danger = 65\nif danger >= 80:\n    action = "retreat"\nelif danger >= 50:\n    action = "proceed with caution"\nelif danger >= 20:\n    action = "walk confidently"\nelse:\n    action = "sprint ahead"\nprint(f"{heroName}: {action}")',
            traceQuestion: "What action does the hero take?",
            codeBlocks: ["danger = 65", "if danger >= 80:", '    action = "retreat"', "elif danger >= 50:", '    action = "proceed with caution"', "elif danger >= 20:", '    action = "walk confidently"', "else:", '    action = "sprint ahead"', "print(action)"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            visualScene: "mountain",
            codeTemplate: 'if danger >= 80:\n    action = "retreat"\n___ danger >= 50:\n    action = "proceed with caution"',
            blanks: [
              { position: 0, options: ["elif", "else if", "if"], correctIndex: 0 },
            ],
            options: ['"proceed with caution"', '"retreat"', '"walk confidently"'],
            correctIndex: 0,
            hint: "danger = 65. Test top to bottom: is 65 >= 80? No. Is 65 >= 50? Yes — that branch runs and the rest are skipped.",
            explanation:
              "65 >= 80? No. 65 >= 50? Yes! So action = 'proceed with caution'. Once a match is found, the rest are skipped. Python uses 'elif' (not 'else if'). Order matters!",
          },
          {
            instruction: "Your hero needs the right gear AND enough level to enter the cave.",
            instructions: {
              codeSimulation: "Does {heroName} meet BOTH requirements for the cave?",
              dragDrop: "Arrange the nested condition check for cave entry.",
              speedCoding: "Complete the inner condition — what must the hero possess to enter?",
            },
            gameAction: "heroObstacle",
            sceneConfig: { varDisplay: "level=5 · has_key=False", conditionLabel: "if level >= 3 and has_key:", successAction: "→ needs a key!" },
            codeSnippet: 'hero_level = 5\nhas_key = False\n\nif hero_level >= 3:\n    if has_key:\n        print("{heroName} enters the cave!")\n    else:\n        print("{heroName} needs a key!")\nelse:\n    print("{heroName} is too low level.")',
            traceQuestion: "What message appears?",
            codeBlocks: ["hero_level = 5", "has_key = False", "if hero_level >= 3:", "    if has_key:", '        print("Enters the cave!")', "    else:", '        print("Needs a key!")', "else:", '    print("Too low level.")'],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            visualScene: "mountain",
            codeTemplate: "if hero_level >= 3:\n    if ___:\n        print(\"Enters the cave!\")",
            blanks: [
              { position: 0, options: ["has_key", "hero_level", "True"], correctIndex: 0 },
            ],
            options: ['"{heroName} needs a key!"', '"{heroName} enters the cave!"', '"{heroName} is too low level."'],
            correctIndex: 0,
            hint: "hero_level = 5 passes the first check (5 >= 3). But has_key = False — what does the inner if do?",
            explanation:
              "First: 5 >= 3? Yes. Second: has_key is False, so the inner else runs. Nested conditions check step by step — like a bouncer checking ID then checking the list.",
          },
          {
            instruction: "Simplify: combine both cave requirements into a single condition.",
            instructions: {
              codeSimulation: "Both conditions in one line — does {heroName} get in?",
              dragDrop: "Arrange the simplified one-line condition.",
              speedCoding: "Both requirements must be true to enter. Complete the combined condition.",
            },
            gameAction: "heroFinalGate",
            sceneConfig: { varDisplay: "level=5 · has_key=True", conditionLabel: "if level >= 3 and has_key:", successAction: "→ enters the cave!" },
            codeSnippet: 'hero_level = 5\nhas_key = True\n\nif hero_level >= 3 and has_key:\n    print("{heroName} enters the cave!")\nelse:\n    print("Access denied.")',
            traceQuestion: "Does the hero enter?",
            codeBlocks: ["hero_level = 5", "has_key = True", "if hero_level >= 3 and has_key:", '    print("Enters the cave!")', "else:", '    print("Access denied.")'],
            correctOrder: [0, 1, 2, 3, 4, 5],
            visualScene: "mountain",
            codeTemplate: "if hero_level >= 3 ___ has_key:",
            blanks: [
              { position: 0, options: ["and", "or", "not"], correctIndex: 0 },
            ],
            options: ['"{heroName} enters the cave!"', '"Access denied."', "Error"],
            correctIndex: 0,
            hint: "hero_level = 5, has_key = True. Both sides of 'and' need to be True — check each one.",
            explanation:
              "'and' combines both checks. 5 >= 3 is True AND has_key is True. Both pass! Much cleaner than nesting. Flatten when you can!",
          },
        ],
      },

      // --- CONDITIONS LEVEL 5: The Summit Gate ---
      {
        level: 5,
        title: "The Summit Gate",
        sceneId: "mountain-obstacle",
        completion: {
          message: "SUMMIT REACHED! You've mastered 'in' for searching, ternary expressions, and try/except for error handling.",
          tip: "try/except is how professional developers write crash-proof code. Every real app uses it!",
          nextPreview: "Congratulations — you've completed all Mountain Quest concepts! You're a Python developer now.",
        },
        steps: [
          {
            instruction: "Check if your hero has the required item to pass the summit gate!",
            instructions: {
              codeSimulation: "Trace both item checks against {heroName}'s inventory.",
              dragDrop: "Arrange the code to test whether each item is in the inventory list.",
              speedCoding: "Complete the operator that tests whether an item belongs to a collection.",
            },
            gameAction: "heroFinalGate",
            sceneConfig: { varDisplay: '"gem" in inventory', conditionLabel: '"gem" in inventory:', successAction: "→ gem found: True!" },
            codeSnippet: 'inventory = ["sword", "gem", "potion"]\nprint("gem" in inventory)\nprint("shield" in inventory)',
            traceQuestion: "What are the two results?",
            codeBlocks: ['inventory = ["sword", "gem", "potion"]', 'print("gem" in inventory)', 'print("shield" in inventory)'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'print("gem" ___ inventory)',
            blanks: [
              { position: 0, options: ["in", "of", "=="], correctIndex: 0 },
            ],
            options: ["True, False", "True, True", "False, False"],
            correctIndex: 0,
            hint: "Look at the inventory list — is \"gem\" in it? Is \"shield\" in it? 'in' returns True if found, False if not.",
            explanation:
              "'in' checks if a value exists in a collection. 'gem' is in the list → True. 'shield' is not → False. Games use 'in' to check inventory, permissions, and more!",
          },
          {
            instruction: "Write a one-line status check for your hero using a ternary!",
            instructions: {
              codeSimulation: "What status does {heroName} get with 80 HP?",
              dragDrop: "Arrange the ternary expression for hero status.",
              speedCoding: "Complete the ternary to set status based on HP.",
            },
            gameAction: "heroCheckWeather",
            sceneConfig: { varDisplay: "hero_hp = 80", conditionLabel: '"healthy" if hero_hp >= 50:', successAction: "→ status: healthy!" },
            codeSnippet: 'hero_hp = 80\nstatus = "healthy" if hero_hp >= 50 else "wounded"\nprint(f"{heroName} is {status}")',
            traceQuestion: "What is the status?",
            codeBlocks: ["hero_hp = 80", 'status = "healthy" if hero_hp >= 50 else "wounded"', 'print(f"{heroName} is {status}")'],
            correctOrder: [0, 1, 2],
            visualScene: "mountain",
            codeTemplate: 'status = "healthy" if hero_hp >= 50 ___ "wounded"',
            blanks: [
              { position: 0, options: ["else", "or", "and"], correctIndex: 0 },
            ],
            options: ['"healthy"', '"wounded"', "80"],
            correctIndex: 0,
            hint: "hero_hp = 80. Is 80 >= 50? If yes, the value BEFORE 'if' is chosen; if no, the value after 'else' is chosen.",
            explanation:
              "Python's ternary: value_if_true if condition else value_if_false. 80 >= 50 is True, so status = 'healthy'. One-line if/else — clean and game-ready!",
          },
          {
            instruction: "Handle a game crash gracefully with try/except!",
            instructions: {
              codeSimulation: "What happens when the game tries to parse bad input?",
              dragDrop: "Arrange the try/except to catch the game crash.",
              speedCoding: "Complete the except clause to catch the error type.",
            },
            gameAction: "heroFinalGate",
            sceneConfig: { varDisplay: 'int("fire") → ValueError', conditionLabel: "try: → except ValueError:", successAction: "→ error caught!" },
            codeSnippet: 'try:\n    damage = int("fire")\n    print(f"{heroName} deals {damage} damage")\nexcept ValueError:\n    print("Invalid attack value! Using default.")',
            traceQuestion: "What gets printed?",
            codeBlocks: ["try:", '    damage = int("fire")', '    print(f"Deals {damage} damage")', "except ValueError:", '    print("Invalid attack value! Using default.")'],
            correctOrder: [0, 1, 2, 3, 4],
            visualScene: "mountain",
            codeTemplate: 'try:\n    damage = int("fire")\nexcept ___:\n    print("Invalid attack value! Using default.")',
            blanks: [
              { position: 0, options: ["ValueError", "TypeError", "Error"], correctIndex: 0 },
            ],
            options: ['"Invalid attack value! Using default."', "Game crashes", '"fire"'],
            correctIndex: 0,
            hint: "When int() is given a string that cannot be converted to a number, Python raises a specific error type. Look at the options — which one matches that kind of error?",
            explanation:
              'int("fire") fails because "fire" isn\'t a number. The except block catches the ValueError and shows a friendly message. Games MUST handle errors — crashing is never acceptable!',
          },
        ],
      },
    ],
  },
];

export default lessons;
