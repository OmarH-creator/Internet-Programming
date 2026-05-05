import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "../../../styles/settingsModals.css";

export default function UpdatePhoneNumberModal({
  open,
  onClose,
  currentPhoneNumber = "",
  onContinue,
  loading = false,
  serverError = ""
}) {
  const initialPhoneNumber = useMemo(() => (currentPhoneNumber || "").trim(), [currentPhoneNumber]);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  useEffect(() => {
    setPhoneNumber(initialPhoneNumber);
  }, [initialPhoneNumber]);

  const phoneError = useMemo(() => {
    if (!phoneNumber.trim()) return "Phone number is required";
    if (phoneNumber.replace(/\D/g, "").length < 8) {
      return "Enter at least 8 digits";
    }
    return "";
  }, [phoneNumber]);

  const canContinue = !loading && !phoneError;

  const handleClose = () => {
    if (loading) return;
    setPhoneNumber(initialPhoneNumber);
    onClose?.();
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    const fullPhoneNumber = `+${phoneNumber.replace(/\D/g, "")}`;
    await onContinue?.(fullPhoneNumber);
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
          <Typography className="settings-modal-title">Phone Number</Typography>
          <IconButton
            className="settings-modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              "& .react-international-phone-input-container": {
                width: "100%"
              },
              "& .react-international-phone-country-selector-button": {
                height: 56,
                border: "none",
                borderRadius: "10px 0 0 10px",
                backgroundColor: "#26313a",
                color: "#d7dadc"
              },
              "& .react-international-phone-country-selector-dropdown": {
                backgroundColor: "#11181f",
                color: "#d7dadc",
                border: "1px solid #1f2a33"
              },
              "& .react-international-phone-country-selector-dropdown__list-item:hover": {
                backgroundColor: "#26313a"
              },
              "& .react-international-phone-input": {
                width: "100%",
                height: 56,
                border: "none",
                borderRadius: "0 10px 10px 0",
                backgroundColor: "#26313a",
                color: "#d7dadc",
                padding: "0 14px",
                fontSize: 16,
                outline: "none"
              },
              "& .react-international-phone-country-selector-button__button-content": {
                color: "#d7dadc"
              },
              "& .react-international-phone-country-selector-button__dial-code-preview": {
                color: "#d7dadc"
              },
              "& .react-international-phone-input::placeholder": {
                color: "#9fb0be",
                opacity: 1
              }
            }}
          >
            <PhoneInput
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value)}
              defaultCountry="us"
              inputProps={{
                placeholder: "Phone number *",
                disabled: loading
              }}
              disabled={loading}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: phoneError ? "#ff6b6b" : "transparent", ml: 0.5, mt: 0.5 }}>
            {phoneError || "_"}
          </Typography>
        </Box>

        <Typography className="settings-modal-note">
          Reddit will use your phone number for account verification and to personalize your ads and
          experience.
        </Typography>

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
            onClick={handleContinue}
            disabled={!canContinue}
            variant="contained"
          >
            Continue
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}