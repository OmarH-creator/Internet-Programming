import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AuthModal from "../components/auth/AuthModal";
import UserMenu from "../components/user/UserMenu";
import { useAuth } from "../context/AuthContext";
import CommunityList from "../components/communities/CommunityList";
import CreateCommunityModal from "../components/communities/CreateCommunityModal";
import { communityService } from "../services/communityService";

function CommunitiesPage() {
    const navigate = useNavigate();
    const [authOpen, setAuthOpen] = useState(false);
    const [defaultTab, setDefaultTab] = useState("login");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [communities, setCommunities] = useState([]);
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const response = await communityService.getAllCommunities();
            setCommunities(response.data.data);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    };

    const handleCreateCommunity = async (communityData) => {
        try {
            await communityService.createCommunity(communityData);
            fetchCommunities();
        } catch (error) {
            console.error("Error creating community:", error);
        }
    };

    const handleJoin = async (communityId) => {
        try {
            await communityService.joinCommunity(communityId);
            fetchCommunities();
        } catch (error) {
            console.error("Error joining community:", error);
        }
    };

    const handleLeave = async (communityId) => {
        try {
            await communityService.leaveCommunity(communityId);
            fetchCommunities();
        } catch (error) {
            console.error("Error leaving community:", error);
        }
    };

    const handleAuthSuccess = () => {
        setAuthOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    const handleNavigate = (action) => {
        if (action === "profile") navigate("/profile");
        if (action === "settings") navigate("/settings");
        if (action === "home") navigate("/");
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
                    <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 700, fontSize: "30px", cursor: 'pointer' }}
                        onClick={() => navigate("/")}
                    >
                        reddit
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button 
                            sx={{ color: '#d7dadc', textTransform: 'none' }}
                            onClick={() => navigate("/")}
                        >
                            Home
                        </Button>
                        {isAuthenticated && user ? (
                            <UserMenu
                                user={user}
                                onLogout={handleLogout}
                                onNavigate={handleNavigate}
                            />
                        ) : (
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

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Browse Communities
                    </Typography>
                    {isAuthenticated && (
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={() => setCreateModalOpen(true)}
                            sx={{ borderRadius: 20 }}
                        >
                            Create Community
                        </Button>
                    )}
                </Box>
                <CommunityList 
                    communities={communities} 
                    onJoin={handleJoin} 
                    onLeave={handleLeave} 
                    currentUserId={user?._id}
                />
            </Container>

            <CreateCommunityModal 
                open={createModalOpen} 
                handleClose={() => setCreateModalOpen(false)} 
                onCreate={handleCreateCommunity}
            />

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

export default CommunitiesPage;
