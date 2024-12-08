import items from "./items.json" with { type: "json" };
import { Card, Enemy, Level, Item } from "./schema.ts";
//import { fakerHU as faker } from "@faker-js/faker";
//import translate from "translate";

export async function seedEnemies() {
  /*
  const enemies = await Promise.all(
    items.creatures.filter((creature) => creature.type != "Player").map(
      async (
        enemy: {
          name: string;
          type: string;
          minHP: string;
          maxHP: string;
          mod: string;
        },
      ) => {
        const name = await translate(enemy.name, "hu");

        return {
          name: (faker.word.adjective() + " " + name).split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          category: enemy.type,
          description: faker.lorem.sentence(),
          health: Number(enemy.minHP),
          attack: Math.floor(Math.random() * 10) +
            10 * (enemy.type === "boss" ? 2 : (enemy.type === "elite" ? 1 : 0)),
          defense: Number(enemy.maxHP) - Number(enemy.minHP),
          image: "",
        };
      },
    ),
  );*/
  const enemies = items.creatures;
  try {
    await Enemy.insertMany(enemies);
    console.log("Enemies seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedCards() {
  /*const cards = await Promise.all(items.cards.map(async (card: { name: string; description: string; type: string; rarity: string; cost: number }) => {
    const name = await translate(card.name, "hu");
    const description = await translate(card.description, "hu");
    const type = await translate(card.type, "hu");
    const rarity = await translate(card.rarity, "hu");
    return {
      category: card.type,
      name: name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      description: description,
      class: type,
      cost: card.cost,
      rarity: rarity,
      image: "",
    };
  }));*/
  const cards = await items.cards;

  try {
    await Card.insertMany(cards);
    console.log("Cards seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedLevels() {
  /*const levels = [];
  for (let i = 10; i > 0; i--) {
    levels.push({
      name: `${(i)}. szint - ${faker.location.street()}`,
      description: faker.lorem.sentence(),
      image: "",
    });
  }*/
  const levels = items.levels;
  try {
    await Level.insertMany(levels);
    console.log("Levels seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function seedItems() {
  /*const relics = await Promise.all(items.relics.map(async (item: { name: string; flavorText: string }) => {
    const name = await translate(item.name, "hu");
    const description = await translate(item.flavorText, "hu");
    return {
      name: name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      description: description,
      image: "",
    };
  }));*/
  const relics = await items.relics;
  try {
    await Item.insertMany(relics);
    console.log("Items seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}