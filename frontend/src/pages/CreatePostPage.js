import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import CreatePostForm from "../components/posts/CreatePostForm";
import { useAuth } from "../context/AuthContext";

function CreatePostPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    // If we're not authenticated, we could redirect or show a message.
    // For now, redirect to home if not auth'd.
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#111111ff", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
        <LeftSidebar />

        <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "700px", px: 2, py: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, borderBottom: "1px solid #343536", pb: 2 }}>
              Create a post
            </Typography>
            <CreatePostForm onPostCreated={() => navigate("/")} />
          </Box>
        </Box>

        <RightSidebar />
      </Box>
    </Box>
  );
}

export default CreatePostPage;
