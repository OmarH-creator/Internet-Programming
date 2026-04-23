import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import AuthModal from "../components/auth/AuthModal";
import UserMenu from "../components/user/UserMenu";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";

function HomePage() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [refresh, setRefresh] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthSuccess = () => {
    setAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (action) => {
    // Route based on action
    if (action === "profile") {
      navigate("/profile");
    } else {
      console.log("Navigate to:", action);
    }
  };


  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0E1113", color: "#d7dadc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#0e1113",
          borderBottom: "1px solid #2a3236",
        }}
      >
        <Toolbar sx={{ minHeight: "56px", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "30px" }}>
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

      <Container sx={{ py: 4, maxWidth: "740px" }}>
        {/* Show create form only if logged in */}
        {isAuthenticated && (
          <Box sx={{ mb: 3 }}>
            <CreatePostForm onPostCreated={() => setRefresh(r => r + 1)} />
          </Box>
        )}

        {/* Post list */}
        <PostList refresh={refresh} />
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