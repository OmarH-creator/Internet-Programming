import React from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

import ProfileNavbar from "../components/profile/ProfileNavbar";
import ProfileLeftPanel from "../components/profile/ProfileLeftPanel";
import SettingsTab from "../components/setttings/SettingsTab";
import AccountTab from "../components/setttings/tabs/AccountTab";
import ProfileTab from "../components/setttings/tabs/ProfileTab";
import {
	PrivacyTab,
	PreferencesTab,
	NotificationsTab,
	EmailTab
} from "../components/setttings/tabs/PlaceholderTabs";

const TAB_CONTENT = {
	account: <AccountTab />,
	profile: <ProfileTab />,
	privacy: <PrivacyTab />,
	preferences: <PreferencesTab />,
	notifications: <NotificationsTab />,
	email: <EmailTab />
};

const VALID_TABS = Object.keys(TAB_CONTENT);

export default function SettingsPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	const requested = searchParams.get("tab") ?? "account";
	const activeTab = VALID_TABS.includes(requested) ? requested : "account";

	const handleTabChange = (key) => {
		setSearchParams({ tab: key });
	};

	return (
		<Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc" }}>
			<ProfileNavbar searchScope="" />

			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", lg: "260px minmax(0, 1fr)" },
						gap: 3,
						alignItems: "start"
					}}
				>
					<ProfileLeftPanel />

					<Box>
						<Typography
							sx={{
								fontSize: { xs: 28, md: 36 },
								fontWeight: 800,
								color: "#d7dadc",
								letterSpacing: -0.5,
								mb: 3
							}}
						>
							Settings
						</Typography>

						<SettingsTab activeTab={activeTab} onChange={handleTabChange} />

						<Box>{TAB_CONTENT[activeTab]}</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
