import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import CommunityHeader from "../components/communities/CommunityHeader";
import { communityService } from "../services/communityService";

function CommunityDetailPage() {
    const { communityId } = useParams();
    const [refresh, setRefresh] = useState(0);
    const [community, setCommunity] = useState(null);
    const { user, isAuthenticated } = useAuth();

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
                </Box>

                <RightSidebar />
            </Box>
        </Box>
    );
}

export default CommunityDetailPage;
