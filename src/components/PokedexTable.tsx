"use client";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
} from "@mui/material";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

export const PokedexTable = ({ pokemons }: { pokemons: Pokemon[] }) => {
  const sorted = [...pokemons].sort((a, b) => a.id - b.id);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell><Typography fontWeight={700}>ID</Typography></TableCell>
            <TableCell><Typography fontWeight={700}>Name</Typography></TableCell>
            <TableCell><Typography fontWeight={700}>Type</Typography></TableCell>
            <TableCell><Typography fontWeight={700}>Sprite</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((pokemon) => (
            <TableRow key={pokemon.id} hover>
              <TableCell>
                <Typography color="text.secondary" fontWeight={600}>#{pokemon.id}</Typography>
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>{pokemon.name}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>{pokemon.types.join(", ")}</TableCell>
              <TableCell>
                <img src={pokemon.sprite} alt={pokemon.name} width={50} height={50} style={{ objectFit: "contain" }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};