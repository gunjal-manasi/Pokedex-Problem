"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import PokemonRow from "./PokemonRow";
import { PokedexTable } from "./PokedexTable";
import {
  Box, Button, TextField, Typography, Alert,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, 
} from "@mui/material";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

const PokemonForm = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"single" | "multiple" | null>(null);
  const [singlePokemon, setSinglePokemon] = useState<Pokemon | null>(null);
  const [pokemonArray, setPokemonArray] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);

  const singleQuery = trpc.pokemon.getPokemon.useQuery(input.trim(), {
    enabled: false,
  });

  const allQuery = trpc.pokemon.getAllPokemon.useQuery(undefined, {
    enabled: false,
  });

  const handleSingleSearch = async () => {
    setError(null);
    if (!input.trim()) {
      setError("Please enter a Pokemon name.");
      return;
    }
    const result = await singleQuery.refetch();
    if (result.data) {
      setSinglePokemon(result.data);
      setPokemonArray([]);
      setMode("single");
    } else {
      setError(`Pokemon "${input.trim()}" not found.`);
      setSinglePokemon(null);
    }
  };

  const handleMultipleSearch = async () => {
    setError(null);
    const result = await allQuery.refetch();
    if (result.data && result.data.length > 0) {
      setPokemonArray(result.data);
      setSinglePokemon(null);
      setMode("multiple");
    } else {
      setError("No Pokémon found in database.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          fullWidth
          label="Search Pokémon"
          placeholder="e.g. Bulbasaur"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSingleSearch()}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" color="primary" onClick={handleSingleSearch}>
          Search Single
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleMultipleSearch}>
          Search All
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

     
      {mode === "single" && singlePokemon && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Result</Typography>
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
                <PokemonRow pokemon={singlePokemon} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

     
      {mode === "multiple" && pokemonArray.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            All Pokemon ({pokemonArray.length})
          </Typography>
          <PokedexTable pokemons={pokemonArray} />
        </Box>
      )}
    </Box>
  );
};

export default PokemonForm;