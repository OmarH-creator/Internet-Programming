import React, { useRef } from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ProfileTabs from "./ProfileTabs";

export default function ProfileHero({
	username = "",
	avatarUrl = "",
	isOwner = false,
	tabs = [],
	activeTab,
	basePath,
	onTabChange,
	onAvatarChange,
}) {
	const avatarInputRef = useRef(null);

	const handleAvatarPick = (event) => {
		const file = event.target.files?.[0];
		if (file) onAvatarChange?.(file);
	};

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, px: { xs: 0, md: 0.5 } }}>
				<Box sx={{ position: "relative", flexShrink: 0 }}>
					<Avatar
						src={avatarUrl}
						sx={{
							width: 78,
							height: 78,
							border: "3px solid #111214",
							boxShadow: "0 0 0 1px #2a2a2a",
							fontSize: 32,
							fontWeight: 700,
							backgroundColor: "#ff4500",
						}}
					>
						{username.charAt(0).toUpperCase()}
					</Avatar>

					{isOwner && (
						<IconButton
							onClick={() => avatarInputRef.current?.click()}
							size="small"
							aria-label="Change avatar"
							sx={{
								position: "absolute",
								right: -2,
								bottom: -2,
								backgroundColor: "rgba(0,0,0,0.75)",
								color: "#fff",
								"&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
							}}
						>
							<CameraAltOutlinedIcon sx={{ fontSize: 16 }} />
						</IconButton>
					)}

					<input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarPick} />
				</Box>

				<Box sx={{ minWidth: 0 }}>
					<Typography
						sx={{
							fontSize: { xs: 28, md: 40 },
							lineHeight: 1,
							fontWeight: 800,
							letterSpacing: -0.6,
							color: "#d7dadc",
						}}
					>
						{username}
					</Typography>
					<Typography sx={{ color: "#94a0a8", fontSize: { xs: 15, md: 18 }, fontWeight: 600, mt: 0.5 }}>
						u/{username}
					</Typography>
				</Box>
			</Box>

			<ProfileTabs tabs={tabs} activeTab={activeTab} basePath={basePath} onChange={onTabChange} />
		</Box>
	);
}
