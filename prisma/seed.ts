import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  // Delete existing data first
  await prisma.pokemon.deleteMany();

  await prisma.pokemon.createMany({
    data: [
      {
        name: "Bulbasaur",
        types: ["grass"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      },
      {
        name: "Charmander",
        types: ["fire"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      },
      {
        name: "Squirtle",
        types: ["water"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
      },
      {
        name: "Pikachu",
        types: ["electric"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      },
      {
        name: "Jigglypuff",
        types: ["normal", "fairy"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
      },
      {
        name: "Meowth",
        types: ["normal"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
      },
      {
        name: "Psyduck",
        types: ["water"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
      },
      {
        name: "Gengar",
        types: ["ghost", "poison"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
      },
      {
        name: "Eevee",
        types: ["normal"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
      },
      {
        name: "Snorlax",
        types: ["normal"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
      },
      {
        name: "Mewtwo",
        types: ["psychic"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
      },
      {
        name: "Mew",
        types: ["psychic"],
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
      },
    ],
  });

  console.log("🌱 Seeded successfully with real sprites!");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });