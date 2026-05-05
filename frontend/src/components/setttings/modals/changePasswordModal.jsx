import React, { useMemo, useState } from "react";
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

const NEW_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  serverError = ""
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const newPasswordError = useMemo(() => {
    if (!newPassword.trim()) return "New password is required";
    if (!NEW_PASSWORD_REGEX.test(newPassword.trim())) {
      return "New password must be at least 8 characters and include at least one letter and one number";
    }
    return "";
  }, [newPassword]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword.trim()) return "Please confirm your new password";
    if (confirmPassword !== newPassword) {
      return "New passwords do not match";
    }
    return "";
  }, [confirmPassword, newPassword]);

  const canSave =
    !loading &&
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    !newPasswordError &&
    !confirmPasswordError;

  const handleClose = () => {
    if (loading) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canSave) return;
    await onSubmit?.({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim()
    });
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
          <Typography className="settings-modal-title">
            Password
          </Typography>
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
          placeholder="Current password *"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          className="settings-modal-input"
          type="password"
          fullWidth
          placeholder="New password *"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          error={Boolean(newPassword && newPasswordError)}
          helperText={newPassword && newPasswordError ? newPasswordError : " "}
          sx={{ mb: 1 }}
        />

        <TextField
          className="settings-modal-input"
          type="password"
          fullWidth
          placeholder="Confirm new password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          error={Boolean(confirmPassword && confirmPasswordError)}
          helperText={confirmPassword && confirmPasswordError ? confirmPasswordError : " "}
          sx={{ mb: 1 }}
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
            disabled={!canSave}
            variant="contained"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
