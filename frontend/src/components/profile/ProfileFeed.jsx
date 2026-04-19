import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const PLACEHOLDER_TEXT = {
	overview: "Mixed activity feed (posts + comments). Wire to your /user/activity endpoint.",
	posts: "Posts feed. Wire to your paginated /user/posts endpoint.",
	comments: "Comments feed. Wire to your paginated /user/comments endpoint.",
	saved: "Saved items (owner-only). Wire to your protected /user/saved endpoint.",
};

export default function ProfileFeed({ activeTab = "overview" }) {
	const label = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
	const hint = PLACEHOLDER_TEXT[activeTab] ?? "Content coming soon.";

	return (
		<Box
			sx={{
				backgroundColor: "#111214",
				borderRadius: 2,
				border: "1px solid #262729",
				p: 2.5,
			}}
		>
			<Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: "#d7dadc" }}>{label}</Typography>
			<Typography sx={{ color: "#818384", fontSize: 14, mb: 2 }}>{hint}</Typography>
			<Divider sx={{ borderColor: "#2a2a2a", my: 2 }} />
			<Typography sx={{ color: "#818384", fontSize: 13 }}>
				No content yet - this panel is scaffolded for API integration.
			</Typography>
		</Box>
	);
}
