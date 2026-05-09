import React, { useRef, useState } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Avatar, 
    Container, 
    Paper,
    Stack,
    IconButton,
    CircularProgress
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import { communityService } from '../../services/communityService';

const CommunityHeader = ({ community, onJoin, onLeave, isMember, currentUserId, onUpdate }) => {
    const [uploading, setUploading] = useState({ avatar: false, banner: false });
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    if (!community) return null;

    const isCreator = community.creator === currentUserId || community.creator?._id === currentUserId;
    const isAdmin = community.admins?.some(admin => {
        const adminId = typeof admin === 'string' ? admin : admin._id;
        return adminId === currentUserId;
    });
    const canEdit = isCreator || isAdmin;

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            if (type === 'avatar') {
                await communityService.uploadAvatar(community._id, formData);
            } else {
                await communityService.uploadBanner(community._id, formData);
            }
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(`Failed to upload ${type}`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                mb: 3, 
                overflow: 'hidden', 
                borderRadius: 0, 
                backgroundColor: '#1A1A1B',
                borderBottom: '1px solid #343536'
            }}
        >
            {/* Banner Section */}
            <Box sx={{ height: 180, bgcolor: '#33a8ff', position: 'relative' }}>
                {community.banner && (
                    <img 
                        src={community.banner} 
                        alt="banner" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                )}
                {canEdit && (
                    <>
                        <input
                            type="file"
                            hidden
                            ref={bannerInputRef}
                            onChange={(e) => handleFileChange(e, 'banner')}
                            accept="image/*"
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                color: 'white'
                            }}
                            onClick={() => bannerInputRef.current.click()}
                            disabled={uploading.banner}
                        >
                            {uploading.banner ? <CircularProgress size={24} color="inherit" /> : <PhotoCameraIcon />}
                        </IconButton>
                    </>
                )}
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -3, pb: 2, px: { xs: 1, md: 2 } }}>
                    {/* Avatar Section */}
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                border: '4px solid #1A1A1B', 
                                bgcolor: community.avatar ? 'white' : '#0079D3',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {community.avatar ? (
                                <img src={community.avatar} alt={community.name} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                            ) : (
                                <GroupsIcon sx={{ fontSize: 45 }} />
                            )}
                        </Avatar>
                        {canEdit && (
                            <>
                                <input
                                    type="file"
                                    hidden
                                    ref={avatarInputRef}
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                    accept="image/*"
                                />
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: '#D7DADC',
                                        '&:hover': { bgcolor: '#EBEDEF' },
                                        color: '#1A1A1B',
                                        border: '2px solid #1A1A1B'
                                    }}
                                    onClick={() => avatarInputRef.current.click()}
                                    disabled={uploading.avatar}
                                >
                                    {uploading.avatar ? <CircularProgress size={16} color="inherit" /> : <EditIcon sx={{ fontSize: 16 }} />}
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {/* Info Section */}
                    <Box sx={{ ml: 2, mt: 4, flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#D7DADC', lineHeight: 1 }}>
                                    {community.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#818384', mt: 0.5 }}>
                                    r/{community.name}
                                </Typography>
                            </Box>
                            {currentUserId && (
                                <Box>
                                    {isMember ? (
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => onLeave(community._id)}
                                            sx={{ 
                                                borderRadius: '999px', 
                                                px: 3, 
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                color: '#D7DADC',
                                                borderColor: '#D7DADC',
                                                '&:hover': {
                                                    borderColor: '#D7DADC',
                                                    bgcolor: 'rgba(215, 218, 220, 0.05)'
                                                }
                                            }}
                                        >
                                            Joined
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="contained" 
                                            onClick={() => onJoin(community._id)}
                                            sx={{ 
                                                borderRadius: '999px', 
                                                px: 4, 
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                bgcolor: '#D7DADC',
                                                color: '#1A1A1B',
                                                '&:hover': {
                                                    bgcolor: '#EBEDEF'
                                                }
                                            }}
                                        >
                                            Join
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Box>
                
                <Box sx={{ px: { xs: 1, md: 2 }, pb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#D7DADC', maxWidth: '600px' }}>
                        {community.description}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#818384', fontWeight: 600 }}>
                            {community.members?.length || 0} Members
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#818384', fontWeight: 600 }}>
                            Created by u/{community.creator?.username || 'unknown'}
                        </Typography>
                    </Stack>
                </Box>
            </Container>
        </Paper>
    );
};

export default CommunityHeader;
