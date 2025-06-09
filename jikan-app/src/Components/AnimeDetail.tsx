import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Rating,
  Accordion,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface Genre {
  mal_id: number;
  name: string;
  type: string;
  url: string;
}

interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
}

interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  genres: Genre[];
  year: number;
  episodes: number;
  synopsis: string;
}

function AnimeDetail() {
  const { animeId } = useParams();
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set loading state to true before fetching
    setLoading(true);
    setError(null);

    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${animeId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // The actual anime data is in the data property
        setAnime(result.data);

        // Fetch characters in a separate call (with delay to respect API rate limits)
        setTimeout(async () => {
          try {
            const charactersResponse = await fetch(
              `https://api.jikan.moe/v4/anime/${animeId}/characters`
            );

            if (charactersResponse.ok) {
              const charactersData = await charactersResponse.json();
              setCharacters(charactersData.data);
            }
          } catch (err) {
            console.error("Failed to fetch characters:", err);
          }
        }, 1000);
      } catch (error: any) {
        console.error("Failed to fetch anime details:", error);
        setError(error.message || "Failed to fetch anime details");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: "#FFFFFF" }}
        >
          Back to List
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!anime) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, fontSize: 20, fontWeight: 700 }}
        >
          Back
        </Button>
        <Alert severity="info">Anime not found</Alert>
      </Container>
    );
  }

  const convertToFiveStarScale = (rating: number): number => {
    const clampedRating = Math.max(0, Math.min(10, rating));
    return (clampedRating / 10) * 5;
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, fontSize: 20, fontWeight: 700 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            border: 3,
            width: "100%",
            borderRadius: 2,
            borderColor: "#000000",
            backgroundColor: "#424242",
            fontFamily: "initial",
            paddingBottom: 1,
          }}
          textAlign={"center"}
        >
          {anime.title}
        </Typography>

        <Grid container spacing={4}>
          {/* Left column - Image and rating */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              alt={anime.title}
              src={anime.images.jpg.image_url}
              sx={{
                borderRadius: 3,
                mt: 1,
                width: "100%",
                maxWidth: 350,
              }}
            />

            {anime.score && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Rating
                  value={convertToFiveStarScale(anime.score)}
                  precision={0.1}
                  readOnly
                  max={5}
                  icon={<StarIcon fontSize="inherit" />}
                />
                <Typography sx={{ paddingLeft: 1 }}>{anime.score}</Typography>
              </Box>
            )}

            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {anime.genres &&
                anime.genres.map((genre) => (
                  <Chip
                    key={genre.mal_id}
                    label={genre.name}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
            </Box>
          </Grid>

          {/* Right column - Synopsis and other details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="body1" sx={{ mb: 3, mt: 0.8 }}>
              {anime.synopsis || "No description available."}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {anime.year ? `${anime.year} • ` : ""}
              {anime.episodes
                ? `${anime.episodes} Episodes`
                : "Unknown Episodes"}
            </Typography>
            {characters.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Characters
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {characters.slice(0, 8).map((char) => (
                    <Box
                      key={char.character.mal_id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          borderRadius: 1,
                        },
                        padding: 1,
                      }}
                      onClick={() =>
                        navigate(`/character/${char.character.mal_id}`)
                      }
                    >
                      <img
                        src={char.character.images.jpg.image_url}
                        alt={char.character.name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          marginRight: 8,
                          objectFit: "cover",
                        }}
                      />
                      <Typography>{char.character.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default AnimeDetail;
