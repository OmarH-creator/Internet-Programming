import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import { useAuth } from "../context/AuthContext";
import PostList from "../components/posts/PostList";
import ChatWidget from "../components/chat/ChatWidget";

function HomePage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#111111ff", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
        <LeftSidebar />

        <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "700px", px: 2, py: 4 }}>
            <PostList refresh={refresh} />
          </Box>
        </Box>

        <RightSidebar />
      </Box>

      {/* Chat Widget */}
      <ChatWidget />
    </Box>
  );
}

export default HomePage;
