import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import AuthModal from "../components/auth/AuthModal";
import UserMenu from "../components/user/UserMenu";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthSuccess = () => {
    setAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (action) => {
    // Placeholder for navigation actions from UserMenu
    console.log("Navigate to:", action);
  };


  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#0e1113",
          borderBottom: "1px solid #2a3236",
        }}
      >
        <Toolbar sx={{ minHeight: "56px", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            reddit
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated && user ? (
              // ── Authenticated: show avatar + dropdown ──
              <UserMenu
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            ) : (
              // ── Guest: show Log In / Sign Up buttons ──
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDefaultTab("login");
                    setAuthOpen(true);
                  }}
                  sx={{
                    backgroundColor: "#ff4500",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#e03d00" },
                  }}
                >
                  Log In
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setDefaultTab("register");
                    setAuthOpen(true);
                  }}
                  sx={{
                    color: "#d7dadc",
                    borderColor: "#818384",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography sx={{ color: "#818384" }}>Public homepage placeholder</Typography>
      </Container>

      {authOpen && (
        <AuthModal
          defaultTab={defaultTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </Box>
  );
}

export default HomePage;