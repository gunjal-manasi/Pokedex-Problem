"use client";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { trpc } from "@/utils/trpc";

type PokemonTypeSelectionProps = {
  selectedType: string | undefined;
  selectType: (type: string | undefined) => void;
};

export const PokemonTypeSelection = ({
  selectedType,
  selectType,
}: PokemonTypeSelectionProps) => {
  const { data: types, isLoading } = trpc.pokemon.getAllTypes.useQuery();

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={selectedType ?? "all"}
        label="Type"
        disabled={isLoading}
        onChange={(e) => {
          const val = e.target.value;
          selectType(val === "all" ? undefined : val);
        }}
      >
        <MenuItem value="all">All Types</MenuItem>
        {types?.map((type) => (
          <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};