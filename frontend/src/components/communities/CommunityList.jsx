import React from 'react';
import { 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Avatar, 
    Button, 
    Typography, 
    Paper,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';

const CommunityList = ({ communities, onJoin, onLeave, currentUserId }) => {
    return (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Communities
            </Typography>
            <List>
                {communities.map((community) => {
                    const isMember = community.members?.includes(currentUserId);
                    return (
                        <ListItem 
                            key={community._id}
                            secondaryAction={
                                currentUserId && (
                                    isMember ? (
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            onClick={() => onLeave(community._id)}
                                            sx={{ borderRadius: 20 }}
                                        >
                                            Leave
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            onClick={() => onJoin(community._id)}
                                            sx={{ borderRadius: 20 }}
                                        >
                                            Join
                                        </Button>
                                    )
                                )
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {community.avatar ? <img src={community.avatar} alt={community.name} width="100%" /> : <GroupsIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Link to={`/community/${community._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                                            r/{community.name}
                                        </Typography>
                                    </Link>
                                }
                                secondary={`${community.members?.length || 0} members`}
                            />
                        </ListItem>
                    );
                })}
                {communities.length === 0 && (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No communities found</Typography>
                    </Box>
                )}
            </List>
        </Paper>
    );
};

export default CommunityList;
