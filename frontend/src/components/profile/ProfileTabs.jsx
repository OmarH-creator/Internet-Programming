import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Chip, Stack } from "@mui/material";

export default function ProfileTabs({ tabs = [], activeTab, basePath = "/profile", onChange }) {
	return (
		<Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", mb: 2.5 }}>
			{tabs.map((tab) => {
				const isActive = tab.key === activeTab;
				const href = `${basePath}?tab=${tab.key}`;

				return (
					<Chip
						key={tab.key}
						label={tab.label}
						component={RouterLink}
						to={href}
						clickable
						onClick={() => onChange?.(tab.key)}
						sx={{
							height: 40,
							px: 0.5,
							borderRadius: "999px",
							fontSize: 15,
							fontWeight: 700,
							backgroundColor: isActive ? "#525b61" : "transparent",
							color: "#e7eaee",
							border: "1px solid transparent",
							transition: "background-color 0.15s",
							"&:hover": {
								backgroundColor: isActive ? "#525b61" : "#1e2426",
							},
							"& .MuiChip-label": { px: 1.5 },
						}}
					/>
				);
			})}
		</Stack>
	);
}
