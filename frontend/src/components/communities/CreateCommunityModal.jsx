import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const CreateCommunityModal = ({ open, handleClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            <Box sx={style}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Create a community
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        placeholder="community_name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        helperText="Community names including capitalization cannot be changed."
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        placeholder="Tell us about your community"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 20 }}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={loading || !name} 
                            sx={{ borderRadius: 20 }}
                        >
                            {loading ? 'Creating...' : 'Create Community'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateCommunityModal;
