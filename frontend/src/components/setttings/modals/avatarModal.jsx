import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../../styles/settingsModals.css";

export default function AvatarModal({ open, onClose, currentAvatar, onSave }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPreview(currentAvatar || null);
      setFile(null);
      setError("");
    }
  }, [open, currentAvatar]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(file);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      className="avatar-modal"
    >
      <DialogTitle className="avatar-modal-header">
        <Typography className="avatar-modal-title">
          Profile photo
        </Typography>
        <IconButton onClick={handleCancel} className="avatar-modal-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="avatar-modal-content">
        <Typography className="avatar-modal-subtitle">
          Upload a square image for the best results.
        </Typography>

        <Box className="avatar-modal-content-box">
          {/* Preview */}
          <Box
            className={`avatar-modal-preview ${preview ? 'has-image' : ''}`}
          >
            {preview ? (
              <Box
                component="img"
                src={preview}
                alt="Avatar preview"
              />
            ) : (
              <CloudUploadIcon sx={{ fontSize: 48, color: "#818384" }} />
            )}
          </Box>

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="avatar-modal-upload-btn"
            startIcon={<CloudUploadIcon />}
          >
            {preview ? "Change image" : "Upload image"}
          </Button>

          {/* Remove Button */}
          {preview && (
            <Button
              onClick={handleRemove}
              disabled={loading}
              className="avatar-modal-remove-btn"
            >
              Remove
            </Button>
          )}

          {/* Error Message */}
          {error && (
            <Typography className="avatar-modal-error">
              {error}
            </Typography>
          )}

          {/* Info Text */}
          <Typography className="avatar-modal-info">
            Recommended: Square image, at least 256x256 pixels. Max size: 5MB.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions className="avatar-modal-actions">
        <Button
          onClick={handleCancel}
          disabled={loading}
          className="avatar-modal-btn-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || loading}
          className="avatar-modal-btn-save"
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
