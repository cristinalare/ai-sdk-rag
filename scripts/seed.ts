import { createResource } from "@/lib/actions/resources";

const knowledge = [
  {
    content: `Gardening is the process of growing plants for their vegetables, fruits, flowers, herbs, and appearances within a designated space. Gardens fulfill a wide assortment of purposes, notably the production of aesthetically pleasing areas, medicines, cosmetics, dyes, foods, poisons, wildlife habitats, and saleable goods (see market gardening).`,
  },
  {
    content: ` People often partake in gardening for its therapeutic, health, educational, cultural, philosophical, environmental, and religious benefits.`,
  },
];

async function seed() {
  for (const item of knowledge) {
    try {
      const result = await createResource({ content: item.content });
      console.log(`✅ Seeded knowledge item: ${result}`);
    } catch (error) {
      console.error(`❌ Failed to seed item:`, error);
    }
  }

  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch(console.error);
