import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";

export const PokemonCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  gap: theme.spacing(2),
}));

export const PokemonId = styled(Typography)({
  minWidth: 50,
  fontWeight: 600,
  color: "#888",
});

export const PokemonName = styled(Typography)({
  textTransform: "capitalize",
  fontWeight: 500,
  minWidth: 120,
});

export const PokemonTypes = styled(Typography)({
  textTransform: "capitalize",
  minWidth: 100,
  color: "#555",
});

export const PokemonImage = styled("img")({
  width: 50,
  height: 50,
  objectFit: "contain",
});