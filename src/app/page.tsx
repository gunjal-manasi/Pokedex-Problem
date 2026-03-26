"use client";

import { Container, Typography } from "@mui/material";
import { FilterablePokedexTable } from "@/components/FilterablePokedexTable";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Pokedex
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Search by name, view all, or filter by type.
      </Typography>
      <FilterablePokedexTable />
    </Container>
  );
}