import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AnimeAppearance {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    role: string;
  };
}

interface CharacterData {
  mal_id: number;
  name: string;
  name_kanji: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  about: string;
  nicknames: string[];
  favorites: number;
  voices: VoiceActor[];
  anime: AnimeAppearance[];
}

interface VoiceActor {
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  };
  language: string;
}

function CharacterDetail() {
  const { characterId } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchCharacterDetails = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch(
          `https://api.jikan.moe/v4/characters/${characterId}/full`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setCharacter(result.data);
      } catch (error: any) {
        console.error("Failed to fetch character details:", error);
        setError(error.message || "Failed to fetch character details");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [characterId]);

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
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!character) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Alert severity="info">Character not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "#FFFFFF" }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
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
              {character.name}
            </Typography>
            <Box
              component="img"
              alt={character.name}
              src={character.images.jpg.image_url}
              sx={{ borderRadius: 3, mt: 1 }}
            />

            {character.favorites > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" align="center">
                  ❤️ {character.favorites.toLocaleString()} favorites
                </Typography>
              </Box>
            )}

            {/*             {character.nicknames && character.nicknames.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Also known as:</Typography>
                <Typography variant="body2">
                  {character.nicknames.join(", ")}
                </Typography>
              </Box>
            )} */}
          </Grid>
          <Grid>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {character.about ||
                "No information available for this character."}
            </Typography>
          </Grid>

          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="appearances"
            >
              <Typography variant="h6" textAlign="center">
                Anime Appearances
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {character.anime && character.anime.length > 0 ? (
                      character.anime.map((animeItem, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            width: { xs: "45%", sm: "30%", md: "22%" },
                            maxWidth: "180px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(`/anime/${animeItem.anime.mal_id}`)
                          }
                        >
                          <img
                            src={animeItem.anime.images.jpg.image_url}
                            alt={animeItem.anime.title}
                            style={{
                              width: 120,
                              height: 180,
                              objectFit: "cover",
                              marginBottom: 8,
                              borderRadius: "8px",
                            }}
                          />
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {animeItem.anime.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {animeItem.anime.role}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No anime appearances found.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Voice Actors</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid>
                  <Grid container spacing={4}>
                    {character.voices &&
                      character.voices.map((voice, index) => (
                        <Grid key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              width: "100%",
                              maxWidth: "150px",
                            }}
                          >
                            <img
                              src={voice.person.images.jpg.image_url}
                              alt={voice.person.name}
                              style={{
                                width: 100,
                                height: 95,
                                borderRadius: "90%",
                                objectFit: "cover",
                                marginBottom: 8,
                              }}
                            />
                            <Typography variant="subtitle2">
                              {voice.person.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {voice.language}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Paper>
    </Container>
  );
}

export default CharacterDetail;
