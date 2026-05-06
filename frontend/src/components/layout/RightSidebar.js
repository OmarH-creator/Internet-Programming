import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Link, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "../../styles/layout.css";
import { communityService } from "../../services/communityService";

const FALLBACK_COLORS = ["#FF4500", "#FF69B4", "#003791", "#A3AAAE", "#FF8C00", "#46D160", "#0DD3BB", "#2259FF"];

function RightSidebar() {
  const navigate = useNavigate();
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await communityService.getAllCommunities();
        if (response.data && response.data.data) {
          const communities = response.data.data;
          
          // Sort by number of members descending and take top 5
          const sorted = communities.sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0)).slice(0, 5);
          
          setPopularCommunities(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <Box className="right-sidebar-container">
      {/* Popular Communities Card */}
      <Box className="popular-communities-card">
        <Typography 
          variant="overline" 
          sx={{ 
            color: "#818384", 
            fontWeight: 700, 
            letterSpacing: "0.5px",
            display: "block",
            mb: 1
          }}
        >
          POPULAR COMMUNITIES
        </Typography>

        <List disablePadding>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} sx={{ color: "#818384" }} />
            </Box>
          ) : popularCommunities.length === 0 ? (
            <Typography sx={{ color: "#818384", fontSize: "14px", py: 1 }}>
              No communities found.
            </Typography>
          ) : (
            popularCommunities.map((community, index) => {
              const displayName = community.name.startsWith("r/") ? community.name : `r/${community.name}`;
              const avatarLetter = community.name.replace(/^r\//i, '').charAt(0).toUpperCase();
              const memberCount = community.members?.length || 0;
              const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

              return (
                <ListItem 
                  key={community._id || community.name} 
                  disableGutters 
                  button
                  onClick={() => navigate(`/community/${community._id}`)}
                  className="community-list-item"
                >
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar 
                      src={community.avatar || undefined}
                      sx={{ bgcolor: bgColor, width: 32, height: 32, fontSize: "14px", fontWeight: "bold" }}
                    >
                      {!community.avatar && avatarLetter}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={displayName} 
                    secondary={
                      <Typography sx={{ fontSize: "12px", color: "#ffffff", display: "block" }}>
                        {memberCount.toLocaleString()} member{memberCount !== 1 ? 's' : ''}
                      </Typography>
                    } 
                    primaryTypographyProps={{ fontSize: "14px", fontWeight: 600, color: "#d7dadc" }}
                  />
                </ListItem>
              );
            })
          )}
        </List>
        <Button variant="text" className="community-see-more-btn">
          See more
        </Button>
      </Box>

      {/* Footer Links */}
      <Box sx={{ px: 1 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          <Link href="#" underline="hover" sx={{ color: "#818384", fontSize: "12px" }}>Reddit Rules</Link>
          <Link href="#" underline="hover" sx={{ color: "#818384", fontSize: "12px" }}>Privacy Policy</Link>
          <Link href="#" underline="hover" sx={{ color: "#818384", fontSize: "12px" }}>User Agreement</Link>
          <Link href="#" underline="hover" sx={{ color: "#818384", fontSize: "12px" }}>Accessibility</Link>
        </Box>
        <Typography sx={{ color: "#818384", fontSize: "12px" }}>
          Reddit, Inc. © 2026. All rights reserved.
        </Typography>
      </Box>

    </Box>
  );
}

export default RightSidebar;
