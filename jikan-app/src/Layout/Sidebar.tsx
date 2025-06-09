import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  return (
    <>
      {/* Menu Icon to Open Sidebar */}
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{ position: "absolute", top: "1rem", left: "1rem", color: "white" }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              top: "64px",
              backgroundColor: "#0A0A0A",
              backgroundImage: "none", // Remove any overlay
              color: "#ffffff", // Ensure text is visible on black
            },
          },
        }}
      >
        {/* Sidebar Content */}
        <Box sx={{ padding: "1rem" }}>
          <List sx={{ width: 250 }}>
            {/* Home Link */}
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/"
                sx={{ marginTop: "0.5rem" }}
              >
                <ListItemText primary="Home" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/top-anime"
                sx={{ marginTop: "0.5rem" }}
              >
                <ListItemText primary="Top Anime" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/list-anime"
                sx={{ marginTop: "0.5rem" }}
              >
                <ListItemText primary="Anime" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/list-anime-season-year"
                sx={{ marginTop: "0.5rem" }}
              >
                <ListItemText
                  primary="Animes by Year and Season"
                  sx={{ color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
