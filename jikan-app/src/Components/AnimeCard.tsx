import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface AnimeCardProps {
  title: string;
  imageUrl: string;
}

function AnimeCard({ title, imageUrl }: AnimeCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 175,
        minWidth: 175,
        background: "#1E1E1E",
        borderRadius: 3,
        border: 1,
        borderColor: "#000000",
        paddingTop: 2,
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          height: 200, // Fixed height for uniformity
          objectFit: "contain", // Ensures the image fits without distortion
        }}
      />
      <CardContent>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AnimeCard;
