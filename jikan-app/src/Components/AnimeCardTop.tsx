import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { useNavigate } from "react-router-dom";

interface AnimeCardProps {
  title: string;
  imageUrl: string;
  score: number;
  mal_id: number;
}

function AnimeCardTop({ title, imageUrl, score, mal_id }: AnimeCardProps) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    // Navigate to the detail page with the anime ID or slug
    navigate(`/anime/${mal_id}`);
  };

  const convertToFiveStarScale = (rating: number): number => {
    const clampedRating = Math.max(0, Math.min(10, rating));
    return (clampedRating / 10) * 5;
  };
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 325,
        minWidth: 325,
        background: "#1E1E1E",
        borderRadius: 3,
        border: 1,
        borderColor: "#000000",
        paddingTop: 2,
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          height: 430, // Fixed height for uniformity
          objectFit: "contain", // Ensures the image fits without distortion
          borderRadius: 20,
        }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ ml: 1 }} noWrap>
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Rating
            value={convertToFiveStarScale(score)}
            precision={0.1}
            readOnly
            max={5}
            icon={<StarIcon fontSize="inherit" />}
          />
          <Typography sx={{ paddingLeft: 0.5, mt: 0.5 }}>{score}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnimeCardTop;
