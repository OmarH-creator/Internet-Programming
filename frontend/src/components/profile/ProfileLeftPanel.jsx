import React from "react";
import { Box, Typography } from "@mui/material";

export default function ProfileLeftPanel() {
	return (
		<Box
			sx={{
				display: { xs: "none", lg: "flex" },
				flexDirection: "column",
				backgroundColor: "#111214",
				border: "1px dashed #3d3f42",
				borderRadius: 2,
				p: 2,
				minHeight: 500,
				gap: 1,
			}}
		>
			<Typography sx={{ fontSize: 11, color: "#818384", textTransform: "uppercase", letterSpacing: 0.8 }}>
				Left panel
			</Typography>
			<Typography sx={{ fontSize: 13, color: "#3d3f42" }}>
				Sidebar modules will be implemented here.
			</Typography>
		</Box>
	);
}
