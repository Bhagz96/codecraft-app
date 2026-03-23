/**
 * LESSON DATA
 * -----------
 * Each lesson teaches one coding concept through a series of steps.
 * The "steps" are generic — the teaching modality (Story, Puzzle, Challenge)
 * determines HOW they get presented to the child.
 *
 * Fields:
 *   id          – unique identifier
 *   title       – shown to the child
 *   concept     – the coding idea being taught
 *   icon        – emoji shown on the lesson card
 *   color       – Tailwind gradient classes for the card background
 *   description – short child-friendly summary
 *   steps       – the actual lesson content (array of step objects)
 *
 * Each step has:
 *   instruction   – what the child needs to understand
 *   story         – narrative text (used by Story mode)
 *   options       – possible answers the child can pick
 *   correctIndex  – which option (0-based) is the right answer
 *   explanation   – shown after they answer, to reinforce learning
 */

const lessons = [
  {
    id: "sequences",
    title: "Step by Step",
    concept: "Sequences",
    icon: "🐾",
    color: "from-purple-400 to-pink-400",
    description: "Help Cody the Cat get home by putting steps in order!",
    steps: [
      {
        instruction: "Cody wants to make a sandwich. What should he do FIRST?",
        story:
          "Cody the Cat is hungry! He wants to make a yummy peanut butter sandwich. But he needs to do things in the RIGHT ORDER. Can you help him figure out the first step?",
        options: [
          "Eat the sandwich",
          "Get two slices of bread",
          "Spread peanut butter",
        ],
        correctIndex: 1,
        explanation:
          "Great job! In coding, we call this a SEQUENCE — doing things in the right order. First, you need the bread before you can do anything else!",
      },
      {
        instruction: "The bread is ready. What comes NEXT?",
        story:
          "Cody has his bread on the table. Now he looks at the peanut butter jar and the knife. What should he do next in the sequence?",
        options: [
          "Put the bread away",
          "Spread peanut butter on the bread",
          "Eat the bread plain",
        ],
        correctIndex: 1,
        explanation:
          "You got it! Step 2 in our sequence is spreading the peanut butter. Each step follows the one before it — just like lines of code!",
      },
      {
        instruction: "The peanut butter is on the bread. What's the LAST step?",
        story:
          "Almost done! The peanut butter is spread perfectly. Cody's tummy is rumbling. What's the final step in our sandwich sequence?",
        options: [
          "Put the two slices together and eat it!",
          "Get more bread",
          "Wash the dishes",
        ],
        correctIndex: 0,
        explanation:
          "You completed the whole sequence! 🎉 In coding, a SEQUENCE means doing steps one after another in order: Step 1 → Step 2 → Step 3. You just wrote your first program!",
      },
    ],
  },
  {
    id: "loops",
    title: "Round and Round",
    concept: "Loops",
    icon: "🔄",
    color: "from-blue-400 to-cyan-400",
    description: "Learn how to repeat things like a computer does!",
    steps: [
      {
        instruction: "Cody wants to water 3 flowers. What's the smart way?",
        story:
          "Cody has 3 beautiful flowers in his garden. Each one needs water. Instead of writing a new instruction for each flower, what could Cody do?",
        options: [
          "Water flower 1, then forget about the rest",
          "Repeat 'water a flower' 3 times",
          "Water all flowers at once with a fire hose",
        ],
        correctIndex: 1,
        explanation:
          "That's a LOOP! Instead of writing the same instruction 3 times, we tell the computer: 'repeat this action 3 times.' It saves so much work!",
      },
      {
        instruction:
          "Cody is climbing stairs. There are 5 stairs. How should he climb?",
        story:
          "Cody sees a staircase with 5 steps. He wants to get to the top. Should he write out each step, or use a loop?",
        options: [
          "Repeat 'climb one step' 5 times",
          "Jump to the top in one big leap",
          "Write 'climb step 1, climb step 2, climb step 3...' separately",
        ],
        correctIndex: 0,
        explanation:
          "Perfect! A loop lets us repeat 'climb one step' 5 times. Imagine if there were 100 stairs — you wouldn't want to write 100 separate instructions!",
      },
      {
        instruction:
          "Cody is brushing his teeth. The dentist says brush each tooth 10 times. What kind of loop is this?",
        story:
          "At the dentist, Cody learns he should brush each tooth back and forth 10 times. That's a lot of brushing! Good thing loops make it easy.",
        options: [
          "A loop that runs forever",
          "A loop that repeats 10 times",
          "Not a loop at all",
        ],
        correctIndex: 1,
        explanation:
          "Right! This is a COUNTING LOOP — it repeats exactly 10 times and then stops. Computers use counting loops all the time! 🦷✨",
      },
    ],
  },
  {
    id: "conditions",
    title: "Yes or No?",
    concept: "Conditions",
    icon: "🤔",
    color: "from-green-400 to-emerald-400",
    description: "Teach Cody to make decisions like a computer!",
    steps: [
      {
        instruction:
          "Cody is going outside. IF it's raining, what should he do?",
        story:
          "Cody looks out the window. Dark clouds! The computer in Cody's brain says: 'IF raining, THEN take umbrella. ELSE wear sunglasses.' It IS raining. What happens?",
        options: [
          "Wear sunglasses",
          "Take an umbrella",
          "Stay in bed all day",
        ],
        correctIndex: 1,
        explanation:
          "That's a CONDITION! IF something is true, THEN do one thing. The computer checks: 'Is it raining? YES!' So it follows the 'take umbrella' instruction.",
      },
      {
        instruction:
          "Cody finds a door. IF the door is locked, what should the code do?",
        story:
          "Cody walks up to a mysterious door. The code says: 'IF door is locked THEN use the key. ELSE just open it.' The door IS locked. What does the code tell Cody to do?",
        options: [
          "Just open it",
          "Walk away",
          "Use the key",
        ],
        correctIndex: 2,
        explanation:
          "Correct! The condition checked 'is the door locked?' — it was TRUE, so the code followed the THEN path: use the key! 🔑",
      },
      {
        instruction:
          "Cody has 3 coins. A toy costs 5 coins. IF coins < price, what happens?",
        story:
          "Cody is at the toy shop. He has 3 coins but the toy robot costs 5 coins. The shop's computer checks: 'IF coins are less than price THEN say not enough money.'",
        options: [
          "Cody gets the toy for free",
          "The computer says 'not enough money'",
          "The computer ignores the price",
        ],
        correctIndex: 1,
        explanation:
          "You nailed it! 🎯 The condition '3 < 5' is TRUE, so the computer follows that path and says 'not enough money.' Conditions help computers make decisions, just like you do every day!",
      },
    ],
  },
];

export default lessons;
