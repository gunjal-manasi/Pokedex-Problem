"use client";

import { Container, Typography, Box } from "@mui/material";
import { FilterablePokedexTable } from "@/components/FilterablePokedexTable";

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}>
          Pokédex
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search by name, view all, or filter by type.
        </Typography>
      </Box>
      <FilterablePokedexTable />
    </Container>
  );
}