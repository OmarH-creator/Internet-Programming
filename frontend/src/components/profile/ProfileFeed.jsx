import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { userService } from "../../services/userService";

// Import existing components - REUSE CODE!
import PostList from "../posts/PostList";
import CommentList from "../posts/CommentList";

export default function ProfileFeed({ activeTab = "posts", username }) {
  // State to store data
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, username]);

  // Function to load posts or comments
  const loadData = async () => {
    setLoading(true);
    
    try {
      if (activeTab === "posts") {
        // Get user's posts
        const response = await userService.getUserPosts(username);
        setPosts(response.data.data);
      } else if (activeTab === "comments") {
        // Get user's comments
        const response = await userService.getUserComments(username);
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh posts after delete
  const handlePostDeleted = () => {
    loadData();
  };

  // Show loading message
  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#111214", borderRadius: 2, border: "1px solid #262729", p: 2.5 }}>
        <Typography sx={{ color: "#818384" }}>Loading...</Typography>
      </Box>
    );
  }

  // Show posts tab - REUSE PostList component!
  if (activeTab === "posts") {
    if (posts.length === 0) {
      return (
        <Box sx={{ backgroundColor: "#111214", borderRadius: 2, border: "1px solid #262729", p: 2.5 }}>
          <Typography sx={{ color: "#818384" }}>No posts yet</Typography>
        </Box>
      );
    }

    // Use existing PostList component with all features!
    return <PostList posts={posts} onPostDeleted={handlePostDeleted} />;
  }

  // Show comments tab - REUSE CommentList component!
  if (activeTab === "comments") {
    if (comments.length === 0) {
      return (
        <Box sx={{ backgroundColor: "#111214", borderRadius: 2, border: "1px solid #262729", p: 2.5 }}>
          <Typography sx={{ color: "#818384" }}>No comments yet</Typography>
        </Box>
      );
    }

    // Use existing CommentList component!
    return <CommentList comments={comments} />;
  }

  // Overview tab (placeholder)
  return (
    <Box sx={{ backgroundColor: "#111214", borderRadius: 2, border: "1px solid #262729", p: 2.5 }}>
      <Typography sx={{ color: "#818384" }}>Overview coming soon</Typography>
    </Box>
  );
}
