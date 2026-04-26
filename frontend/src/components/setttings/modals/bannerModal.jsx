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

export default function BannerModal({ open, onClose, currentBanner, onSave }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPreview(currentBanner || null);
      setFile(null);
      setError("");
    }
  }, [open, currentBanner]);

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
      setError(err.message || "Failed to upload banner");
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
      maxWidth="md"
      fullWidth
      className="banner-modal"
    >
      <DialogTitle className="banner-modal-header">
        <Typography className="banner-modal-title">
          Profile banner
        </Typography>
        <IconButton onClick={handleCancel} className="banner-modal-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="banner-modal-content">
        <Typography className="banner-modal-subtitle">
          Choose a wide image that looks sharp on desktop and mobile.
        </Typography>

        <Box className="banner-modal-content-box">
          {/* Preview */}
          <Box
            className={`banner-modal-preview ${preview ? 'has-image' : ''}`}
          >
            {preview ? (
              <Box
                component="img"
                src={preview}
                alt="Banner preview"
              />
            ) : (
              <Box className="banner-modal-preview-placeholder">
                <CloudUploadIcon sx={{ fontSize: 48, color: "#818384", mb: 1 }} />
                <Typography sx={{ color: "#818384", fontSize: 13 }}>
                  Upload a banner image
                </Typography>
              </Box>
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
            className="banner-modal-upload-btn"
            startIcon={<CloudUploadIcon />}
          >
            {preview ? "Change image" : "Upload image"}
          </Button>

          {/* Remove Button */}
          {preview && (
            <Button
              onClick={handleRemove}
              disabled={loading}
              className="banner-modal-remove-btn"
            >
              Remove
            </Button>
          )}

          {/* Error Message */}
          {error && (
            <Typography className="banner-modal-error">
              {error}
            </Typography>
          )}

          {/* Info Text */}
          <Typography className="banner-modal-info">
            Recommended: 16:9 aspect ratio, at least 1920x1080 pixels. Max size: 5MB.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions className="banner-modal-actions">
        <Button
          onClick={handleCancel}
          disabled={loading}
          className="banner-modal-btn-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || loading}
          className="banner-modal-btn-save"
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
