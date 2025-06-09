import React, { useEffect, useState, useCallback } from "react";
import AnimeCardTop from "./AnimeCardTop";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  SelectChangeEvent,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import debounce from "lodash.debounce";

interface Anime {
  mal_id: number;
  title: string;
  score: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface Genre {
  mal_id: number;
  name: string;
}

function AnimeList() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [minScore, setMinScore] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // Fetch genres on component mount
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime")
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.data);
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  const fetchAnime = useCallback(() => {
    setLoading(true);

    let url = "https://api.jikan.moe/v4/anime?";
    const params = new URLSearchParams();

    // Add filters
    if (selectedGenres.length > 0) {
      params.append("genres", selectedGenres.map((g) => g.mal_id).join(","));
    }
    if (minScore) {
      params.append("min_score", minScore);
    }
    if (type) {
      params.append("type", type);
    }
    if (status) {
      params.append("status", status);
    }

    // Add pagination and sorting
    params.append("page", page.toString());
    params.append("limit", "24");
    params.append("order_by", "score");
    params.append("sort", "desc");

    url += params.toString();

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const uniqueAnime: Anime[] = [];
        const seenIds = new Set<number>();
        data.data.forEach((anime: Anime) => {
          if (!seenIds.has(anime.mal_id)) {
            uniqueAnime.push(anime);
            seenIds.add(anime.mal_id);
          }
        });
        setAnimeList(uniqueAnime);
        setHasNextPage(data.pagination.has_next_page);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching anime:", error);
        setLoading(false);
      });
  }, [selectedGenres, minScore, type, status, page]);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchAnime();
    }, 500),
    [fetchAnime]
  );

  useEffect(() => {
    debouncedFetch();
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Handle filter changes
  const handleGenreChange = (event: React.SyntheticEvent, value: Genre[]) => {
    setSelectedGenres(value);
    setPage(1);
  };
  const handleMinScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinScore(event.target.value);
    setPage(1);
  };
  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
    setPage(1);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
    setPage(1);
  };
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setMinScore("");
    setType("");
    setStatus("");
    setPage(1);
  };

  return (
    <Box px={5}>
      <Typography
        variant="h2"
        textAlign={"center"}
        sx={{ color: "white", mb: 3 }}
      >
        Anime Explorer
      </Typography>

      {/* Filters Section */}
      <Box
        sx={{
          border: 3,
          backgroundColor: "rgba(15, 15, 15, 0.62)",
          p: 3,
          borderRadius: 2,
          mb: 4,
          width: { xs: "100%", sm: "80%", md: "50%" }, // Responsive width
          margin: "auto", // Center the box horizontally
        }}
      >
        <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
          Filters
        </Typography>

        <Grid container spacing={2}>
          {/* Genre Filter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Autocomplete
              multiple
              id="genre-filter"
              options={genres}
              value={selectedGenres}
              getOptionLabel={(option) => option.name}
              onChange={handleGenreChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Genres"
                  fullWidth
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                  }}
                />
              )}
              renderValue={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "primary.main", color: "white" }}
                  />
                ))
              }
            />
          </Grid>

          {/* Min Score Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              label="Min Score"
              type="number"
              value={minScore}
              onChange={handleMinScoreChange}
              variant="outlined"
              placeholder="e.g., 7"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.05)",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />
          </Grid>

          {/* Type Filter */}
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
                onChange={handleTypeChange}
                label="Type"
                sx={{ color: "white" }}
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

          {/* Status Filter */}
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
                onChange={handleStatusChange}
                label="Status"
                sx={{ color: "white" }}
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
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Results Section */}
      <Typography
        variant="h4"
        textAlign={"center"}
        sx={{ color: "white", mb: 2, mt: 2 }}
      >
        {selectedGenres.length > 0 || minScore || type || status
          ? "Filtered Results"
          : "Top Rated Anime"}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : animeList.length > 0 ? (
        <>
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

          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <Button
              variant="contained"
              disabled={page === 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              sx={{ mx: 1 }}
            >
              Previous
            </Button>
            <Typography
              variant="body1"
              sx={{ color: "white", alignSelf: "center", mx: 2 }}
            >
              Page {page}
            </Typography>
            <Button
              variant="contained"
              disabled={!hasNextPage || loading}
              onClick={() => setPage((prev) => prev + 1)}
              sx={{ mx: 1 }}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            No anime found matching your filters. Try adjusting your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AnimeList;
