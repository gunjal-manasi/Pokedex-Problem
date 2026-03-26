import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  await prisma.pokemon.createMany({
    data: [
      { name: "Bulbasaur",  types: ["grass"],    sprite: "https://pokemon.com/pictures/bulbasaur.png" },
      { name: "Charmander", types: ["fire"],     sprite: "https://pokemon.com/pictures/charmander.png" },
      { name: "Squirtle",   types: ["water"],    sprite: "https://pokemon.com/pictures/squirtle.png" },
      { name: "Pikachu",    types: ["electric"], sprite: "https://pokemon.com/pictures/pikachu.png" },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Data seeded successfully");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });