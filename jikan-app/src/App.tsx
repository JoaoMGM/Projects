import { createTheme, ThemeProvider } from "@mui/material/styles";
import SeasonalAnime from "./Components/SeasonalAnime";
import theme from "./Layout/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Sidebar from "./Layout/Sidebar";
import Layout from "./Layout/Layout";
import { GlobalStyles } from "@mui/material";
import TopAnime from "./Components/TopAnime";
import AnimeDetail from "./Components/AnimeDetail";
import CharacterDetail from "./Components/CharacterDetail";
import AnimeList from "./Components/AnimeList";
import SeasonYearAnimeList from "./Components/SeasonYearAnimeList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default },
        }}
      />
      <Router>
        <Routes>
          {/* Wrap all pages with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="top-anime" element={<TopAnime />} />
            <Route path="list-anime" element={<AnimeList />} />
            <Route
              path="list-anime-season-year"
              element={<SeasonYearAnimeList />}
            />
            <Route path="/anime/:animeId" element={<AnimeDetail />} />
            <Route
              path="/character/:characterId"
              element={<CharacterDetail />}
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
