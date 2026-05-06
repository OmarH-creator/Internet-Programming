import React from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Avatar, 
    Container, 
    Paper,
    Stack
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

const CommunityHeader = ({ community, onJoin, onLeave, isMember, currentUserId }) => {
    if (!community) return null;

    return (
        <Paper elevation={0} sx={{ mb: 3, overflow: 'hidden', borderRadius: 2 }}>
            <Box sx={{ height: 120, bgcolor: 'primary.dark' }}>
                {community.banner && <img src={community.banner} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </Box>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -4, pb: 2, px: 2 }}>
                    <Avatar 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            border: '4px solid', 
                            borderColor: 'background.paper',
                            bgcolor: 'primary.main'
                        }}
                    >
                        {community.avatar ? <img src={community.avatar} alt={community.name} width="100%" /> : <GroupsIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                    <Box sx={{ ml: 2, mt: 4, flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {community.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    r/{community.name}
                                </Typography>
                            </Box>
                            {currentUserId && (
                                <Box>
                                    {isMember ? (
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => onLeave(community._id)}
                                            sx={{ borderRadius: 20, px: 4 }}
                                        >
                                            Joined
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="contained" 
                                            onClick={() => onJoin(community._id)}
                                            sx={{ borderRadius: 20, px: 4 }}
                                        >
                                            Join
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Box>
                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="body1">
                        {community.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {community.members?.length || 0} Members
                    </Typography>
                </Box>
            </Container>
        </Paper>
    );
};

export default CommunityHeader;
