import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    Stack,
    IconButton,
    InputBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../styles/createCommunityModal.css';

const CreateCommunityModal = ({ open, handleClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await onCreate({ name, description });
            setName('');
            setDescription('');
            handleClose();
        } catch (error) {
            console.error("Error creating community:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="community-modal-box">
                <IconButton 
                    onClick={handleClose} 
                    className="community-close-button"
                >
                    <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <Box className="community-header">
                    <Typography variant="h5" className="community-title">
                        Tell us about your community
                    </Typography>
                    <Typography className="community-subtitle">
                        A name and description help people understand what your community is all about.
                    </Typography>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
                    {/* Left Column (Inputs) */}
                    <Box sx={{ flex: 1 }}>
                        <Box className="community-input-box">
                            <Typography className="community-input-label">
                                Community name <span>*</span>
                            </Typography>
                            <InputBase
                                fullWidth
                                placeholder=""
                                value={name}
                                onChange={(e) => {
                                    if(e.target.value.length <= 21) {
                                        setName(e.target.value);
                                    }
                                }}
                                className="community-input-base"
                            />
                            <Typography className="community-char-count">
                                {name.length}/21
                            </Typography>
                        </Box>

                        <Box className="community-input-box community-description-box">
                            <Typography className="community-input-label">
                                Description<span>*</span>
                            </Typography>
                            <InputBase
                                fullWidth
                                multiline
                                placeholder=""
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="community-description-input"
                            />
                            <Typography className="community-char-count">
                                {description.length}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Column (Preview) */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box className="community-preview-card">
                            {/* Banner placeholder */}
                            <Box className="community-preview-banner" />
                            
                            {/* Content */}
                            <Box className="community-preview-content">
                                {/* Avatar */}
                                <Box className="community-preview-avatar">
                                    r/
                                </Box>
                                
                                <Box className="community-preview-info">
                                    <Typography className="community-preview-name">
                                        r/{name || 'communityname'}
                                    </Typography>
                                    <Typography className="community-preview-stats">
                                        1 weekly visitor · 1 weekly contributor
                                    </Typography>
                                    <Typography className="community-preview-desc">
                                        {description || 'Your community description'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Stack>

                {/* Footer */}
                <Stack direction="row" justifyContent="flex-end" alignItems="center" className="community-footer">

                    {/* Buttons */}
                    <Stack direction="row" spacing={2}>
                        <Button 
                            onClick={handleClose} 
                            className="community-btn-back"
                        >
                            Back
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading || !name} 
                            className="community-btn-create"
                        >
                            {loading ? 'Creating...' : 'Create Community'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CreateCommunityModal;
