// Approximate per-250 ml estimates for Drink Detective. Values vary by brand,
// recipe, and serving, so the UI always labels them as estimates.

export type DrinkId = "water" | "tea" | "milk" | "juice" | "soda" | "coffee";

export type Drink = {
  id: DrinkId;
  name: string;
  icon: string;
  /** Share of the drink that is water, 0..1. */
  waterShare: number;
  caffeineMgPer250: number;
  addedSugarGPer250: number;
  naturalSugarGPer250: number;
  note: string;
};

export const DRINKS: Drink[] = [
  {
    id: "water",
    name: "Plain water",
    icon: "💧",
    waterShare: 1,
    caffeineMgPer250: 0,
    addedSugarGPer250: 0,
    naturalSugarGPer250: 0,
    note: "Hydrates with no caffeine or sugar.",
  },
  {
    id: "tea",
    name: "Unsweetened tea",
    icon: "🍵",
    waterShare: 0.99,
    caffeineMgPer250: 40,
    addedSugarGPer250: 0,
    naturalSugarGPer250: 0,
    note: "Black tea shown; green and herbal teas usually have less or no caffeine.",
  },
  {
    id: "milk",
    name: "Milk",
    icon: "🥛",
    waterShare: 0.88,
    caffeineMgPer250: 0,
    addedSugarGPer250: 0,
    naturalSugarGPer250: 12,
    note: "Plain milk's sugar is naturally occurring lactose. Flavoured milks add sugar.",
  },
  {
    id: "juice",
    name: "Fruit juice",
    icon: "🧃",
    waterShare: 0.88,
    caffeineMgPer250: 0,
    addedSugarGPer250: 0,
    naturalSugarGPer250: 21,
    note: "100% orange juice shown. Its sugar comes from the fruit, but juicing releases it, so many guidelines count juice sugar as 'free sugar'. Juice drinks may add sugar.",
  },
  {
    id: "soda",
    name: "Soft drink",
    icon: "🥤",
    waterShare: 0.89,
    caffeineMgPer250: 24,
    addedSugarGPer250: 27,
    naturalSugarGPer250: 0,
    note: "Regular cola shown. Sugar-free versions have little or no sugar; caffeine varies by type.",
  },
  {
    id: "coffee",
    name: "Coffee",
    icon: "☕",
    waterShare: 0.99,
    caffeineMgPer250: 100,
    addedSugarGPer250: 0,
    naturalSugarGPer250: 0,
    note: "Brewed black coffee shown. Caffeine varies a lot by bean and brew; added milk, sugar, or syrup changes the numbers.",
  },
];

export const SERVINGS = [
  { label: "Small cup", ml: 150 },
  { label: "Mug", ml: 250 },
  { label: "Bottle", ml: 500 },
];

export type DrinkEstimate = {
  waterMl: number;
  caffeineMg: number;
  addedSugarG: number;
  naturalSugarG: number;
};

export function estimateDrink(drink: Drink, servingMl: number): DrinkEstimate {
  const scale = servingMl / 250;
  return {
    waterMl: Math.round(drink.waterShare * servingMl),
    caffeineMg: Math.round(drink.caffeineMgPer250 * scale),
    addedSugarG: Math.round(drink.addedSugarGPer250 * scale),
    naturalSugarG: Math.round(drink.naturalSugarGPer250 * scale),
  };
}
