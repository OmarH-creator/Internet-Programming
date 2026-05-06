import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AuthModal from "../components/auth/AuthModal";
import UserMenu from "../components/user/UserMenu";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import CommunityHeader from "../components/communities/CommunityHeader";
import { communityService } from "../services/communityService";

function CommunityDetailPage() {
    const { communityId } = useParams();
    const navigate = useNavigate();
    const [authOpen, setAuthOpen] = useState(false);
    const [defaultTab, setDefaultTab] = useState("login");
    const [refresh, setRefresh] = useState(0);
    const [community, setCommunity] = useState(null);
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        fetchCommunity();
    }, [communityId]);

    const fetchCommunity = async () => {
        try {
            const response = await communityService.getCommunityById(communityId);
            setCommunity(response.data.data);
        } catch (error) {
            console.error("Error fetching community:", error);
        }
    };

    const handleJoin = async () => {
        try {
            await communityService.joinCommunity(communityId);
            fetchCommunity();
        } catch (error) {
            console.error("Error joining community:", error);
        }
    };

    const handleLeave = async () => {
        try {
            await communityService.leaveCommunity(communityId);
            fetchCommunity();
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

    const isMember = community?.members?.some(member => 
        (typeof member === 'string' ? member : member._id) === user?._id
    );

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
                            onClick={() => navigate("/communities")}
                        >
                            Communities
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

            <CommunityHeader 
                community={community} 
                onJoin={handleJoin} 
                onLeave={handleLeave}
                isMember={isMember}
                currentUserId={user?._id}
            />

            <Box sx={{ py: 4, maxWidth: "700px", margin: "0 auto", px: 2 }}>
                {/* Show create form only if logged in */}
                {isAuthenticated && (
                    <Box sx={{ mb: 3 }}>
                        <CreatePostForm 
                            communityId={communityId} 
                            onPostCreated={() => setRefresh(r => r + 1)} 
                        />
                    </Box>
                )}

                {/* Post list filtered by community */}
                <PostList communityId={communityId} refresh={refresh} />
            </Box>

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

export default CommunityDetailPage;
