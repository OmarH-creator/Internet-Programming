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

export default function UpdateEmailModal({
	open,
	onClose,
	currentEmail = "",
	onSubmit,
	loading = false,
	serverError = ""
}) {
	const [password, setPassword] = useState("");
	const [newEmail, setNewEmail] = useState("");

	const emailError = useMemo(() => {
		if (!newEmail.trim()) return "New email is required";
		const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());
		return isValid ? "" : "Please enter a valid email address";
	}, [newEmail]);

	const canSave =
		!loading &&
		password.trim().length > 0 &&
		newEmail.trim().length > 0 &&
		!emailError &&
		newEmail.trim().toLowerCase() !== currentEmail.trim().toLowerCase();

	const handleClose = () => {
		if (loading) return;
		setPassword("");
		setNewEmail("");
		onClose?.();
	};

	const handleSubmit = async () => {
		if (!canSave) return;
		await onSubmit?.({
			password: password.trim(),
			email: newEmail.trim().toLowerCase()
		});
	};

	return (
		<Dialog
			className="settings-modal"
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
		>
			<DialogContent className="settings-modal-content">
				<Box className="settings-modal-header">
					<Typography className="settings-modal-title">
						Email address
					</Typography>

					<IconButton
						className="settings-modal-close"
						onClick={handleClose}
						disabled={loading}
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<Typography className="settings-modal-subtitle">
					We'll send a verification email to the email address you provide to confirm that it's really you.
				</Typography>

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

				<TextField
					className="settings-modal-input"
					type="email"
					fullWidth
					placeholder="New email *"
					value={newEmail}
					onChange={(e) => setNewEmail(e.target.value)}
					disabled={loading}
					error={Boolean(newEmail && emailError)}
					helperText={newEmail && emailError ? emailError : " "}
					sx={{ mb: 1.5 }}
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