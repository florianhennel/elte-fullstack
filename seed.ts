import cardsData from './items.json' with { type: "json" };
import { Card } from './schema.ts';

export default async function seedDatabase() {
    const cards = cardsData.cards.map((card) => ({
        category: card.type,
        name: card.name,
        description: card.description,
        class: card.type==="spell" ? "Defensive" : "Offensive",
        cost: card.cost,
        rarity: card.rarity,
        image: "",
    }));
    try {
        await Card.insertMany(cards);
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};