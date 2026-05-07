import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box, InputBase, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, List, ListItem, ListItemAvatar, Avatar } from "@mui/material";
import api from "../../services/api";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LoginIcon from '@mui/icons-material/Login';
import CampaignIcon from '@mui/icons-material/Campaign';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import RedditIcon from '@mui/icons-material/Reddit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UserMenu from "../user/UserMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../../styles/layout.css";

import AuthModal from "../auth/AuthModal";

function Navbar({ searchScope = "" }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");

  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const [userRes, commRes] = await Promise.all([
            api.get(`/users/search?q=${searchQuery}`),
            api.get(`/communities/search?q=${searchQuery}`)
          ]);
          setUserResults(userRes.data.data.users);
          setCommunityResults(commRes.data.data.communities);
          setShowSearchDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setUserResults([]);
          setCommunityResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setUserResults([]);
        setCommunityResults([]);
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (action) => {
    if (action === "profile") navigate("/profile");
    if (action === "settings") navigate("/settings");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className="navbar-appbar"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="navbar-toolbar">
          
          {/* Logo */}
          <Box className="navbar-logo-container" onClick={() => navigate("/")}>
            <Typography variant="h6" className="navbar-logo-text">
              reddit
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box ref={searchRef} className="navbar-search-container">
            <SearchIcon sx={{ color: "#818384", mr: 1 }} />
            <InputBase
              placeholder={searchScope ? `Search in u/${searchScope}` : "Search Reddit"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
              sx={{ color: "#d7dadc", flexGrow: 1, fontSize: "14px" }}
            />
            <Button
              variant="text"
              startIcon={<AutoAwesomeIcon sx={{ color: "#ff4500" }} />}
              sx={{
                color: "#ff4500",
                textTransform: "none",
                borderRadius: "999px",
                minWidth: "auto",
                p: "4px 8px",
                "&:hover": { backgroundColor: "rgba(255, 69, 0, 0.1)" }
              }}
            >
              Ask
            </Button>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <Box className="navbar-search-dropdown" sx={{ maxHeight: "400px", overflowY: "auto" }}>
                <List disablePadding>
                  {isSearching ? (
                    <ListItem sx={{ py: 2, justifyContent: "center" }}>
                      <Typography sx={{ color: "#818384", fontSize: "14px" }}>Searching...</Typography>
                    </ListItem>
                  ) : (userResults.length > 0 || communityResults.length > 0) ? (
                    <>
                      {/* Communities Section */}
                      {communityResults.length > 0 && (
                        <>
                          <ListItem sx={{ pt: 1, pb: 0, px: 2 }}>
                            <Typography sx={{ color: "#818384", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Communities</Typography>
                          </ListItem>
                          {communityResults.map((community, index) => {
                             const avatarLetter = community.name.replace(/^r\//i, '').charAt(0).toUpperCase();
                             const memberCount = community.members?.length || 0;
                             const fallbackColors = ["#FF4500", "#FF69B4", "#003791", "#A3AAAE", "#FF8C00", "#46D160", "#0DD3BB", "#2259FF"];
                             const bgColor = fallbackColors[index % fallbackColors.length];
                             return (
                            <ListItem
                              key={`comm-${community._id}`}
                              button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                navigate(`/community/${community._id}`);
                                setShowSearchDropdown(false);
                                setSearchQuery("");
                              }}
                              className="navbar-search-item"
                              sx={{ py: 1 }}
                            >
                              <ListItemAvatar sx={{ minWidth: 40 }}>
                                <Avatar src={community.avatar} sx={{ width: 32, height: 32, bgcolor: bgColor, fontSize: "14px", fontWeight: "bold" }}>
                                  {!community.avatar && avatarLetter}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={community.name.startsWith("r/") ? community.name : `r/${community.name}`}
                                secondary={`${memberCount.toLocaleString()} member${memberCount !== 1 ? 's' : ''}`}
                                primaryTypographyProps={{ fontSize: "14px", color: "#d7dadc", fontWeight: 500 }} 
                                secondaryTypographyProps={{ fontSize: "12px", color: "#818384" }}
                              />
                            </ListItem>
                          )})}
                        </>
                      )}

                      {/* Users Section */}
                      {userResults.length > 0 && (
                        <>
                          <ListItem sx={{ pt: 1, pb: 0, px: 2, mt: communityResults.length > 0 ? 1 : 0 }}>
                            <Typography sx={{ color: "#818384", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Users</Typography>
                          </ListItem>
                          {userResults.map((searchUser) => (
                            <ListItem
                              key={`user-${searchUser.id}`}
                              button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                navigate(`/profile/${searchUser.username}`);
                                setShowSearchDropdown(false);
                                setSearchQuery("");
                              }}
                              className="navbar-search-item"
                              sx={{ py: 1 }}
                            >
                              <ListItemAvatar sx={{ minWidth: 40 }}>
                                <Avatar src={searchUser.avatarUrl} sx={{ width: 32, height: 32 }}>
                                  {!searchUser.avatarUrl && searchUser.username.charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary={`u/${searchUser.username}`} 
                                primaryTypographyProps={{ fontSize: "14px", color: "#d7dadc", fontWeight: 500 }} 
                              />
                            </ListItem>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <ListItem sx={{ py: 2, justifyContent: "center" }}>
                      <Typography sx={{ color: "#818384", fontSize: "14px" }}>No results found</Typography>
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Box>

          {/* Auth Buttons / User Menu */}
          <Box className="navbar-actions" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <Button
                variant="text"
                startIcon={<AddOutlinedIcon sx={{ fontSize: '22px !important' }} />}
                onClick={() => navigate("/submit")}
                sx={{
                  color: "#d7dadc",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "999px",
                  px: 2,
                  "&:hover": { backgroundColor: "#2a3236" }
                }}
              >
                Create
              </Button>
            )}
            {isAuthenticated && user ? (
              <UserMenu
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => { setDefaultTab("register"); setAuthOpen(true); }}
                  className="navbar-btn-signup"
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  onClick={() => { setDefaultTab("login"); setAuthOpen(true); }}
                  className="navbar-btn-login"
                >
                  Log In
                </Button>
                <IconButton 
                  onClick={handleClick}
                  sx={{ 
                    color: "#d7dadc",
                    "&:hover": { backgroundColor: "#2a3236" }
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#1a1a1b",
                      color: "#d7dadc",
                      border: "1px solid #343536",
                      minWidth: "220px",
                      mt: 1
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleClose(); setDefaultTab("login"); setAuthOpen(true); }}>
                    <ListItemIcon><LoginIcon sx={{ color: "#d7dadc" }} fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: "14px" }}>Log In / Sign Up</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><CampaignIcon sx={{ color: "#d7dadc" }} fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: "14px" }}>Advertise on Reddit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><RedditIcon sx={{ color: "#d7dadc" }} fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: "14px" }}>
                      Try Reddit Pro <span style={{ color: "#ff4500", fontSize: "12px", marginLeft: "4px", fontWeight: "bold" }}>BETA</span>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon><ModeNightIcon sx={{ color: "#d7dadc" }} fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: "14px" }}>Display Mode</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {authOpen && (
        <AuthModal
          defaultTab={defaultTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
