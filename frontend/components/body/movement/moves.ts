// Gentle, equipment-free movements shared by the Movement & Flexibility
// activities. Everything can be done seated or standing near a desk.

export type Move = {
  id: string;
  name: string;
  icon: string;
  start: string;
  steps: string[];
};

export const MOVES = {
  neck: {
    id: "neck",
    name: "Gentle neck tilt",
    icon: "🙆",
    start: "Sit or stand tall with your shoulders relaxed.",
    steps: [
      "Slowly tilt your right ear toward your right shoulder.",
      "Hold softly, breathing out, then return to centre.",
      "Repeat on the left. Keep it small and easy.",
    ],
  },
  shoulders: {
    id: "shoulders",
    name: "Shoulder rolls",
    icon: "🤷",
    start: "Sit or stand with your arms hanging loosely.",
    steps: [
      "Lift your shoulders toward your ears.",
      "Roll them back and down in a slow circle.",
      "After a few rolls, switch direction.",
    ],
  },
  reach: {
    id: "reach",
    name: "Overhead reach",
    icon: "🙋",
    start: "Sit or stand tall with your feet steady.",
    steps: [
      "Reach both arms up, as high as feels comfortable.",
      "Lengthen through your sides and breathe in.",
      "Lower your arms slowly as you breathe out.",
    ],
  },
  sideBend: {
    id: "sideBend",
    name: "Side bend",
    icon: "🧍",
    start: "Sit or stand tall, one hand resting on your hip.",
    steps: [
      "Reach the other arm up and gently lean away from it.",
      "Feel a light stretch along your side, then return.",
      "Switch sides.",
    ],
  },
  chest: {
    id: "chest",
    name: "Chest opener",
    icon: "👐",
    start: "Sit near the front of your chair or stand.",
    steps: [
      "Place your hands on your lower back.",
      "Gently draw your elbows back and lift your chest.",
      "Breathe slowly, then relax.",
    ],
  },
  hug: {
    id: "hug",
    name: "Upper back hug",
    icon: "🤗",
    start: "Sit or stand comfortably.",
    steps: [
      "Wrap your arms around yourself in a loose hug.",
      "Let your upper back round slightly and breathe into it.",
      "Release and swap which arm is on top.",
    ],
  },
  twist: {
    id: "twist",
    name: "Seated twist",
    icon: "🔄",
    start: "Sit tall with both feet flat on the floor.",
    steps: [
      "Place your right hand on your left knee.",
      "Turn gently to the left from your middle, not your neck.",
      "Return to centre and repeat on the other side.",
    ],
  },
  wrists: {
    id: "wrists",
    name: "Wrist and finger stretch",
    icon: "✋",
    start: "Hold your arms in front of you, elbows soft.",
    steps: [
      "Make slow circles with your wrists in each direction.",
      "Spread your fingers wide, then make a loose fist.",
      "Repeat a few times at an easy pace.",
    ],
  },
  hamstring: {
    id: "hamstring",
    name: "Seated leg reach",
    icon: "🦵",
    start: "Sit near the front of your chair.",
    steps: [
      "Stretch one leg out with the heel on the floor.",
      "Sit tall and lean forward slightly from your hips.",
      "Stop at a gentle stretch, then switch legs.",
    ],
  },
  ankles: {
    id: "ankles",
    name: "Ankle circles",
    icon: "🦶",
    start: "Sit with one foot lifted slightly off the floor.",
    steps: [
      "Draw slow circles with your foot.",
      "Change direction after a few circles.",
      "Switch to the other foot.",
    ],
  },
  breaths: {
    id: "breaths",
    name: "Relaxed breaths",
    icon: "🌬️",
    start: "Sit or stand comfortably and let your shoulders drop.",
    steps: [
      "Breathe in gently through your nose.",
      "Breathe out slowly, a little longer than the in-breath.",
      "Repeat at your own pace.",
    ],
  },
} satisfies Record<string, Move>;

export type StretchRoutine = { minutes: number; secondsPerMove: number; moves: Move[] };

export const STRETCH_ROUTINES: StretchRoutine[] = [
  {
    minutes: 3,
    secondsPerMove: 30,
    moves: [MOVES.neck, MOVES.shoulders, MOVES.reach, MOVES.sideBend, MOVES.wrists, MOVES.breaths],
  },
  {
    minutes: 5,
    secondsPerMove: 30,
    moves: [
      MOVES.neck,
      MOVES.shoulders,
      MOVES.reach,
      MOVES.sideBend,
      MOVES.chest,
      MOVES.hug,
      MOVES.twist,
      MOVES.wrists,
      MOVES.ankles,
      MOVES.breaths,
    ],
  },
  {
    minutes: 10,
    secondsPerMove: 60,
    moves: [
      MOVES.neck,
      MOVES.shoulders,
      MOVES.reach,
      MOVES.sideBend,
      MOVES.chest,
      MOVES.hug,
      MOVES.twist,
      MOVES.hamstring,
      MOVES.ankles,
      MOVES.breaths,
    ],
  },
];

export type TimedMove = Move & { seconds: number };

export const DESK_BREAK: TimedMove[] = [
  { ...MOVES.shoulders, seconds: 30 },
  { ...MOVES.neck, seconds: 30 },
  { ...MOVES.wrists, seconds: 30 },
  {
    id: "walk",
    name: "Stand up and walk",
    icon: "🚶",
    start: "Stand up slowly from your chair.",
    steps: [
      "Take a short walk, even just around the room.",
      "Let your arms swing naturally.",
      "Look somewhere far away to rest your eyes.",
    ],
    seconds: 60,
  },
  {
    id: "posture",
    name: "Change your posture",
    icon: "🪑",
    start: "Come back to your seat or stay standing, whichever feels better.",
    steps: [
      "Shift to a different comfortable position.",
      "Let your feet rest flat and your shoulders relax.",
      "Adjust your screen or chair if anything feels awkward.",
    ],
    seconds: 30,
  },
];

export const MOBILITY_FLOW: (Move & { reps: string })[] = [
  {
    id: "shoulderCircles",
    name: "Shoulder circles",
    icon: "🙆",
    start: "Stand or sit tall, fingertips resting on your shoulders.",
    steps: [
      "Draw slow circles with your elbows.",
      "Make the circles only as big as feels comfortable.",
      "Switch direction halfway.",
    ],
    reps: "About 5 circles each way",
  },
  {
    id: "catCow",
    name: "Seated cat-cow",
    icon: "🐈",
    start: "Sit near the front of your chair, hands on your knees.",
    steps: [
      "Breathe in and gently lift your chest, looking slightly up.",
      "Breathe out and round your back, letting your chin drop.",
      "Move slowly between the two with your breath.",
    ],
    reps: "About 5 slow rounds",
  },
  {
    id: "hipCircles",
    name: "Gentle hip circles",
    icon: "⭕",
    start: "Stand with feet hip-width apart, hands on your hips. Hold a chair or desk if you like.",
    steps: [
      "Slowly circle your hips as if tracing a small circle.",
      "Keep your knees soft and the movement small.",
      "Change direction after a few circles.",
    ],
    reps: "About 5 circles each way",
  },
  {
    id: "march",
    name: "Easy knee lifts",
    icon: "🚶",
    start: "Stand tall, holding a chair or desk for balance if needed. You can also do this seated.",
    steps: [
      "Lift one knee to a comfortable height.",
      "Lower it slowly and lift the other knee.",
      "Keep an easy, steady rhythm.",
    ],
    reps: "About 10 lifts in total",
  },
  {
    id: "ankleCircles",
    name: "Ankle circles",
    icon: "🦶",
    start: "Sit with one foot lifted slightly, or stand holding something steady.",
    steps: [
      "Draw slow circles with your foot.",
      "Change direction after a few circles.",
      "Switch to the other foot.",
    ],
    reps: "About 5 circles each way, each foot",
  },
  {
    id: "reachBreathe",
    name: "Reach and breathe",
    icon: "🙋",
    start: "Sit or stand comfortably.",
    steps: [
      "Breathe in as you reach your arms up comfortably.",
      "Breathe out as you lower them slowly.",
      "Finish with one relaxed breath.",
    ],
    reps: "3 slow breaths",
  },
];

export const DICE_SUGGESTIONS = [
  { icon: "🧍", text: "Stand up and stretch in whatever way feels comfortable." },
  { icon: "🚶", text: "Take a short walking break, even just a couple of minutes." },
  { icon: "🤷", text: "Roll your shoulders gently, a few times each way." },
  { icon: "✋", text: "Stretch your wrists and spread your fingers wide." },
  { icon: "🦶", text: "Do a few comfortable ankle circles with each foot." },
  { icon: "🌬️", text: "Take a few slow, relaxed breaths." },
];

export const PAIN_REMINDER =
  "Move gently and within your comfort. Stop if anything causes pain, dizziness, or feels wrong.";
