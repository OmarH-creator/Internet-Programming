import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Tabs, Tab, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Tooltip, Paper } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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
    const [tabValue, setTabValue] = useState(0);
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

    const handleKick = async (targetUserId) => {
        if (!window.confirm("Are you sure you want to kick this member?")) return;
        try {
            await communityService.kickMember(communityId, targetUserId);
            fetchCommunity();
        } catch (error) {
            console.error("Error kicking member:", error);
            alert(error.response?.data?.message || "Failed to kick member");
        }
    };

    const handlePromote = async (targetUserId) => {
        if (!window.confirm("Are you sure you want to promote this member to admin?")) return;
        try {
            await communityService.promoteToAdmin(communityId, targetUserId);
            fetchCommunity();
        } catch (error) {
            console.error("Error promoting member:", error);
            alert(error.response?.data?.message || "Failed to promote member");
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const userId = user?._id || user?.id;
    const isMember = community?.members?.some(member => 
        (typeof member === 'string' ? member : member._id) === userId
    );

    const isCreator = community?.creator?._id === userId || community?.creator === userId;
    const currentUserIsAdmin = community?.admins?.some(admin => (admin._id || admin) === userId);
    const canManage = isCreator || currentUserIsAdmin;

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
                        currentUserId={userId}
                        onUpdate={fetchCommunity}
                    />

                    <Box sx={{ borderBottom: 1, borderColor: '#343536', bgcolor: '#1A1A1B' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            textColor="inherit"
                            indicatorColor="primary"
                            sx={{
                                px: { xs: 1, md: 2 },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    minWidth: 100
                                }
                            }}
                        >
                            <Tab label="Posts" />
                            <Tab label="Members" />
                        </Tabs>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 3, py: 4, px: 2 }}>
                        <Box sx={{ width: "100%", maxWidth: "700px" }}>
                            {tabValue === 0 && (
                                <PostList communityId={communityId} />
                            )}
                            
                            {tabValue === 1 && (
                                <Paper sx={{ bgcolor: '#1A1A1B', borderRadius: 1, border: '1px solid #343536', overflow: 'hidden' }}>
                                    <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #343536', color: '#D7DADC' }}>
                                        Community Members ({community?.members?.length || 0})
                                    </Typography>
                                    <List>
                                        {community?.members?.map((member) => {
                                            const memberId = member._id || member;
                                            const isMemberCreator = community.creator?._id === memberId || community.creator === memberId;
                                            const isMemberAdmin = community.admins?.some(admin => (admin._id || admin) === memberId);
                                            
                                            return (
                                                <ListItem 
                                                    key={memberId}
                                                    divider
                                                    sx={{ borderColor: '#343536' }}
                                                    secondaryAction={
                                                        <Box>
                                                            {isCreator && !isMemberCreator && !isMemberAdmin && (
                                                                <Tooltip title="Promote to Admin">
                                                                    <IconButton onClick={() => handlePromote(memberId)} sx={{ color: '#818384' }}>
                                                                        <AdminPanelSettingsIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            {canManage && !isMemberCreator && (userId !== memberId) && (isCreator || !isMemberAdmin) && (
                                                                <Tooltip title="Kick Member">
                                                                    <IconButton onClick={() => handleKick(memberId)} sx={{ color: '#ff585b' }}>
                                                                        <PersonRemoveIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar src={member.avatar}>{member.username?.charAt(0)}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography sx={{ color: '#D7DADC', fontWeight: 600 }}>
                                                                    u/{member.username || 'unknown'}
                                                                </Typography>
                                                                {isMemberCreator && (
                                                                    <Typography variant="caption" sx={{ bgcolor: '#0079D3', color: 'white', px: 1, borderRadius: 1 }}>
                                                                        Owner
                                                                    </Typography>
                                                                )}
                                                                {isMemberAdmin && !isMemberCreator && (
                                                                    <Typography variant="caption" sx={{ bgcolor: '#46D160', color: 'white', px: 1, borderRadius: 1 }}>
                                                                        Admin
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                        <RightSidebar />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CommunityDetailPage;
