"use client";

import { useState } from "react";
import {
  Box, Button, TextField, Typography, Alert,
  Stack, CircularProgress, InputAdornment,
  useMediaQuery, useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { PokemonTypeSelection } from "./PokemonTypeSelection";
import { PokedexTable } from "./PokedexTable";
import { trpc } from "@/utils/trpc";

type Pokemon = { id: number; name: string; types: string[]; sprite: string };
type Mode = "single" | "multiple" | null;

export const FilterablePokedexTable = () => {
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<Mode>(null);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const singleQuery = trpc.pokemon.getPokemon.useQuery(input.trim(), {
    enabled: false,
    staleTime: 2 * 60 * 1000,
  });

  // keepPreviousData — table stays visible while new page loads
  const { data: filteredByType, isLoading: typeLoading } =
    trpc.pokemon.getPokemonByType.useQuery(selectedType, {
      enabled: mode === "multiple",
      staleTime: 2 * 60 * 1000,
    });

  const handleSingleSearch = async () => {
    setError(null);
    if (!input.trim()) { setError("Please enter a Pokémon name."); return; }
    const result = await singleQuery.refetch();
    if (result.data) {
      setMode("single");
      setSelectedType(undefined);
    } else {
      setError(`"${input.trim()}" not found.`);
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

  const isLoading = singleQuery.isFetching || typeLoading;

  const tableData: Pokemon[] =
    mode === "single" && singleQuery.data
      ? [singleQuery.data]
      : mode === "multiple" && filteredByType
      ? filteredByType
      : [];

  return (
    <Box sx={{ mt: 2 }}>

     
      <TextField
        fullWidth
        placeholder="Search by Pokémon name…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSingleSearch()}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

     
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        flexWrap="wrap"
        useFlexGap
      >
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
          startIcon={<FilterListIcon />}
          fullWidth={isMobile}
          sx={{ whiteSpace: "nowrap" }}
        >
          Search All
        </Button>

        {/* PokemonTypeSelection */}
        <Box sx={{ width: isMobile ? "100%" : "auto" }}>
          <PokemonTypeSelection
            selectedType={selectedType}
            selectType={handleTypeChange}
          />
        </Box>

        {mode !== null && !isLoading && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: { sm: "auto" } }}>
            {tableData.length} Pokémon found
          </Typography>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress size={36} />
        </Box>
      )}

      {/* ONE table for all results — with pagination inside PokedexTable */}
      {!isLoading && mode !== null && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {mode === "single"
              ? "Result"
              : selectedType
              ? `${selectedType} type Pokémon`
              : "All Pokémon"}
          </Typography>

          {tableData.length === 0 ? (
            <Alert severity="info">No Pokémon found.</Alert>
          ) : (
            <PokedexTable pokemons={tableData} />
          )}
        </Box>
      )}
    </Box>
  );
};