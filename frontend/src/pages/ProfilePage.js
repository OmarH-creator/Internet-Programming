import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc" }}>
      {/* Placeholder Banner */}
      <Box
        sx={{
          height: "200px",
          backgroundColor: "#1a1a1b",
          borderBottom: "1px solid #343536",
        }}
      />

      {/* Profile Content */}
      <Container sx={{ py: 4 }}>
        {user ? (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {user.username}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
                mb: 4,
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "#1a1a1b", borderRadius: "4px" }}>
                <Typography sx={{ fontSize: "12px", color: "#818384" }}>Total Karma</Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                  {user.karma || 0}
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: "#1a1a1b", borderRadius: "4px" }}>
                <Typography sx={{ fontSize: "12px", color: "#818384" }}>Post Karma</Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                  {user.postKarma || 0}
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: "#1a1a1b", borderRadius: "4px" }}>
                <Typography sx={{ fontSize: "12px", color: "#818384" }}>Comment Karma</Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                  {user.commentKarma || 0}
                </Typography>
              </Box>
            </Box>

            {user.bio && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: "14px", color: "#d7dadc" }}>
                  {user.bio}
                </Typography>
              </Box>
            )}

            <Box sx={{ p: 3, backgroundColor: "#1a1a1b", borderRadius: "4px" }}>
              <Typography sx={{ fontSize: "12px", color: "#818384", mb: 1 }}>
                Joined
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#d7dadc" }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: "#818384" }}>Loading profile...</Typography>
        )}
      </Container>
    </Box>
  );
}

export default ProfilePage;
