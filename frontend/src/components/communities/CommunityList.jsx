import React from 'react';
import { Avatar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import '../../styles/communityList.css';

const FALLBACK_COLORS = ["#FF4500", "#FF69B4", "#003791", "#A3AAAE", "#FF8C00", "#46D160", "#0DD3BB", "#2259FF"];

const CommunityList = ({ communities }) => {
    const navigate = useNavigate();

    return (
        <Box className="community-list-container">
            <Box className="community-list">
                {communities.map((community, index) => {
                    const displayName = community.name.startsWith("r/") ? community.name : `r/${community.name}`;
                    const avatarLetter = community.name.replace(/^r\//i, '').charAt(0).toUpperCase();
                    const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

                    return (
                        <Box
                            key={community._id}
                            className="community-list-row"
                            onClick={() => navigate(`/community/${community._id}`)}
                        >
                            <Avatar
                                src={community.avatar || undefined}
                                className="community-list-avatar"
                                sx={{ bgcolor: bgColor }}
                            >
                                {!community.avatar && avatarLetter}
                            </Avatar>
                            <Box className="community-list-info">
                                <Typography className="community-list-name">
                                    {displayName}
                                </Typography>
                                <Typography className="community-list-description">
                                    {community.description || 'No description available'}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
                {communities.length === 0 && (
                    <Box className="community-list-empty">
                        <Typography>No communities found</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommunityList;
