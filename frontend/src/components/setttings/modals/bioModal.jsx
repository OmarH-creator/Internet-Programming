import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/settingsModals.css";

const MAX_BIO_LENGTH = 300;

export default function BioModal({ open, onClose, currentBio, onSave }) {
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setBio(currentBio || "");
      setError("");
    }
  }, [open, currentBio]);

  const handleChange = (e) => {
    const value = e.target.value;
    setBio(value.slice(0, MAX_BIO_LENGTH));
    setError("");
  };

  const handleSave = () => {
    if (bio.length > MAX_BIO_LENGTH) {
      setError(`Bio must be ${MAX_BIO_LENGTH} characters or fewer`);
      return;
    }
    onSave(bio);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="xs"
      fullWidth
      className="bio-modal"
    >
      <DialogTitle className="bio-modal-header">
        <Typography className="bio-modal-title">
          About description
        </Typography>
        <IconButton onClick={handleCancel} className="bio-modal-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="bio-modal-content">
        <Typography className="bio-modal-subtitle">
          Give a brief description of yourself
        </Typography>

        <Box className="bio-modal-textarea-wrap">
          {!bio && <Typography className="bio-modal-field-label">About</Typography>}
          <TextField
            multiline
            rows={5}
            fullWidth
            value={bio}
            onChange={handleChange}
            error={!!error}
            className="bio-modal-textarea"
            inputProps={{ maxLength: MAX_BIO_LENGTH }}
          />
        </Box>

        <Box className="bio-modal-footer">
          <Typography className="bio-modal-inline-error">{error || "\u00a0"}</Typography>
          <Typography className="bio-modal-counter">{`${bio.length}/${MAX_BIO_LENGTH}`}</Typography>
        </Box>
      </DialogContent>

      <DialogActions className="bio-modal-actions">
        <Button
          onClick={handleCancel}
          className="bio-modal-btn-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="bio-modal-btn-save"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
