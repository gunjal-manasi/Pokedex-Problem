"use client";

import { useState } from "react";
import {
  Box, Button, TextField, Typography,
  Alert, Stack, CircularProgress,
} from "@mui/material";
import { PokemonTypeSelection } from "./PokemonTypeSelection";
import { PokedexTable } from "./PokedexTable";
import { trpc } from "@/utils/trpc";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

export const FilterablePokedexTable = () => {
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"single" | "multiple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const singleQuery = trpc.pokemon.getPokemon.useQuery(input.trim(), {
    enabled: false,
  });

  const { data: filteredByType, isLoading: typeLoading } =
    trpc.pokemon.getPokemonByType.useQuery(selectedType, {
      enabled: mode === "multiple",
    });

  const handleSingleSearch = async () => {
    setError(null);
    if (!input.trim()) {
      setError("Please enter a Pokémon name.");
      return;
    }
    const result = await singleQuery.refetch();
    if (result.data) {
      setMode("single");
      setSelectedType(undefined);
    } else {
      setError(`Pokémon "${input.trim()}" not found.`);
    }
  };

  const handleMultipleSearch = () => {
    setError(null);
    setInput("");
    setSelectedType(undefined); 
    setMode("multiple");
  };

  const handleTypeChange = (type: string | undefined) => {
    setSelectedType(type);
    setMode("multiple");
    setError(null);
  };

  const getTableData = (): Pokemon[] => {
    if (mode === "single" && singleQuery.data) {
      return [singleQuery.data];
    }
    if (mode === "multiple" && filteredByType) {
      return filteredByType;
    }
    return [];
  };

  const tableData = getTableData();
  const isLoading = singleQuery.isFetching || typeLoading;

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Search Pokemon"
        placeholder="e.g. Bulbasaur"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSingleSearch()}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Button variant="contained" color="primary" onClick={handleSingleSearch}>
          Search Single Pokemon
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleMultipleSearch}>
          Search All Pokemon
        </Button>
        <PokemonTypeSelection
          selectedType={selectedType}
          selectType={handleTypeChange}
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && mode !== null && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {mode === "single"
              ? `Result for "${input || singleQuery.data?.name}"`
              : selectedType
              ? `Pokémon — ${selectedType} type`
              : `All Pokémon`}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({tableData.length} found)
            </Typography>
          </Typography>

          {tableData.length === 0 ? (
            <Alert severity="info">No Pokemon found.</Alert>
          ) : (
            <PokedexTable pokemons={tableData} />
          )}
        </Box>
      )}
    </Box>
  );
};