"use client";

import { TableRow, TableCell, Typography } from "@mui/material";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

interface PokemonRowProps {
  pokemon: Pokemon;
}

export default function PokemonRow({ pokemon }: PokemonRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography color="text.secondary" fontWeight={600}>#{pokemon.id}</Typography>
      </TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>{pokemon.name}</TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>{pokemon.types.join(", ")}</TableCell>
      <TableCell>
        <img src={pokemon.sprite} alt={pokemon.name} width={50} height={50} style={{ objectFit: "contain" }} />
      </TableCell>
    </TableRow>
  );
}