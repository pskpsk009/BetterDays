// Pure, non-judgemental feedback for the Build a Balanced Plate activity.
// The plate has five equal slices of 20%; each holds one food group or is empty.

export type FoodGroup = "vegetables" | "fruits" | "protein" | "carbs" | "fats";

export type PlateSlice = FoodGroup | null;

export const SLICE_COUNT = 5;
export const SLICE_PERCENT = 100 / SLICE_COUNT;

export const FOOD_GROUPS: Record<
  FoodGroup,
  { name: string; short: string; icon: string; color: string; examples: string; provides: string }
> = {
  vegetables: {
    name: "Vegetables",
    short: "Vegetables",
    icon: "🥦",
    color: "#7BBF6A",
    examples: "e.g. leafy greens, carrots, broccoli, peppers",
    provides: "Vegetables contribute fibre, vitamins, and minerals.",
  },
  fruits: {
    name: "Fruits",
    short: "Fruits",
    icon: "🍎",
    color: "#E07A8F",
    examples: "e.g. berries, apples, bananas, oranges",
    provides: "Fruits add fibre, vitamins, and natural sweetness.",
  },
  protein: {
    name: "Protein",
    short: "Protein",
    icon: "🍳",
    color: "#E39A6B",
    examples: "e.g. beans, lentils, eggs, fish, tofu, chicken",
    provides: "Protein supports growth and the repair of body tissues.",
  },
  carbs: {
    name: "Carbohydrates and whole grains",
    short: "Carbs & grains",
    icon: "🍚",
    color: "#E2C26A",
    examples: "e.g. rice, oats, wholegrain bread, potatoes, pasta",
    provides: "Carbohydrates are an important source of energy, and whole grains add fibre.",
  },
  fats: {
    name: "Healthy fats",
    short: "Healthy fats",
    icon: "🥑",
    color: "#9C8FD0",
    examples: "e.g. avocado, nuts, seeds, olive oil",
    provides: "Healthy fats help your body absorb some vitamins and add flavour and fullness.",
  },
};

export const GROUP_ORDER: FoodGroup[] = ["vegetables", "fruits", "protein", "carbs", "fats"];

export type PlateCounts = Record<FoodGroup, number>;

export function countPlate(plate: PlateSlice[]): PlateCounts {
  const counts: PlateCounts = { vegetables: 0, fruits: 0, protein: 0, carbs: 0, fats: 0 };
  for (const slice of plate) if (slice) counts[slice] += 1;
  return counts;
}

/** Percentage of the whole plate per group (each slice is 20%). */
export function platePercentages(plate: PlateSlice[]): PlateCounts {
  const counts = countPlate(plate);
  const percentages = { ...counts };
  for (const group of GROUP_ORDER) percentages[group] = counts[group] * SLICE_PERCENT;
  return percentages;
}

export function describeComposition(plate: PlateSlice[]): string {
  const percentages = platePercentages(plate);
  return GROUP_ORDER.filter((group) => percentages[group] > 0)
    .map((group) => `${percentages[group]}% ${FOOD_GROUPS[group].short.toLowerCase()}`)
    .join(" · ");
}

export type PlateFeedback = { title: string; points: string[] };

const NEEDS_DIFFER =
  "Everyone's needs are different, and one meal doesn't define your overall health. This is general information, not personal nutrition advice.";

const SINGLE_GROUP: Record<FoodGroup, PlateFeedback> = {
  protein: {
    title: "An all-protein plate",
    points: [
      FOOD_GROUPS.protein.provides,
      "A meal made entirely of protein foods may leave less room for fibre-rich foods, carbohydrates, and other nutrients.",
      "Over time, regularly leaving out whole food groups can make it harder to meet nutritional needs. Adding a vegetable or a grain is one easy way to mix it up.",
    ],
  },
  carbs: {
    title: "An all-carbohydrate plate",
    points: [
      FOOD_GROUPS.carbs.provides,
      "A meal of only carbohydrate foods may provide less protein, healthy fats, and variety.",
      "Pairing carbs with some protein, vegetables, or fruit can round the meal out.",
    ],
  },
  vegetables: {
    title: "An all-vegetable plate",
    points: [
      FOOD_GROUPS.vegetables.provides,
      "On their own, vegetables may provide less protein and longer-lasting energy than a mixed meal.",
      "Adding a protein or grain alongside them can help the meal keep you going.",
    ],
  },
  fruits: {
    title: "An all-fruit plate",
    points: [
      FOOD_GROUPS.fruits.provides,
      "A meal of only fruit may provide little protein or longer-lasting energy.",
      "Fruit works well alongside a protein or grain, for example with yoghurt or oats.",
    ],
  },
  fats: {
    title: "An all-fats plate",
    points: [
      FOOD_GROUPS.fats.provides,
      "A meal of only fat-rich foods may provide little fibre, protein, or carbohydrate energy.",
      "Healthy fats tend to work well as one part of a mixed plate.",
    ],
  },
};

export function plateFeedback(plate: PlateSlice[]): PlateFeedback {
  const counts = countPlate(plate);
  const filled = plate.filter(Boolean).length;
  const present = GROUP_ORDER.filter((group) => counts[group] > 0);
  const missing = GROUP_ORDER.filter((group) => counts[group] === 0);
  const plants = counts.vegetables + counts.fruits;

  if (filled === 0) {
    return { title: "Your plate is empty", points: ["Add food groups to the plate to see feedback."] };
  }

  let result: PlateFeedback;

  if (present.length === 1 && filled === SLICE_COUNT) {
    result = { ...SINGLE_GROUP[present[0]], points: [...SINGLE_GROUP[present[0]].points] };
  } else if (present.length === GROUP_ORDER.length) {
    result = {
      title: "All five food groups",
      points: [
        "This plate includes every food group, which is an easy way to get a wide variety of nutrients in one meal.",
        ...present.map((group) => FOOD_GROUPS[group].provides),
      ],
    };
  } else if (plants >= 3 && counts.protein >= 1 && counts.carbs >= 1) {
    result = {
      title: "Plenty of colour, with protein and energy",
      points: [
        "More than half the plate is vegetables and fruits, giving a good range of fibre, vitamins, and minerals.",
        "The protein supports growth and repair, and the carbohydrates provide energy.",
        "Adding a small amount of healthy fat, like olive oil or seeds, is one way to add even more variety.",
      ],
    };
  } else if (counts.carbs >= 2 && counts.protein >= 1 && plants >= 1) {
    result = {
      title: "Energy-focused, with protein and plants",
      points: [
        "Carbohydrates provide energy, protein supports growth and tissue repair, and vegetables and fruits contribute fibre, vitamins, and minerals.",
        "Adding variety, such as a wider range of vegetables, and a source of healthy fat can help make meals more balanced.",
      ],
    };
  } else {
    result = {
      title: filled < SLICE_COUNT ? "Your plate so far" : "A mixed plate",
      points: [
        ...present.map((group) => FOOD_GROUPS[group].provides),
        `To add variety, you could try including ${missing
          .map((group) => FOOD_GROUPS[group].name.toLowerCase())
          .join(" or ")}.`,
      ],
    };
  }

  const empty = SLICE_COUNT - filled;
  if (empty > 0) {
    result.points.push(
      `${empty} slice${empty === 1 ? " is" : "s are"} still empty. Fill the plate to explore a whole meal.`,
    );
  }
  result.points.push(NEEDS_DIFFER);
  return result;
}
