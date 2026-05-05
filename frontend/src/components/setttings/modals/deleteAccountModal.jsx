import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/settingsModals.css";

export default function DeleteAccountModal({
  open,
  onClose,
  currentUsername = "",
  onSubmit,
  loading = false,
  serverError = ""
}) {
  const [reason, setReason] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const usernameMatches = useMemo(() => {
    if (!username.trim()) return false;
    return username.trim().toLowerCase() === (currentUsername || "").trim().toLowerCase();
  }, [username, currentUsername]);

  const canDelete =
    !loading &&
    usernameMatches &&
    password.trim().length > 0 &&
    confirmed;

  const handleClose = () => {
    if (loading) return;
    setReason("");
    setUsername("");
    setPassword("");
    setConfirmed(false);
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canDelete) return;
    await onSubmit?.({
      password: password.trim(),
      reason: reason.trim(),
      username: username.trim()
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
          <Typography className="settings-modal-title">Delete account</Typography>
          <IconButton
            className="settings-modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#d7dadc", mb: 1 }}>
          We&apos;re sorry to see you go.
        </Typography>

        <Typography className="settings-modal-subtitle" sx={{ mb: 2 }}>
          Once you delete your account, your profile and username are permanently removed from Reddit
          and your posts, comments, and messages are disassociated (not deleted) from your account
          unless you delete them beforehand.
        </Typography>

        <TextField
          className="settings-modal-input"
          fullWidth
          multiline
          minRows={3}
          placeholder="Reason for leaving (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          className="settings-modal-input"
          fullWidth
          placeholder="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          error={Boolean(username && !usernameMatches)}
          helperText={username && !usernameMatches ? "Username does not match your current account" : " "}
          sx={{ mb: 2 }}
        />

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

        <Box sx={{ borderTop: "1px solid #3b434b", pt: 2, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={loading}
              sx={{
                mt: -0.35,
                p: 0,
                color: "#9fb0be",
                "&.Mui-checked": { color: "#d7dadc" }
              }}
            />
            <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: "#d7dadc", flex: 1 }}>
              I understand that deleted accounts aren&apos;t recoverable
            </Typography>
          </Box>
        </Box>

        {serverError ? (
          <Typography className="settings-modal-error" sx={{ mt: 1.5 }}>
            {serverError}
          </Typography>
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
            className="settings-modal-btn settings-modal-btn-danger"
            onClick={handleSubmit}
            disabled={!canDelete}
            variant="contained"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
