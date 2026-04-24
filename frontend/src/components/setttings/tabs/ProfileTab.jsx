import React from "react";
import { Box, Typography } from "@mui/material";
import {
	SettingsSection,
	SettingsRowChevron,
	SettingsRowToggle,
	SettingsRowExternal,
	SettingsRowSelect,
	SettingsCallout
} from "../SettingsShared";

export default function ProfileTab() {
	return (
		<>
			<SettingsSection title="General">
				<SettingsRowChevron
					label="Display name"
					sub="Changing your display name won't change your username"
					onClick={() => {}}
				/>
				<SettingsRowChevron label="About description" onClick={() => {}} />
				<SettingsRowChevron
					label="Avatar"
					sub="Edit your avatar or upload an image"
					onClick={() => {}}
				/>
				<SettingsRowChevron
					label="Banner"
					sub="Upload a profile background image"
					onClick={() => {}}
				/>
				<SettingsRowChevron label="Social links" onClick={() => {}} />
				<SettingsRowToggle
					label="Mark as mature (18+)"
					sub="Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18"
					defaultChecked={false}
					onChange={() => {}}
					divider={false}
				/>
			</SettingsSection>

			<SettingsSection title="Curate your profile">
				<Typography sx={{ fontSize: 14, color: "#818384", mb: 2, lineHeight: 1.6 }}>
					Manage what content shows on your profile.
				</Typography>

				<SettingsRowSelect
					label="Content and activity"
					sub="Posts, comments, and communities you're active in"
					value="show_all"
					options={[
						{ value: "show_all", label: "Show all" },
						{ value: "hide_all", label: "Hide all" }
					]}
					onChange={() => {}}
				/>

				<SettingsRowToggle
					label="NSFW"
					sub="Show all NSFW posts and comments"
					defaultChecked={true}
					onChange={() => {}}
				/>

				<SettingsRowToggle
					label="Followers"
					sub="Show your follower count"
					defaultChecked={false}
					onChange={() => {}}
					divider={false}
				/>

				<SettingsCallout>
					<Box component="span" sx={{ color: "#0079d3", cursor: "pointer", mr: 0.5 }}>
						Profile curation
					</Box>
					only applies to your profile and your content stays visible in communities. Mods of
					communities you participate in and redditors whose profile posts you engage with can
					still see your full profile for moderation.
				</SettingsCallout>
			</SettingsSection>

			<SettingsSection title="Advanced">
				<SettingsRowExternal label="Profile moderation" href="#" divider={false} />
			</SettingsSection>
		</>
	);
}
