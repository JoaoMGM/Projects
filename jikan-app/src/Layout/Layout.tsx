import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar"; // Import Sidebar
import { Outlet } from "react-router-dom";
import jinxLogo from "../Logo/Jinx.png";

function Layout() {
  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          {/* Centered Logo and Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              alt="Logo"
              src={jinxLogo}
              sx={{
                height: 40,
                width: 60,

                marginBottom: 1,
              }}
            />
            <Typography variant="h6" component="div">
              Anime Explorer
            </Typography>
          </Box>
        </Toolbar>
        {/* Sidebar */}
        <Sidebar />
      </AppBar>
      <Toolbar />

      {/* Content Placeholder */}
      <Outlet />
    </>
  );
}

export default Layout;
