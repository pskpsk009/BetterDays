// Plain-language summary of rule.md for users. Keep it in step with what the
// app really does today: no claims of certification or professional approval (LR8).

export type PrivacySection = { icon: string; title: string; points: string[] };

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    icon: "🌱",
    title: "What MyGrowth is",
    points: [
      "A tool for small, everyday wellbeing habits and reflection.",
      "It isn't therapy, medical advice, or a diagnosis, and it can't tell whether you're safe.",
      "Suggestions are always optional.",
    ],
  },
  {
    icon: "📱",
    title: "What stays on this phone",
    points: [
      "Most activities save nothing. When you leave them, what you entered is gone.",
      "My Support Circle, Values Compass, Develop Your Skill and Sleep Schedule Guidance remember what you add so you can come back to it.",
      "Sleep Schedule Guidance keeps your target times and the bed and wake-up times you log, for about six months, to show how closely you follow your schedule.",
      "Your welcome picks are saved so Home can show them first.",
      "None of this is sent to a server unless you turn on backup.",
    ],
  },
  {
    icon: "☁️",
    title: "What goes to our server",
    points: [
      "If you make an account: your email and a secure version of your password.",
      "If you turn on backup in Profile: a copy of the saved features above, so you can get them back on a new phone. It is kept until you turn backup off or delete your account.",
      "A short record of when you turned backup on or off, downloaded, or deleted your data, without the data itself. These records are deleted after 180 days.",
      "If you share a trail drawing: the image, indoor or outdoor, and the distance. Shared trails can be seen by anyone in the gallery.",
    ],
  },
  {
    icon: "🚫",
    title: "What we never do",
    points: [
      "We don't use your data for ads, sell it, or use it to profile you.",
      "We don't use it to diagnose you or decide anything about your health.",
      "Nobody else using MyGrowth can see your private data.",
    ],
  },
  {
    icon: "🗑",
    title: "Your choices",
    points: [
      "Delete all data in Profile removes everything on this phone, your backup, and any trails you shared.",
      "Each saving activity also has its own delete button.",
      "You can sign out at any time.",
      "Download my data gives you a copy of everything saved on this phone.",
      "Delete account removes your account and everything linked to it.",
    ],
  },
  {
    icon: "💛",
    title: "If you need support",
    points: [
      "If you are in immediate danger, contact local emergency services or someone you trust right away.",
      "If something feels heavy, reaching out to a trusted person, school counsellor, or local support line can help.",
    ],
  },
];
