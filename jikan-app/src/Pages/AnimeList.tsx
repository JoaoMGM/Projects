import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import AnimeCardTop from "../Components/AnimeCardTop";
import { useNavigate } from "react-router-dom";

interface Anime {
  mal_id: number;
  title: string;
  score: number;
  images: { jpg: { image_url: string } };
}
interface Genre {
  mal_id: number;
  name: string;
}

function AnimeList() {
  const navigate = useNavigate();

  // Main filter states
  const [searchQ, setSearchQ] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [minScore, setMinScore] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Autocomplete states
  const [autocompleteInput, setAutocompleteInput] = useState<string>("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  // Results and loading
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Fetch genres on mount
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime")
      .then((res) => res.json())
      .then((data) => setGenres(data.data))
      .catch(() => setGenres([]));
  }, []);

  // Fetch autocomplete options (debounced)
  useEffect(() => {
    if (autocompleteInput.length < 2) {
      setAutocompleteOptions([]);
      return;
    }
    const handler = setTimeout(() => {
      fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(autocompleteInput)}&limit=10`
      )
        .then((res) => res.json())
        .then((data) => setAutocompleteOptions(data.data || []))
        .catch(() => setAutocompleteOptions([]));
    }, 800);
    return () => clearTimeout(handler);
  }, [autocompleteInput]);

  // Fetch anime list (debounced)
  useEffect(() => {
    setLoading(true);

    // If an anime is selected via autocomplete, show only that one
    if (selectedAnime) {
      setAnimeList([selectedAnime]);
      setLoading(false);
      return;
    }

    // Otherwise, use main filters
    const handler = setTimeout(() => {
      let url = "https://api.jikan.moe/v4/anime?";
      const params = new URLSearchParams();
      if (searchQ.length >= 2) params.append("q", searchQ);
      if (selectedGenres.length > 0)
        params.append("genres", selectedGenres.map((g) => g.mal_id).join(","));
      if (minScore) params.append("min_score", minScore);
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      params.append("limit", "24");
      params.append("order_by", "score");
      params.append("sort", "desc");

      fetch(url + params.toString())
        .then((res) => res.json())
        .then((data) => setAnimeList(data.data || []))
        .catch(() => setAnimeList([]))
        .finally(() => setLoading(false));
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQ, selectedGenres, minScore, type, status, selectedAnime]);

  // Handlers for main filters
  const handleResetFilters = () => {
    setSearchQ("");
    setSelectedGenres([]);
    setMinScore("");
    setType("");
    setStatus("");
  };

  // Autocomplete handlers
  const handleAutocompleteChange = (_: any, value: Anime | null) => {
    if (value) {
      // Replace '/anime/:id' with your actual route pattern
      navigate(`/anime/${value.mal_id}`);
    }
  };
  const handleAutocompleteInput = (_: any, value: string) => {
    setAutocompleteInput(value);
  };

  return (
    <Box px={5}>
      <Typography
        variant="h2"
        textAlign="center"
        sx={{ color: "white", mb: 3 }}
      >
        Anime Explorer
      </Typography>

      {/* Main Filter Box */}
      <Stack direction={"row"} spacing={2} paddingLeft={1} marginLeft={0.2}>
        <Box
          sx={{
            border: 3,
            backgroundColor: "rgba(15, 15, 15, 0.62)",
            p: 3,
            borderRadius: 2,
            mb: 4,
            width: { xs: "100%", sm: "80%", md: "50%" },
            margin: "auto",
          }}
        >
          <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
            Filters
          </Typography>

          <Grid container spacing={2}>
            {/* Simple Search Q */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  "& .MuiOutlinedInput-root": { color: "white" },
                  "& .MuiInputLabel-root": { color: "white" },
                }}
                disabled={!!selectedAnime}
              />
            </Grid>
            {/* Genre Filter */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={genres}
                value={selectedGenres}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => setSelectedGenres(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genres"
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      "& .MuiOutlinedInput-root": { color: "white" },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      sx={{ backgroundColor: "primary.main", color: "white" }}
                    />
                  ))
                }
                disabled={!!selectedAnime}
              />
            </Grid>
            {/* Min Score */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Min Score"
                type="number"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  "& .MuiOutlinedInput-root": { color: "white" },
                  "& .MuiInputLabel-root": { color: "white" },
                }}
                disabled={!!selectedAnime}
              />
            </Grid>
            {/* Type */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl
                fullWidth
                sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <InputLabel id="type-label" sx={{ color: "white" }}>
                  Type
                </InputLabel>
                <Select
                  labelId="type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                  sx={{ color: "white" }}
                  disabled={!!selectedAnime}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="tv">TV</MenuItem>
                  <MenuItem value="movie">Movie</MenuItem>
                  <MenuItem value="ova">OVA</MenuItem>
                  <MenuItem value="special">Special</MenuItem>
                  <MenuItem value="ona">ONA</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Status */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl
                fullWidth
                sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <InputLabel id="status-label" sx={{ color: "white" }}>
                  Status
                </InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  sx={{ color: "white" }}
                  disabled={!!selectedAnime}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="airing">Airing</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Reset Button */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleResetFilters}
                sx={{ height: "100%" }}
                disabled={!!selectedAnime}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Autocomplete Filter Box */}
        <Box
          sx={{
            border: 3,
            backgroundColor: "rgba(15, 15, 15, 0.62)",
            p: 3,
            borderRadius: 2,
            mb: 4,
            width: { xs: "100%", sm: "80%", md: "50%" },
            margin: "auto",
          }}
        >
          <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
            Anime Selector
          </Typography>
          <Autocomplete
            options={autocompleteOptions}
            getOptionLabel={(option) => option.title}
            filterOptions={(x) => x}
            inputValue={autocompleteInput}
            value={selectedAnime}
            onInputChange={handleAutocompleteInput}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Find Anime by Name"
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  "& .MuiOutlinedInput-root": { color: "white" },
                  "& .MuiInputLabel-root": { color: "white" },
                }}
              />
            )}
          />
          {selectedAnime && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => {
                setSelectedAnime(null);
                setAutocompleteInput("");
              }}
            >
              Clear Quick Lookup
            </Button>
          )}
        </Box>
      </Stack>

      {/* Results */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : animeList.length > 0 ? (
        <Grid container spacing={2} justifyContent="center" marginTop={1}>
          {animeList.map((anime) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
              key={anime.mal_id}
            >
              <AnimeCardTop
                title={anime.title}
                imageUrl={anime.images.jpg.image_url}
                score={anime.score}
                mal_id={anime.mal_id}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            No anime found matching your filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AnimeList;
