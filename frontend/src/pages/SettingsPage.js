import React from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

import Navbar from "../components/layout/Navbar";
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
		<Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
			<Navbar searchScope="" />

			<Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
				<ProfileLeftPanel />

				<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
					<Container maxWidth="lg" sx={{ py: 4 }}>
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
					</Container>
				</Box>
			</Box>
		</Box>
	);
}
