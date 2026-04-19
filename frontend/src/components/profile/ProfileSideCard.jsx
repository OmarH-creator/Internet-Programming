import React, { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

function getRedditAge(createdAt) {
	if (!createdAt) return "N/A";

	const created = new Date(createdAt);
	const now = new Date();
	const years = now.getFullYear() - created.getFullYear();
	const hadAnniversary =
		now.getMonth() > created.getMonth() ||
		(now.getMonth() === created.getMonth() && now.getDate() >= created.getDate());
	const fullYears = hadAnniversary ? years : years - 1;

	if (fullYears > 0) return `${fullYears}y`;

	const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
	if (months > 0) return `${months}mo`;

	return "new";
}

const SETTINGS_ITEMS = [
	{ key: "profile", label: "Profile", sub: "Customize your profile" },
	{ key: "curate", label: "Curate profile", sub: "Manage what people see" },
	{ key: "avatar", label: "Avatar", sub: "Style your avatar" },
	{ key: "modtools", label: "Mod tools", sub: null },
];

export default function ProfileSideCard({
	username = "",
	karma = 0,
	postKarma = 0,
	createdAt,
	bannerUrl = "",
	isOwner = false,
	onBannerChange,
	onSettingClick,
}) {
	const bannerInputRef = useRef(null);

	const handleBannerPick = (event) => {
		const file = event.target.files?.[0];
		if (file) onBannerChange?.(file);
	};

	const isBlobOrHttp = bannerUrl && (bannerUrl.startsWith("blob:") || bannerUrl.startsWith("http"));
	const bannerSx = isBlobOrHttp
		? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
		: { background: bannerUrl || "linear-gradient(120deg, rgba(255,69,0,0.6) 0%, rgba(89,58,180,0.8) 100%)" };

	return (
		<Box
			sx={{
				backgroundColor: "#111214",
				borderRadius: 4,
				border: "1px solid #262729",
				overflow: "hidden",
			}}
		>
			<Box sx={{ height: 110, position: "relative", ...bannerSx }}>
				{isOwner && (
					<IconButton
						onClick={() => bannerInputRef.current?.click()}
						size="small"
						aria-label="Change banner"
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							backgroundColor: "rgba(0,0,0,0.65)",
							color: "#fff",
							"&:hover": { backgroundColor: "rgba(0,0,0,0.85)" },
						}}
					>
						<CameraAltOutlinedIcon fontSize="small" />
					</IconButton>
				)}
			</Box>

			<input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={handleBannerPick} />

			<Box sx={{ p: 2.5 }}>
				<Typography sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1, mb: 0.25, color: "#d7dadc" }}>
					{username}
				</Typography>
				<Typography sx={{ color: "#a4a9ad", mb: 2.5, fontSize: 14 }}>u/{username}</Typography>

				<Stack direction="row" spacing={3} sx={{ mb: 2 }}>
					<StatBlock label="Karma" value={karma.toLocaleString()} />
					<StatBlock label="Contributions" value={postKarma.toLocaleString()} />
				</Stack>

				<Stack direction="row" spacing={3} sx={{ mb: 2.5 }}>
					<StatBlock label="Reddit Age" value={getRedditAge(createdAt)} />
				</Stack>

				<Divider sx={{ borderColor: "#2a2a2a", mb: 2.5 }} />

				<Typography
					sx={{ fontSize: 11, fontWeight: 700, color: "#818384", textTransform: "uppercase", letterSpacing: 0.8, mb: 1.5 }}
				>
					Settings
				</Typography>

				<Stack spacing={1.5}>
					{SETTINGS_ITEMS.map(({ key, label, sub }) => (
						<Box key={key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
							<Box sx={{ minWidth: 0 }}>
								<Typography sx={{ fontSize: 14, color: "#d7dadc", fontWeight: 500 }}>{label}</Typography>
								{sub && <Typography sx={{ fontSize: 11, color: "#818384" }}>{sub}</Typography>}
							</Box>
							<Button
								size="small"
								variant="outlined"
								onClick={() => onSettingClick?.(key)}
								sx={{
									borderRadius: "999px",
									textTransform: "none",
									fontSize: 12,
									fontWeight: 600,
									flexShrink: 0,
									borderColor: "#818384",
									color: "#d7dadc",
									"&:hover": { borderColor: "#d7dadc", backgroundColor: "rgba(215,218,220,0.05)" },
								}}
							>
								Update
							</Button>
						</Box>
					))}
				</Stack>

				<Divider sx={{ borderColor: "#2a2a2a", my: 2.5 }} />

				<Link component={RouterLink} to="/" underline="hover" sx={{ color: "#818384", fontSize: 13 }}>
					- Back to home
				</Link>
			</Box>
		</Box>
	);
}

function StatBlock({ label, value }) {
	return (
		<Box>
			<Typography sx={{ fontWeight: 700, fontSize: 16, color: "#d7dadc" }}>{value}</Typography>
			<Typography sx={{ fontSize: 12, color: "#818384" }}>{label}</Typography>
		</Box>
	);
}
