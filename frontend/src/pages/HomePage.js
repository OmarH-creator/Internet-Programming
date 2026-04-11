import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#0e1113",
          borderBottom: "1px solid #2a3236"
        }}
      >
        <Toolbar sx={{ minHeight: "56px", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            reddit
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#ff4500",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e03d00" }
            }}
          >
            Log In
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography sx={{ color: "#818384" }}>Public homepage placeholder</Typography>
      </Container>
    </Box>
  );
}

export default HomePage;
