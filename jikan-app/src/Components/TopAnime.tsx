import React, { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import { Box, Grid, Typography } from "@mui/material";
import AnimeCardTop from "./AnimeCardTop";

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

function TopAnime() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/top/anime")
      .then((response) => response.json())
      .then((data) => {
        // Filter out duplicates based on mal_id
        const uniqueAnime: Anime[] = [];
        const seenIds = new Set<number>();

        data.data.forEach((anime: Anime) => {
          if (!seenIds.has(anime.mal_id)) {
            uniqueAnime.push(anime);
            seenIds.add(anime.mal_id);
          }
        });

        setAnimeList(uniqueAnime);
      })
      .catch((error) => console.error("Error fetching seasonal anime:", error));
  }, []);
  return (
    <Box>
      <Typography variant="h2" textAlign={"center"} sx={{ color: "white" }}>
        Top Rated Animes
      </Typography>
      <Grid container spacing={2} justifyContent="center" marginTop={1}>
        {animeList.map((anime) => (
          <Grid key={anime.mal_id}>
            <AnimeCardTop
              title={anime.title}
              imageUrl={anime.images.jpg.image_url}
              score={anime.score}
              mal_id={anime.mal_id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TopAnime;
