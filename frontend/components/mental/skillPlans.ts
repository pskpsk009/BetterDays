// Content and plan builders for Develop Your Skill. Advice is general,
// practical, and optional: a starting point, not a programme to follow.

export type SkillStep = {
  title: string;
  body: string;
  tryThis: string;
  /** Short practice ideas for a single session while on this step. */
  today: string[];
};

export type SkillArea = {
  id: string;
  label: string;
  icon: string;
  examples: string;
  tips: string[];
};

export const SKILL_AREAS: SkillArea[] = [
  {
    id: "creative",
    label: "Art & design",
    icon: "🎨",
    examples: "Drawing, painting, photography, design",
    tips: [
      "Copy work you admire to learn how it was made, then try your own version.",
      "Keep a small sketchbook or photo folder and add to it often.",
      "Study one basic at a time: shapes, light, colour, or composition.",
    ],
  },
  {
    id: "music",
    label: "Music",
    icon: "🎵",
    examples: "An instrument, singing, producing",
    tips: [
      "Practise slowly first. Speed comes after accuracy.",
      "Record yourself and listen back a day later.",
      "Learn a song you love: motivation does a lot of the work.",
    ],
  },
  {
    id: "sport",
    label: "Sport & movement",
    icon: "⚽",
    examples: "A sport, dance, fitness, martial arts",
    tips: [
      "Warm up, and build intensity gradually to avoid injury.",
      "Film your technique or ask a coach to watch one rep.",
      "Rest days are part of getting better, not a break from it.",
    ],
  },
  {
    id: "tech",
    label: "Tech & coding",
    icon: "💻",
    examples: "Coding, editing video, 3D, spreadsheets",
    tips: [
      "Build a tiny project instead of only watching tutorials.",
      "When you're stuck, write down exactly what you expected and what happened.",
      "Read other people's work to pick up better habits.",
    ],
  },
  {
    id: "language",
    label: "Languages & writing",
    icon: "🗣️",
    examples: "A new language, writing, public speaking",
    tips: [
      "Use it a little every day: five minutes beats one long session a week.",
      "Speak or write before you feel ready. Mistakes are how it sticks.",
      "Read or listen to things you'd enjoy anyway, in your target style or language.",
    ],
  },
  {
    id: "practical",
    label: "Practical skills",
    icon: "🍳",
    examples: "Cooking, sewing, fixing things, gardening",
    tips: [
      "Repeat the same recipe or project until it feels easy, then change one thing.",
      "Learn the why behind each step, not just the steps.",
      "Ask someone experienced if you can watch or help them once.",
    ],
  },
  {
    id: "other",
    label: "Something else",
    icon: "✨",
    examples: "Anything you'd like to improve",
    tips: [
      "Find one person who does it well and notice what they do differently.",
      "Break the skill into smaller parts and practise the weakest one.",
    ],
  },
];

export type SkillLevel = "starting" | "some" | "confident";

export const SKILL_LEVELS: { id: SkillLevel; label: string; detail: string }[] = [
  { id: "starting", label: "Just getting started", detail: "I know a little and want to build the basics." },
  { id: "some", label: "Some experience", detail: "I can do it, but I've stopped improving much." },
  { id: "confident", label: "Fairly confident", detail: "I'm good at it and want to take it further." },
];

const FOCUS_BY_LEVEL: Record<SkillLevel, string> = {
  starting: "Choose one basic to get comfortable with first, like a core technique or a simple piece.",
  some: "Notice what feels hardest or what you avoid. That's usually where the biggest gains are.",
  confident: "Pick one detail that would make the biggest difference, or a challenge just beyond your current level.",
};

const PRACTICE_BY_LEVEL: Record<SkillLevel, string> = {
  starting: "10–15 minutes, three or four times a week",
  some: "15–30 minutes, a few times a week",
  confident: "focused sessions on your chosen challenge, a few times a week",
};

/** Step-by-step plan for polishing a skill someone already has. */
export function polishSteps(skill: string, level: SkillLevel, area?: SkillArea): SkillStep[] {
  const steps: SkillStep[] = [
    {
      title: "Pick one thing to improve",
      body: `Trying to improve everything at once is tiring. ${FOCUS_BY_LEVEL[level]}`,
      tryThis: `Write one sentence: "This week I'm working on ___ in ${skill}."`,
      today: [
        `Spend five minutes noticing which part of ${skill} feels hardest.`,
        `Try your focus area slowly, three times, and see what changes.`,
        `Write down one thing you'd like to be able to do in ${skill} a month from now.`,
      ],
    },
    {
      title: "Practise little and often",
      body: "Short, regular sessions build skill faster than rare long ones, and they're easier to keep up.",
      tryThis: `Plan ${PRACTICE_BY_LEVEL[level]}. Put it somewhere you'll see it.`,
      today: [
        "Set a timer for 15 minutes and practise only your focus area.",
        "Pick a regular time for practice and do a short session at that time today.",
        "Do a short session even if you're busy: five minutes still counts.",
      ],
    },
    {
      title: "Practise on purpose",
      body: "Work slightly beyond what's comfortable. Slow down on the tricky part and repeat it, rather than only doing what you're already good at.",
      tryThis: "Spend the first half of each session on the hard part, then finish with something you enjoy.",
      today: [
        "Spend the first half on the tricky part, then finish with something you enjoy.",
        "Slow the hard part right down and repeat it until it feels a little easier.",
        "Make today's practice slightly harder than last time, by one small step.",
      ],
    },
    {
      title: "Get feedback",
      body: "It's hard to see your own blind spots. Feedback shows you what to change next.",
      tryThis: "Record, photograph, or save your work, or ask someone you trust for one thing to improve.",
      today: [
        "Record or photograph today's practice so you can look back at it tomorrow.",
        "Ask someone you trust for one thing that's going well and one thing to try.",
        "Compare today's work with something you did a week ago.",
      ],
    },
    {
      title: "Learn from others",
      body: "People who are a little further along can show you shortcuts and new ideas.",
      tryThis: `Find one tutorial, class, book, or community about ${skill} and try one idea from it.`,
      today: [
        `Watch one short tutorial about ${skill} and try one idea from it.`,
        `Watch someone who's good at ${skill} and notice one thing they do differently.`,
        "Copy a technique you admire, then try it your own way.",
      ],
    },
    {
      title: "Notice your progress",
      body: "Progress is easy to miss day to day. Looking back shows how far you've come and what to focus on next.",
      tryThis: "After two weeks, compare with where you started. Keep your focus, or pick the next one.",
      today: [
        "Do something you couldn't do when you started, and notice how it feels.",
        "Write down one thing that's easier now than it was two weeks ago.",
        "Choose what you'd like to work on in your next round.",
      ],
    },
  ];
  if (area && area.tips.length) {
    steps.splice(5, 0, {
      title: `Tips for ${area.label.toLowerCase()}`,
      body: area.tips.join("\n\n"),
      tryThis: "Pick the tip that sounds most useful and try it in your next session.",
      today: area.tips,
    });
  }
  return steps;
}

export type Interest = {
  id: string;
  label: string;
  icon: string;
  skills: { name: string; why: string }[];
};

export const INTERESTS: Interest[] = [
  {
    id: "making",
    label: "Making things",
    icon: "🛠️",
    skills: [
      { name: "Drawing", why: "Needs only paper and a pen to start." },
      { name: "Crafts or sewing", why: "You end up with something you made." },
      { name: "Cooking", why: "Useful every day, and you can eat the results." },
    ],
  },
  {
    id: "music",
    label: "Music & sound",
    icon: "🎧",
    skills: [
      { name: "Playing an instrument", why: "Free apps and videos make the first steps easy." },
      { name: "Singing", why: "You can practise anywhere." },
      { name: "Making beats", why: "Free apps let you start on a phone." },
    ],
  },
  {
    id: "moving",
    label: "Moving & being active",
    icon: "🏃",
    skills: [
      { name: "Dance", why: "One song is enough for a practice session." },
      { name: "A new sport", why: "A good way to meet people too." },
      { name: "Yoga or stretching", why: "Gentle, and you can start at home." },
    ],
  },
  {
    id: "words",
    label: "Words & stories",
    icon: "📖",
    skills: [
      { name: "Creative writing", why: "Start with a few lines a day." },
      { name: "A new language", why: "Five minutes a day adds up quickly." },
      { name: "Public speaking", why: "Helps in class, work, and everyday life." },
    ],
  },
  {
    id: "puzzles",
    label: "Solving problems",
    icon: "🧩",
    skills: [
      { name: "Coding", why: "Lots of free beginner courses exist." },
      { name: "Chess or strategy games", why: "Easy to learn, endless to master." },
      { name: "Fixing things", why: "Saves money and feels satisfying." },
    ],
  },
  {
    id: "people",
    label: "Helping & connecting",
    icon: "🤝",
    skills: [
      { name: "Listening and conversation", why: "Makes every relationship easier." },
      { name: "Teaching or tutoring", why: "Explaining things helps you learn them too." },
      { name: "Organising events", why: "Brings people together around something fun." },
    ],
  },
  {
    id: "visual",
    label: "Visuals & tech",
    icon: "📷",
    skills: [
      { name: "Photography", why: "Your phone camera is enough to start." },
      { name: "Video editing", why: "Free editors run on most phones." },
      { name: "Graphic design", why: "Useful for projects, posters, and social posts." },
    ],
  },
  {
    id: "nature",
    label: "Nature & outdoors",
    icon: "🌱",
    skills: [
      { name: "Gardening", why: "Even one pot plant is a start." },
      { name: "Hiking and navigation", why: "Gets you outside and exploring." },
      { name: "Nature photography or sketching", why: "Helps you notice more around you." },
    ],
  },
];

/** Skill ideas matching the chosen interests, without duplicates. */
export function suggestSkills(interestIds: string[]) {
  const seen = new Set<string>();
  return INTERESTS.filter((interest) => interestIds.includes(interest.id))
    .flatMap((interest) => interest.skills.map((skill) => ({ ...skill, icon: interest.icon })))
    .filter((skill) => !seen.has(skill.name) && seen.add(skill.name));
}

/** Step-by-step plan for starting a brand-new skill. */
export function startSteps(skill: string): SkillStep[] {
  return [
    {
      title: "Give it a two-week try",
      body: "You don't have to commit forever. Treat it as an experiment and see how it feels.",
      tryThis: `Tell yourself: "For the next two weeks, I'm trying ${skill}."`,
      today: [
        `Spend ten minutes just playing around with ${skill}, with no goal.`,
        `Write down why ${skill} caught your interest.`,
        "Pick the three days this week you'll try it.",
      ],
    },
    {
      title: "Start tiny",
      body: "Small sessions keep it easy and fun. It's fine if you're not good at it yet: that's what starting means.",
      tryThis: "Plan 10 minutes, three times this week.",
      today: [
        "Do just ten minutes today. Stop while it still feels fun.",
        "Get out what you need and try one tiny thing.",
        "Practise at the same time as something you already do every day.",
      ],
    },
    {
      title: "Find one beginner resource",
      body: "One good starting point is better than ten saved and never opened.",
      tryThis: `Pick one free beginner video, app, book, or class for ${skill}.`,
      today: [
        `Search for one beginner video on ${skill} and watch the first part.`,
        "Follow the first lesson of a free app or course.",
        `Ask someone who does ${skill} where they started.`,
      ],
    },
    {
      title: "Learn the basics first",
      body: "Every skill has a few foundations. Getting comfortable with them makes everything after easier.",
      tryThis: 'Look up "the first things beginners learn" and practise just one.',
      today: [
        "Practise one basic move or technique five times, slowly.",
        "Repeat yesterday's basic, then add one small new thing.",
        "Write down the basics you've tried so far.",
      ],
    },
    {
      title: "Celebrate small wins",
      body: "Noticing what you can do now that you couldn't before keeps you going.",
      tryThis: "After each session, note one thing that went a little better.",
      today: [
        "After practising, name one thing that went a little better.",
        "Show someone what you can do now.",
        "Do the thing you found hardest on day one and notice the difference.",
      ],
    },
    {
      title: "Check in after two weeks",
      body: "Ask yourself whether you enjoyed it. Keep going, change how you practise, or try a different skill. Every option is fine.",
      tryThis: "Ask yourself: did I look forward to practising? What would make it more fun?",
      today: [
        "Have a relaxed session just for fun, then think about how the two weeks went.",
        "Ask yourself which part you enjoyed most.",
        "Decide what you'd like to do next with this skill.",
      ],
    },
  ];
}
