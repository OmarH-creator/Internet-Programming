import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/settingsModals.css";

export default function VerifyPhonePasswordModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  serverError = ""
}) {
  const [password, setPassword] = useState("");

  const canContinue = !loading && password.trim().length > 0;

  const handleClose = () => {
    if (loading) return;
    setPassword("");
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canContinue) return;
    await onSubmit?.(password.trim());
  };

  return (
    <Dialog
      className="settings-modal"
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent className="settings-modal-content">
        <Box className="settings-modal-header">
          <Typography className="settings-modal-title">Verify your password</Typography>
          <IconButton
            className="settings-modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          className="settings-modal-input"
          type="password"
          fullWidth
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        {serverError ? (
          <Typography className="settings-modal-error">{serverError}</Typography>
        ) : null}

        <Box className="settings-modal-actions">
          <Button
            className="settings-modal-btn"
            onClick={handleClose}
            disabled={loading}
            variant="contained"
          >
            Cancel
          </Button>

          <Button
            className="settings-modal-btn"
            onClick={handleSubmit}
            disabled={!canContinue}
            variant="contained"
          >
            {loading ? "Updating..." : "Continue"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}