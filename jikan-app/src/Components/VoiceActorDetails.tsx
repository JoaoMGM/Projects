import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type VoiceRole = {
  role: string;
  anime: {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
  };
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
};

const VoiceActorPage: React.FC = () => {
  const { voiceid } = useParams<{ voiceid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    actorId = voiceid,
    actorName = "",
    actorPicture = "",
    nationality = "",
  } = (location.state as any) || {};

  const [roles, setRoles] = useState<VoiceRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actorId) return;
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/people/${actorId}/voices`
        );
        const data = await res.json();
        setRoles(data.data || []);
      } catch {
        setRoles([]);
      }
      setLoading(false);
    };
    fetchRoles();
  }, [actorId]);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "#FFFFFF" }}
      >
        Back
      </Button>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={4}>
          {/* Left Side: Actor Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={10}
            >
              <Avatar
                src={actorPicture}
                alt={actorName}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 400,
                  maxHeight: 600,
                  aspectRatio: "2/3",
                  mb: 2,
                  borderRadius: 3,
                  display: "block",
                  mx: "auto",
                }}
              />
              <Typography variant="h5" fontWeight="bold">
                {actorName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {nationality}
              </Typography>
            </Box>
          </Grid>

          {/* Right Side: Roles */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight={"bold"}
              gutterBottom
            >
              Voiced Characters
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {roles.map((role) => (
                  <ListItem
                    key={`${role.anime.mal_id}-${role.character.mal_id}`}
                    disableGutters
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: 2,
                      bgcolor: "#353434",
                      transition: "background 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        bgcolor: "#505050",
                        boxShadow: 4,
                        cursor: "pointer",
                      },
                      px: 3,
                      py: 2,
                      alignItems: "center",
                    }}
                    onClick={() =>
                      navigate(`/character/${role.character.mal_id}`)
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={role.character.images?.jpg?.image_url}
                        alt={role.character.name}
                        sx={{ width: 90, height: 130, mr: 2, borderRadius: 4 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h5"
                          component="span"
                          fontWeight="bold"
                        >
                          {role.character.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="h6" component="span">
                            in <em>{role.anime.title}</em>
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 1, ml: 1 }}
                          >
                            Role: {role.role}
                          </Typography>
                        </>
                      }
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default VoiceActorPage;
