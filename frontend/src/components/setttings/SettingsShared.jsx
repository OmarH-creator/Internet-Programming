import React, { useState } from "react";
import { Box, Divider, Switch, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export function SettingsSection({ title, children, sx = {} }) {
	return (
		<Box sx={{ mb: 4, ...sx }}>
			<Typography sx={{ fontSize: 18, fontWeight: 700, color: "#d7dadc", mb: 2 }}>
				{title}
			</Typography>
			<Box>{children}</Box>
		</Box>
	);
}

export function SettingsRowChevron({ label, sub, value, onClick, divider = true }) {
	return (
		<>
			<Box
				onClick={onClick}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					py: 1.75,
					cursor: onClick ? "pointer" : "default",
					"&:hover": onClick ? { "& .settings-label": { color: "#fff" } } : {}
				}}
			>
				<Box>
					<Typography className="settings-label" sx={{ fontSize: 14, color: "#d7dadc", transition: "color .15s" }}>
						{label}
					</Typography>
					{sub && <Typography sx={{ fontSize: 12, color: "#818384", mt: 0.25 }}>{sub}</Typography>}
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
					{value && <Typography sx={{ fontSize: 14, color: "#818384" }}>{value}</Typography>}
					<ChevronRightIcon sx={{ color: "#818384", fontSize: 20 }} />
				</Box>
			</Box>
			{divider && <Divider sx={{ borderColor: "#1e1e1e" }} />}
		</>
	);
}

export function SettingsRowAction({ label, sub, actionLabel = "Connect", onClick, divider = true }) {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					py: 1.75
				}}
			>
				<Box>
					<Typography sx={{ fontSize: 14, color: "#d7dadc" }}>{label}</Typography>
					{sub && <Typography sx={{ fontSize: 12, color: "#818384", mt: 0.25 }}>{sub}</Typography>}
				</Box>
				<Box
					onClick={onClick}
					sx={{
						px: 2,
						py: 0.6,
						borderRadius: "999px",
						border: "1px solid #818384",
						fontSize: 13,
						fontWeight: 600,
						color: "#d7dadc",
						cursor: "pointer",
						flexShrink: 0,
						transition: "border-color .15s, background .15s",
						"&:hover": { borderColor: "#d7dadc", background: "rgba(255,255,255,0.04)" }
					}}
				>
					{actionLabel}
				</Box>
			</Box>
			{divider && <Divider sx={{ borderColor: "#1e1e1e" }} />}
		</>
	);
}

export function SettingsRowToggle({ label, sub, defaultChecked = false, onChange, divider = true }) {
	const [checked, setChecked] = useState(defaultChecked);

	const handle = (e) => {
		setChecked(e.target.checked);
		onChange?.(e.target.checked);
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					py: 1.5
				}}
			>
				<Box sx={{ pr: 4 }}>
					<Typography sx={{ fontSize: 14, color: "#d7dadc" }}>{label}</Typography>
					{sub && <Typography sx={{ fontSize: 12, color: "#818384", mt: 0.25, lineHeight: 1.5 }}>{sub}</Typography>}
				</Box>
				<Switch
					checked={checked}
					onChange={handle}
					sx={{
						flexShrink: 0,
						"& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
						"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0079d3" },
						"& .MuiSwitch-track": { backgroundColor: "#3c3c3e" }
					}}
				/>
			</Box>
			{divider && <Divider sx={{ borderColor: "#1e1e1e" }} />}
		</>
	);
}

export function SettingsRowExternal({ label, sub, href, divider = true }) {
	return (
		<>
			<Box
				component="a"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					py: 1.75,
					textDecoration: "none",
					cursor: "pointer",
					"&:hover .settings-label": { color: "#fff" }
				}}
			>
				<Box>
					<Typography className="settings-label" sx={{ fontSize: 14, color: "#d7dadc", transition: "color .15s" }}>
						{label}
					</Typography>
					{sub && <Typography sx={{ fontSize: 12, color: "#818384", mt: 0.25 }}>{sub}</Typography>}
				</Box>
				<OpenInNewIcon sx={{ color: "#818384", fontSize: 18, flexShrink: 0 }} />
			</Box>
			{divider && <Divider sx={{ borderColor: "#1e1e1e" }} />}
		</>
	);
}

export function SettingsRowSelect({ label, sub, value, options = [], onChange, divider = true }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Box sx={{ py: 1.75, position: "relative" }}>
				<Box
					onClick={() => setOpen((v) => !v)}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						cursor: "pointer",
						"&:hover .settings-label": { color: "#fff" }
					}}
				>
					<Box>
						<Typography className="settings-label" sx={{ fontSize: 14, color: "#d7dadc", transition: "color .15s" }}>
							{label}
						</Typography>
						{sub && <Typography sx={{ fontSize: 12, color: "#818384", mt: 0.25 }}>{sub}</Typography>}
					</Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						{value && <Typography sx={{ fontSize: 14, color: "#818384" }}>{value}</Typography>}
						<ChevronRightIcon sx={{ color: "#818384", fontSize: 20 }} />
					</Box>
				</Box>

				{open && options.length > 0 && (
					<Box
						sx={{
							position: "absolute",
							right: 0,
							top: "100%",
							zIndex: 10,
							background: "#1a1a1b",
							border: "1px solid #343536",
							borderRadius: 1,
							overflow: "hidden",
							minWidth: 160
						}}
					>
						{options.map((opt) => (
							<Box
								key={opt.value}
								onClick={() => {
									onChange?.(opt.value);
									setOpen(false);
								}}
								sx={{
									px: 2,
									py: 1.25,
									fontSize: 13,
									color: opt.value === value ? "#ff4500" : "#d7dadc",
									cursor: "pointer",
									"&:hover": { background: "#272729" }
								}}
							>
								{opt.label}
							</Box>
						))}
					</Box>
				)}
			</Box>
			{divider && <Divider sx={{ borderColor: "#1e1e1e" }} />}
		</>
	);
}

export function SettingsCallout({ children }) {
	return (
		<Box
			sx={{
				border: "1px solid #2a2a2a",
				borderRadius: 2,
				p: 2,
				mt: 1,
				mb: 2,
				fontSize: 13,
				color: "#818384",
				lineHeight: 1.6
			}}
		>
			{children}
		</Box>
	);
}
