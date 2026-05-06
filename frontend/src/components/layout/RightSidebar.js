import React from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Link, Button } from "@mui/material";

import "../../styles/layout.css";

function RightSidebar() {
  const popularCommunities = [
    { name: "r/AskMen", members: "7,244,505 members", color: "#FF4500" },
    { name: "r/AskWomen", members: "5,681,227 members", color: "#FF69B4" },
    { name: "r/PS4", members: "5,523,183 members", color: "#003791" },
    { name: "r/apple", members: "6,358,868 members", color: "#A3AAAE" },
    { name: "r/NBA2k", members: "761,370 members", color: "#FF8C00" },
  ];

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
          {popularCommunities.map((community, index) => (
            <ListItem 
              key={community.name} 
              disableGutters 
              className="community-list-item"
            >
              <ListItemAvatar sx={{ minWidth: 48 }}>
                <Avatar sx={{ bgcolor: community.color, width: 32, height: 32, fontSize: "14px", fontWeight: "bold" }}>
                  {community.name.charAt(2)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={community.name} 
                secondary={
                  <Typography sx={{ fontSize: "12px", color: "#ffffff", display: "block" }}>
                    {community.members}
                  </Typography>
                } 
                primaryTypographyProps={{ fontSize: "14px", fontWeight: 600, color: "#d7dadc" }}
              />
            </ListItem>
          ))}
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
