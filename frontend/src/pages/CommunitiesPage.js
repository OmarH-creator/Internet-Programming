import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import { useAuth } from "../context/AuthContext";
import CommunityList from "../components/communities/CommunityList";
import { communityService } from "../services/communityService";

function CommunitiesPage() {
    const [communities, setCommunities] = useState([]);
    const { user } = useAuth();

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

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#111111ff", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
                <LeftSidebar />

                <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", maxWidth: "900px", px: 2, py: 4 }}>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Browse Communities
                            </Typography>
                        </Box>
                        <CommunityList 
                            communities={communities} 
                            onJoin={handleJoin} 
                            onLeave={handleLeave} 
                            currentUserId={user?._id || user?.id}
                        />
                    </Box>
                </Box>

                <RightSidebar />
            </Box>
        </Box>
    );
}

export default CommunitiesPage;
