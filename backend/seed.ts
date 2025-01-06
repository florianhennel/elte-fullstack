//import items from "./items.json" with { type: "json" };
import enemies from "./data/enemies.json" with { type: "json" };
import cards from "./data/cards.json" with { type: "json" };
import items from "./data/items.json" with { type: "json" };
import levels from "./data/levels.json" with { type: "json" };
import { Card, Enemy, Level, Item } from "./schema.ts";

export async function seedEnemies() {
  try {
    await Enemy.insertMany(enemies);
    console.log("Enemies seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedCards() {
  try {
    await Card.insertMany(cards);
    console.log("Cards seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedLevels() {
  try {
    await Level.insertMany(levels);
    console.log("Levels seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedItems() {
  try {
    await Item.insertMany(items);
    console.log("Items seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}