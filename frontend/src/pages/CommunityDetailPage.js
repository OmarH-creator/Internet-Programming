import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import { useAuth } from "../context/AuthContext";
import PostList from "../components/posts/PostList";
import CommunityHeader from "../components/communities/CommunityHeader";
import { communityService } from "../services/communityService";

function CommunityDetailPage() {
    const { communityId } = useParams();
    const [community, setCommunity] = useState(null);
    const { user } = useAuth();

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

    const isMember = community?.members?.some(member => 
        (typeof member === 'string' ? member : member._id) === (user?._id || user?.id)
    );

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#111111ff", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
                <LeftSidebar />

                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <CommunityHeader 
                        community={community} 
                        onJoin={handleJoin} 
                        onLeave={handleLeave}
                        isMember={isMember}
                        currentUserId={user?._id || user?.id}
                        onUpdate={fetchCommunity}
                    />

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 3, py: 4, px: 2 }}>
                        <Box sx={{ width: "100%", maxWidth: "700px" }}>
                            {/* Post list filtered by community */}
                            <PostList communityId={communityId} />
                        </Box>
                        <RightSidebar />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CommunityDetailPage;
