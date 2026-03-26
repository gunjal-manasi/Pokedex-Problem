import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { prisma } from "../../db";

export const pokemonRouter = router({
  getPokemon: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await prisma.pokemon.findUnique({ where: { name: input } });
    }),

  getPokemonArray: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input }) => {
      return await prisma.pokemon.findMany({
        where: { name: { in: input } },
        orderBy: { id: "asc" },
      });
    }),

  getAllPokemon: publicProcedure.query(async () => {
    return await prisma.pokemon.findMany({ orderBy: { id: "asc" } });
  }),

  getAllTypes: publicProcedure.query(async () => {
    const pokemons = await prisma.pokemon.findMany({ select: { types: true } });
    const unique = [...new Set(pokemons.flatMap((p) => p.types))].sort();
    return unique;
  }),

  getPokemonByType: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      if (!input) {
        return await prisma.pokemon.findMany({ orderBy: { id: "asc" } });
      }
      return await prisma.pokemon.findMany({
        where: { types: { has: input } },
        orderBy: { id: "asc" },
      });
    }),
});
