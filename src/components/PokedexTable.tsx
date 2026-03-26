"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Pagination, Box, Stack, Select, MenuItem,
  FormControl, InputLabel, useMediaQuery, useTheme,
  Chip,
} from "@mui/material";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

const TYPE_COLORS: Record<string, string> = {
  grass: "#4CAF50", fire: "#FF5722", water: "#2196F3",
  electric: "#FFC107", psychic: "#E91E63", ice: "#00BCD4",
  dragon: "#673AB7", dark: "#616161", fairy: "#F48FB1",
  normal: "#9E9E9E", fighting: "#F44336", flying: "#90CAF9",
  poison: "#9C27B0", ground: "#FF9800", rock: "#795548",
  bug: "#8BC34A", ghost: "#512DA8", steel: "#607D8B",
};

export const PokedexTable = ({ pokemons }: { pokemons: Pokemon[] }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sorted = [...pokemons].sort((a, b) => a.id - b.id);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Mobile card view
  if (isMobile) {
    return (
      <Box>
        <Stack spacing={1.5}>
          {paginated.map((pokemon) => (
            <Paper
              key={pokemon.id}
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                width={56}
                height={56}
                style={{ objectFit: "contain", flexShrink: 0 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    #{String(pokemon.id).padStart(3, "0")}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {pokemon.name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {pokemon.types.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      sx={{
                        backgroundColor: TYPE_COLORS[type] ?? "#9E9E9E",
                        color: type === "electric" ? "#1a1a1a" : "#fff",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        textTransform: "capitalize",
                        height: 20,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Pagination */}
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          total={sorted.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    );
  }

  // Desktop table view
  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}
      >
        <Table className="responsive-table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ width: 80 }}>
                <Typography fontWeight={700} fontSize={13}>ID</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700} fontSize={13}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700} fontSize={13}>Type</Typography>
              </TableCell>
              <TableCell sx={{ width: 90 }}>
                <Typography fontWeight={700} fontSize={13}>Sprite</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((pokemon) => (
              <TableRow
                key={pokemon.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell data-label="ID">
                  <Typography color="text.secondary" fontWeight={600} fontSize={13}>
                    #{String(pokemon.id).padStart(3, "0")}
                  </Typography>
                </TableCell>
                <TableCell
                  data-label="Name"
                  sx={{ textTransform: "capitalize", fontWeight: 500 }}
                >
                  {pokemon.name}
                </TableCell>
                <TableCell data-label="Type">
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {pokemon.types.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        sx={{
                          backgroundColor: TYPE_COLORS[type] ?? "#9E9E9E",
                          color: type === "electric" ? "#1a1a1a" : "#fff",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "capitalize",
                        }}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell data-label="Sprite">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain", display: "block" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={sorted.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Box>
  );
};

// Reusable pagination bar
function PaginationControls({
  page, totalPages, pageSize, total,
  onPageChange, onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (e: React.ChangeEvent<unknown>, val: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={1.5}
      sx={{ mt: 2, px: 0.5 }}
    >
      <Typography variant="caption" color="text.secondary">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <FormControl size="small" variant="outlined" sx={{ minWidth: 90 }}>
          <InputLabel sx={{ fontSize: 12 }}>Per page</InputLabel>
          <Select
            value={pageSize}
            label="Per page"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            sx={{ fontSize: 13, height: 32 }}
          >
            {[5, 10, 20].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontSize: 13 }}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          size={isMobile ? "small" : "medium"}
          shape="rounded"
          color="primary"
          siblingCount={isMobile ? 0 : 1}
        />
      </Stack>
    </Stack>
  );
}