import { ThemeProvider } from "@mui/material/styles";
import theme from "./Layout/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import { GlobalStyles } from "@mui/material";
import TopAnime from "./Pages/TopAnime";
import AnimeDetail from "./Components/AnimeDetail";
import CharacterDetail from "./Components/CharacterDetail";
import AnimeList from "./Pages/AnimeList";
import SeasonYearAnimeList from "./Pages/SeasonYearAnimeList";
import VoiceActorPage from "./Components/VoiceActorDetails";

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
            <Route path="/voice-actor/:voiceid" element={<VoiceActorPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
