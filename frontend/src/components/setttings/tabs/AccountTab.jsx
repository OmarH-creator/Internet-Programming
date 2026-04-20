import React from "react";
import { useAuth } from "../../../context/AuthContext";
import {
	SettingsSection,
	SettingsRowChevron,
	SettingsRowAction,
	SettingsRowToggle,
	SettingsRowExternal
} from "../SettingsShared";

export default function AccountTab() {
	const { user } = useAuth();

	return (
		<>
			<SettingsSection title="General">
				<SettingsRowChevron
					label="Email address"
					value={user?.email ?? ""}
					onClick={() => {}}
				/>
				<SettingsRowChevron label="Phone Number" onClick={() => {}} />
				<SettingsRowChevron label="Password" onClick={() => {}} />
				<SettingsRowChevron label="Gender" onClick={() => {}} />
				<SettingsRowChevron
					label="Location customization"
					value="No location specified"
					onClick={() => {}}
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Account authorization">
				<SettingsRowAction
					label="Google"
					sub="Connect to log in to Reddit with your Google account"
					actionLabel="Connect"
					onClick={() => {}}
				/>
				<SettingsRowAction
					label="Apple"
					sub="Connect to log in to Reddit with your Apple account"
					actionLabel="Connect"
					onClick={() => {}}
				/>
				<SettingsRowToggle
					label="Two-factor authentication"
					defaultChecked={false}
					onChange={() => {}}
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Apps">
				<SettingsRowChevron label="App settings" onClick={() => {}} />
				<SettingsRowExternal
					label="Learn about Developer Platform"
					href="https://developers.reddit.com"
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Reddit Premium">
				<SettingsRowChevron label="Get premium" onClick={() => {}} divider={false} />
			</SettingsSection>

			<SettingsSection title="Advanced">
				<SettingsRowChevron label="Delete account" onClick={() => {}} divider={false} />
			</SettingsSection>
		</>
	);
}
