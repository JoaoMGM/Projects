import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

function Home() {
  return (
    <Box sx={{ padding: "2rem", textAlign: "center" }}>
      {/* Hero Section */}
      <Typography variant="h2" gutterBottom>
        Welcome to Anime Explorer
      </Typography>
      <Typography variant="h6" gutterBottom>
        Discover seasonal anime, top-rated shows, and more!
      </Typography>

      {/* Call-to-Action Buttons */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "2rem" }}
      >
        <Grid>
          <Button variant="contained" color="primary" href="/seasonal-anime">
            Explore Seasonal Anime
          </Button>
        </Grid>
        <Grid>
          <Button variant="outlined" color="secondary" href="/top-anime">
            View Top Anime
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
