"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import PokemonRow from "./PokemonRow";
import { PokedexTable } from "./PokedexTable";
import {
  Box, Button, TextField, Typography, Alert,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, useMediaQuery, useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // caching — staleTime keeps data fresh for 2 mins
  const singleQuery = trpc.pokemon.getPokemon.useQuery(input.trim(), {
    enabled: false,
    staleTime: 2 * 60 * 1000,
  });

  const allQuery = trpc.pokemon.getAllPokemon.useQuery(undefined, {
    enabled: false,
    staleTime: 2 * 60 * 1000,
  });

  const handleSingleSearch = async () => {
    setError(null);
    if (!input.trim()) {
      setError("Please enter a Pokémon name.");
      return;
    }
    const result = await singleQuery.refetch();
    if (result.data) {
      setSinglePokemon(result.data);
      setPokemonArray([]);
      setMode("single");
    } else {
      setError(`Pokémon "${input.trim()}" not found.`);
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

      
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          fullWidth
          label="Search Pokmon"
          placeholder="e.g. Bulbasaur"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSingleSearch()}
          variant="outlined"
          size="small"
        />
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSingleSearch}
            startIcon={<SearchIcon />}
            fullWidth={isMobile}
            sx={{ whiteSpace: "nowrap" }}
          >
            Search Single
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleMultipleSearch}
            startIcon={<FormatListBulletedIcon />}
            fullWidth={isMobile}
            sx={{ whiteSpace: "nowrap" }}
          >
            Search All
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Single result */}
      {mode === "single" && singlePokemon && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={700}>
            Result
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><Typography fontWeight={700} fontSize={13}>ID</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={13}>Name</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={13}>Type</Typography></TableCell>
                  <TableCell><Typography fontWeight={700} fontSize={13}>Sprite</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <PokemonRow pokemon={singlePokemon} />
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Multiple results with pagination */}
      {mode === "multiple" && pokemonArray.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={700}>
            All Pokémon ({pokemonArray.length})
          </Typography>
          <PokedexTable pokemons={pokemonArray} />
        </Box>
      )}
    </Box>
  );
};

export default PokemonForm;