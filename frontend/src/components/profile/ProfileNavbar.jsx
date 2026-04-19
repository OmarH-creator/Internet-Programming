import React, { useState } from "react";
import { AppBar, Box, Button, InputAdornment, TextField, Toolbar, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AuthModal from "../auth/AuthModal";
import UserMenu from "../user/UserMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileNavbar({ searchScope = "" }) {
	const navigate = useNavigate();
	const { user, isAuthenticated, logout } = useAuth();

	const [authOpen, setAuthOpen] = useState(false);
	const [defaultTab, setDefaultTab] = useState("login");

	const handleNavigate = (action) => {
		if (action === "profile") navigate("/profile");
	};

	return (
		<>
			<AppBar
				position="sticky"
				elevation={0}
				sx={{ backgroundColor: "#0e1113", borderBottom: "1px solid #2a3236", zIndex: 100 }}
			>
				<Toolbar sx={{ minHeight: "56px", justifyContent: "space-between", gap: 2 }}>
					<Typography
						variant="h6"
						sx={{ fontWeight: 700, minWidth: 88, cursor: "pointer", color: "#d7dadc" }}
						onClick={() => navigate("/")}
					>
						reddit
					</Typography>

					<TextField
						size="small"
						placeholder={searchScope ? `Search in u/${searchScope}` : "Search Reddit"}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchOutlinedIcon sx={{ color: "#818384" }} fontSize="small" />
								</InputAdornment>
							),
						}}
						sx={{
							width: { xs: "100%", sm: 380, md: 560 },
							"& .MuiOutlinedInput-root": {
								borderRadius: "999px",
								backgroundColor: "#111214",
								color: "#d7dadc",
								"& fieldset": { borderColor: "#3c3c3e" },
								"&:hover fieldset": { borderColor: "#818384" },
								"&.Mui-focused fieldset": { borderColor: "#ff4500" },
							},
							"& input::placeholder": { color: "#818384" },
						}}
					/>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
						{isAuthenticated && user ? (
							<UserMenu user={user} onLogout={logout} onNavigate={handleNavigate} />
						) : (
							<>
								<Button
									variant="contained"
									onClick={() => {
										setDefaultTab("login");
										setAuthOpen(true);
									}}
									sx={{
										backgroundColor: "#ff4500",
										borderRadius: "999px",
										textTransform: "none",
										fontWeight: 600,
										"&:hover": { backgroundColor: "#e03d00" },
									}}
								>
									Log In
								</Button>
								<Button
									variant="outlined"
									onClick={() => {
										setDefaultTab("register");
										setAuthOpen(true);
									}}
									sx={{
										color: "#d7dadc",
										borderColor: "#818384",
										borderRadius: "999px",
										textTransform: "none",
										fontWeight: 600,
										"&:hover": { borderColor: "#d7dadc" },
									}}
								>
									Sign Up
								</Button>
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>

			{authOpen && (
				<AuthModal
					defaultTab={defaultTab}
					onClose={() => setAuthOpen(false)}
					onSuccess={() => setAuthOpen(false)}
				/>
			)}
		</>
	);
}
