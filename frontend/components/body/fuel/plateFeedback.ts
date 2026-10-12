// Pure, non-judgemental feedback for the Build a Balanced Plate activity.
// The plate has four equal quarters; each holds one food group or is empty.

export type FoodGroup = "produce" | "protein" | "carbs" | "fats";

export type PlateQuarter = FoodGroup | null;

export const FOOD_GROUPS: Record<
  FoodGroup,
  { name: string; short: string; icon: string; color: string; examples: string; provides: string }
> = {
  produce: {
    name: "Vegetables and fruits",
    short: "Veg & fruit",
    icon: "🥦",
    color: "#7BBF6A",
    examples: "e.g. leafy greens, carrots, berries, apples",
    provides: "Vegetables and fruits contribute fibre, vitamins, and minerals.",
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

export const GROUP_ORDER: FoodGroup[] = ["produce", "protein", "carbs", "fats"];

export type PlateCounts = Record<FoodGroup, number>;

export function countPlate(plate: PlateQuarter[]): PlateCounts {
  const counts: PlateCounts = { produce: 0, protein: 0, carbs: 0, fats: 0 };
  for (const quarter of plate) if (quarter) counts[quarter] += 1;
  return counts;
}

/** Percentage of the whole plate per group (each quarter is 25%). */
export function platePercentages(plate: PlateQuarter[]): PlateCounts {
  const counts = countPlate(plate);
  return {
    produce: counts.produce * 25,
    protein: counts.protein * 25,
    carbs: counts.carbs * 25,
    fats: counts.fats * 25,
  };
}

export function describeComposition(plate: PlateQuarter[]): string {
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
  produce: {
    title: "An all-vegetable-and-fruit plate",
    points: [
      FOOD_GROUPS.produce.provides,
      "On their own, vegetables and fruits may provide less protein and longer-lasting energy than a mixed meal.",
      "Adding a protein or grain alongside them can help the meal keep you going.",
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

export function plateFeedback(plate: PlateQuarter[]): PlateFeedback {
  const counts = countPlate(plate);
  const filled = plate.filter(Boolean).length;
  const present = GROUP_ORDER.filter((group) => counts[group] > 0);
  const missing = GROUP_ORDER.filter((group) => counts[group] === 0);

  if (filled === 0) {
    return { title: "Your plate is empty", points: ["Add food groups to the plate to see feedback."] };
  }

  let result: PlateFeedback;

  if (present.length === 1 && filled === 4) {
    result = { ...SINGLE_GROUP[present[0]], points: [...SINGLE_GROUP[present[0]].points] };
  } else if (counts.produce === 2 && counts.protein === 1 && counts.carbs === 1) {
    result = {
      title: "Plenty of colour, with protein and energy",
      points: [
        "Half the plate is vegetables and fruits, giving a good range of fibre, vitamins, and minerals.",
        "The protein quarter supports growth and repair, and the carbohydrate quarter provides energy.",
        "Adding a small amount of healthy fat, like olive oil or seeds, is one way to add even more variety.",
      ],
    };
  } else if (counts.carbs === 2 && counts.protein === 1 && counts.produce === 1) {
    result = {
      title: "Energy-focused, with protein and plants",
      points: [
        "Carbohydrates provide energy, protein supports growth and tissue repair, and vegetables and fruits contribute fibre, vitamins, and minerals.",
        "Adding variety, such as a wider range of vegetables, and a source of healthy fat can help make meals more balanced.",
      ],
    };
  } else if (present.length === 4) {
    result = {
      title: "All four food groups",
      points: [
        "This plate includes every food group, which is an easy way to get a wide variety of nutrients in one meal.",
        ...present.map((group) => FOOD_GROUPS[group].provides),
      ],
    };
  } else {
    result = {
      title: filled < 4 ? "Your plate so far" : "A mixed plate",
      points: [
        ...present.map((group) => FOOD_GROUPS[group].provides),
        `To add variety, you could try including ${missing
          .map((group) => FOOD_GROUPS[group].name.toLowerCase())
          .join(" or ")}.`,
      ],
    };
  }

  if (filled < 4) {
    result.points.push(
      `${4 - filled} quarter${4 - filled === 1 ? " is" : "s are"} still empty. Fill the plate to explore a whole meal.`,
    );
  }
  result.points.push(NEEDS_DIFFER);
  return result;
}
