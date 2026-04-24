import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/settingsModals.css";

const GENDER_OPTIONS = ["Woman", "Man", "Non-binary", "I prefer not to say", "I refer to myself as..."];

const resolveInitialState = (currentGender) => {
  const normalized = (currentGender || "").trim();

  if (!normalized) {
    return { selected: "", customValue: "" };
  }

  if (GENDER_OPTIONS.slice(0, 4).includes(normalized)) {
    return { selected: normalized, customValue: "" };
  }

  return { selected: "I refer to myself as...", customValue: normalized };
};

export default function GenderModal({
  open,
  onClose,
  currentGender = "",
  onSubmit,
  loading = false,
  serverError = ""
}) {
  const [selected, setSelected] = useState("");
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    const initial = resolveInitialState(currentGender);
    setSelected(initial.selected);
    setCustomValue(initial.customValue);
  }, [currentGender, open]);

  const genderError = useMemo(() => {
    if (!selected) return "Please select a gender option";

    if (selected === "I refer to myself as...") {
      if (!customValue.trim()) return "Please enter your gender";
      if (customValue.trim().length > 50) return "Gender must be 50 characters or fewer";
    }

    return "";
  }, [selected, customValue]);

  const canSave = !loading && !genderError;

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canSave) return;
    const genderToSave =
      selected === "I refer to myself as..." ? customValue.trim() : selected;
    await onSubmit?.({ gender: genderToSave });
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
          <Typography className="settings-modal-title">Gender</Typography>
          <IconButton
            className="settings-modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography className="settings-modal-subtitle">
          This information may be used to improve your recommendations and ads.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
          {GENDER_OPTIONS.map((option) => {
            const isSelected = selected === option;
            return (
              <Button
                key={option}
                variant="text"
                onClick={() => setSelected(option)}
                disabled={loading}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  color: isSelected ? "#d7dadc" : "#b8c2cc",
                  fontWeight: isSelected ? 700 : 500,
                  px: 1,
                  py: 1,
                  backgroundColor: isSelected ? "rgba(47, 58, 67, 0.55)" : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected ? "rgba(47, 58, 67, 0.75)" : "rgba(47, 58, 67, 0.35)"
                  }
                }}
              >
                {option}
              </Button>
            );
          })}
        </Box>

        {selected === "I refer to myself as..." ? (
          <TextField
            className="settings-modal-input"
            fullWidth
            placeholder="I refer to myself as..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            disabled={loading}
            error={Boolean(customValue && genderError)}
            helperText={customValue && genderError ? genderError : " "}
            sx={{ mb: 1 }}
          />
        ) : null}

        {!selected || selected !== "I refer to myself as..." ? (
          genderError ? <Typography className="settings-modal-error">{genderError}</Typography> : null
        ) : null}

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
