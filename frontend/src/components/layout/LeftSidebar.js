import React, { useState } from "react";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography,
  Collapse
} from "@mui/material";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ExploreIcon from "@mui/icons-material/Explore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import WorkIcon from '@mui/icons-material/Work';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import LanguageIcon from '@mui/icons-material/Language';

import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import "../../styles/layout.css";
import { useAuth } from "../../context/AuthContext";
import CreateCommunityModal from "../communities/CreateCommunityModal";
import { communityService } from "../../services/communityService";

function LeftSidebar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleResourcesClick = () => {
    setResourcesOpen(!resourcesOpen);
  };

  const handleCreateCommunity = async (communityData) => {
    try {
      await communityService.createCommunity(communityData);
      setCreateModalOpen(false);
      // Optionally we could refresh communities or navigate, but keeping it simple as it was
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  const navItems = [
    { text: "Home", icon: <HomeIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Popular", icon: <TrendingUpIcon sx={{ color: "#d7dadc" }} /> },
    { text: "News", icon: <NewspaperIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Explore", icon: <ExploreIcon sx={{ color: "#d7dadc" }} /> },
  ];

  const resourceItems = [
    { text: "About Reddit", icon: <InfoOutlinedIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Advertise", icon: <CampaignOutlinedIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Developer Platform", icon: <CodeIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Help", icon: <HelpIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Blog", icon: <BookOutlinedIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Careers", icon: <WorkIcon sx={{ color: "#d7dadc" }} /> },
    { text: "Press", icon: <MicNoneOutlinedIcon sx={{ color: "#d7dadc" }} /> },
  ];

  return (
    <Box className="left-sidebar-container">
      <List sx={{ pt: 2 }}>
        {navItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              className={`sidebar-list-item-btn ${index === 0 ? "active" : ""}`}
              onClick={() => { if (item.text === "Home") navigate("/"); }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: "14px", fontWeight: index === 0 ? 600 : 400 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}

        {isAuthenticated && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              className="sidebar-list-item-btn"
              onClick={() => setCreateModalOpen(true)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AddIcon sx={{ color: "#d7dadc" }} />
              </ListItemIcon>
              <ListItemText 
                primary="Create Community" 
                primaryTypographyProps={{ fontSize: "14px", fontWeight: 400 }} 
              />
            </ListItemButton>
          </ListItem>
        )}

        <Divider sx={{ borderColor: "#2a3236", my: 2, mx: 2 }} />

        {/* Resources Section */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleResourcesClick} sx={{ mx: 1, borderRadius: "8px", "&:hover": { backgroundColor: "#272729" } }}>
            <ListItemText 
              primary="RESOURCES" 
              primaryTypographyProps={{ fontSize: "12px", color: "#818384", fontWeight: 600, letterSpacing: "0.5px" }} 
            />
            {resourcesOpen ? <ExpandLessIcon sx={{ color: "#818384" }} /> : <ExpandMoreIcon sx={{ color: "#818384" }} />}
          </ListItemButton>
        </ListItem>

        <Collapse in={resourcesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {resourceItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton sx={{ borderRadius: "8px", mx: 1, pl: 4, "&:hover": { backgroundColor: "#272729" } }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "14px" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ borderColor: "#2a3236", my: 2, mx: 2 }} />

        {/* Best of Reddit */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: "8px", mx: 1, "&:hover": { backgroundColor: "#272729" } }}>
             <ListItemIcon sx={{ minWidth: 40 }}>
                <LanguageIcon sx={{ color: "#d7dadc" }} />
             </ListItemIcon>
             <ListItemText primary="Best of Reddit" primaryTypographyProps={{ fontSize: "14px" }} />
          </ListItemButton>
        </ListItem>
      </List>

      <CreateCommunityModal 
        open={createModalOpen} 
        handleClose={() => setCreateModalOpen(false)} 
        onCreate={handleCreateCommunity}
      />
    </Box>
  );
}

export default LeftSidebar;
