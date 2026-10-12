// Pure game rules for Target Tap, a casual attention game (not a test).

export type ShapeKind = "circle" | "square" | "triangle";
export type ShapeColor = "blue" | "orange" | "green" | "pink";

export type Rule = { shape: ShapeKind; color: ShapeColor };

export type Cell = {
  id: string;
  shape: ShapeKind;
  color: ShapeColor;
  isTarget: boolean;
};

export type LevelId = "easy" | "medium" | "hard";

export type Level = {
  id: LevelId;
  name: string;
  detail: string;
  columns: number;
  cells: number;
  targets: number;
  /** Distractors may share the target's colour or shape (harder to spot). */
  similarDistractors: boolean;
  /** The target rule changes on every new board. */
  switchingRules: boolean;
  roundMs: number;
};

export const LEVELS: Level[] = [
  {
    id: "easy",
    name: "Easy",
    detail: "Targets look clearly different from everything else.",
    columns: 3,
    cells: 12,
    targets: 4,
    similarDistractors: false,
    switchingRules: false,
    roundMs: 30000,
  },
  {
    id: "medium",
    name: "Medium",
    detail: "Some shapes share the target's colour or shape.",
    columns: 4,
    cells: 16,
    targets: 5,
    similarDistractors: true,
    switchingRules: false,
    roundMs: 30000,
  },
  {
    id: "hard",
    name: "Hard",
    detail: "Look-alike shapes, and the target changes every board.",
    columns: 4,
    cells: 20,
    targets: 5,
    similarDistractors: true,
    switchingRules: true,
    roundMs: 30000,
  },
];

export const SHAPES: ShapeKind[] = ["circle", "square", "triangle"];
export const COLORS: ShapeColor[] = ["blue", "orange", "green", "pink"];

const BASE_RULE: Rule = { shape: "circle", color: "blue" };
const SWITCH_RULES: Rule[] = [
  { shape: "circle", color: "blue" },
  { shape: "triangle", color: "orange" },
  { shape: "square", color: "green" },
];

export function ruleFor(level: Level, boardIndex: number): Rule {
  if (!level.switchingRules) return BASE_RULE;
  return SWITCH_RULES[boardIndex % SWITCH_RULES.length];
}

export function describeRule(rule: Rule): string {
  return `Tap every ${rule.color} ${rule.shape}`;
}

export function matchesRule(cell: Pick<Cell, "shape" | "color">, rule: Rule) {
  return cell.shape === rule.shape && cell.color === rule.color;
}

/** All non-target looks allowed as distractors for this level and rule. */
export function distractorLooks(level: Level, rule: Rule): Rule[] {
  const looks: Rule[] = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      const look = { shape, color };
      if (matchesRule(look, rule)) continue;
      const sharesFeature = shape === rule.shape || color === rule.color;
      if (level.similarDistractors || !sharesFeature) looks.push(look);
    }
  }
  return looks;
}

export function makeBoard(
  level: Level,
  boardIndex: number,
  random: () => number = Math.random,
): Cell[] {
  const rule = ruleFor(level, boardIndex);
  const looks = distractorLooks(level, rule);
  const similar = looks.filter(
    (look) => look.shape === rule.shape || look.color === rule.color,
  );

  const cells: Omit<Cell, "id">[] = [];
  for (let i = 0; i < level.targets; i += 1) {
    cells.push({ ...rule, isTarget: true });
  }
  for (let i = cells.length; i < level.cells; i += 1) {
    // On similar-distractor levels, bias toward look-alikes.
    const pool =
      level.similarDistractors && similar.length > 0 && random() < 0.6
        ? similar
        : looks;
    const look = pool[Math.floor(random() * pool.length)];
    cells.push({ ...look, isTarget: false });
  }

  // Fisher-Yates shuffle.
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return cells.map((cell, index) => ({ ...cell, id: `${boardIndex}-${index}` }));
}

export type RoundSummary = {
  score: number;
  correct: number;
  incorrect: number;
  /** Whole-number percentage, or null when nothing was tapped. */
  accuracy: number | null;
};

export const POINTS_CORRECT = 10;
export const POINTS_INCORRECT = 5;

export function summarizeRound(correct: number, incorrect: number): RoundSummary {
  const taps = correct + incorrect;
  return {
    score: Math.max(0, correct * POINTS_CORRECT - incorrect * POINTS_INCORRECT),
    correct,
    incorrect,
    accuracy: taps === 0 ? null : Math.round((correct / taps) * 100),
  };
}
