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

function SeasonYearAnimeList() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [year, setYear] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // Helper to get current season/year
  const getCurrentSeasonYear = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    let s = "winter";
    if (m >= 4 && m <= 6) s = "spring";
    else if (m >= 7 && m <= 9) s = "summer";
    else if (m >= 10) s = "fall";
    return { y, s };
  };

  const fetchAnime = useCallback(() => {
    setLoading(true);

    // Get current season/year as defaults
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    let currentSeason = "winter";
    if (currentMonth >= 4 && currentMonth <= 6) currentSeason = "spring";
    else if (currentMonth >= 7 && currentMonth <= 9) currentSeason = "summer";
    else if (currentMonth >= 10) currentSeason = "fall";

    // Use seasons endpoint for accurate seasonal filtering
    const effectiveYear = year || currentYear.toString();
    const effectiveSeason = season || currentSeason;

    const url = `https://api.jikan.moe/v4/seasons/${effectiveYear}/${effectiveSeason}?page=${page}&limit=24`;

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
  }, [year, season, page]);

  // Debounced fetch
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

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
    setPage(1);
  };

  const handleSeasonChange = (event: any) => {
    setSeason(event.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setYear("");
    setSeason("");
    setPage(1);
  };

  return (
    <Box px={5}>
      <Typography
        variant="h2"
        textAlign={"center"}
        sx={{ color: "white", mb: 3 }}
      >
        Anime by Season & Year
      </Typography>

      <Box
        sx={{
          border: 3,
          backgroundColor: "rgba(15, 15, 15, 0.62)",
          p: 3,
          borderRadius: 2,
          mb: 4,
          width: { xs: "100%", sm: "80%", md: "40%" }, // Responsive width
          margin: "auto", // Center the box horizontally
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
            <Box display="flex" justifyContent="center">
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={year}
                onChange={handleYearChange}
                variant="outlined"
                placeholder="e.g., 2023"
                sx={{
                  maxWidth: 300, // Limit width
                  backgroundColor: "#424242",
                  "& .MuiOutlinedInput-root": { color: "white" },
                  "& .MuiInputLabel-root": { color: "white" },
                }}
              />
            </Box>
          </Grid>
          {/* Season Filter */}
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
            <Box display="flex" justifyContent="center">
              <FormControl
                sx={{
                  backgroundColor: "#424242",
                  width: "100%",
                  maxWidth: 300,
                }}
              >
                <InputLabel id="season-label" sx={{ color: "white" }}>
                  Season
                </InputLabel>
                <Select
                  labelId="season-label"
                  value={season}
                  onChange={handleSeasonChange}
                  label="Season"
                  sx={{ color: "white" }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="winter">Winter</MenuItem>
                  <MenuItem value="spring">Spring</MenuItem>
                  <MenuItem value="summer">Summer</MenuItem>
                  <MenuItem value="fall">Fall</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {/* Reset Button */}
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: "56px", // Match input field height
                }}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="h4"
        textAlign={"center"}
        sx={{ color: "white", mb: 2, mt: 2 }}
      >
        {year || season ? "Filtered Results" : "Current Season"}
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
            No anime found for this season/year.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default SeasonYearAnimeList;
