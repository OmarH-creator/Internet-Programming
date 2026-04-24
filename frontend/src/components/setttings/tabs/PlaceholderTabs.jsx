import React from "react";
import { Box, Typography } from "@mui/material";

function PlaceholderTab({ title }) {
	return (
		<Box
			sx={{
				border: "1px dashed #3d3f42",
				borderRadius: 2,
				p: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 1,
				mt: 2
			}}
		>
			<Typography sx={{ fontSize: 16, fontWeight: 600, color: "#525b61" }}>
				{title}
			</Typography>
			<Typography sx={{ fontSize: 13, color: "#3d3f42" }}>
				This tab is not implemented yet.
			</Typography>
		</Box>
	);
}

export const PrivacyTab = () => <PlaceholderTab title="Privacy settings coming soon" />;
export const PreferencesTab = () => <PlaceholderTab title="Preferences settings coming soon" />;
export const NotificationsTab = () => <PlaceholderTab title="Notification settings coming soon" />;
export const EmailTab = () => <PlaceholderTab title="Email settings coming soon" />;
