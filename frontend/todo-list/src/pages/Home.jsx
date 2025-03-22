import React from "react";
import { Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h2">🏡 Home Page</Typography>
      <Typography variant="body1">Welcome to my Vite + React app!</Typography>
    </Box>
  );
};

export default Home;
