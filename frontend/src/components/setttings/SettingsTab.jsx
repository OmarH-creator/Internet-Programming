import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

const SETTINGS_TABS = [
	{ key: "account", label: "Account" },
	{ key: "profile", label: "Profile" },
	{ key: "privacy", label: "Privacy" },
	{ key: "preferences", label: "Preferences" },
	{ key: "notifications", label: "Notifications" },
	{ key: "email", label: "Email" }
];

export default function SettingsTab({ activeTab = "account", onChange }) {
	const currentIndex = SETTINGS_TABS.findIndex((t) => t.key === activeTab);
	const safeIndex = currentIndex === -1 ? 0 : currentIndex;

	return (
		<Box sx={{ borderBottom: "1px solid #2a2a2a", mb: 4 }}>
			<Tabs
				value={safeIndex}
				onChange={(_, idx) => onChange?.(SETTINGS_TABS[idx].key)}
				TabIndicatorProps={{
					style: { backgroundColor: "#d7dadc", height: 2 }
				}}
				sx={{
					minHeight: 44,
					"& .MuiTab-root": {
						color: "#818384",
						textTransform: "none",
						fontSize: 14,
						fontWeight: 500,
						minHeight: 44,
						padding: "0 4px",
						marginRight: "24px",
						"&:hover": { color: "#d7dadc" }
					},
					"& .Mui-selected": {
						color: "#d7dadc !important",
						fontWeight: 700
					}
				}}
			>
				{SETTINGS_TABS.map((tab) => (
					<Tab key={tab.key} label={tab.label} disableRipple />
				))}
			</Tabs>
		</Box>
	);
}
