import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  SettingsSection,
  SettingsRowChevron,
  SettingsRowToggle,
  SettingsRowExternal,
  SettingsRowSelect,
  SettingsCallout
} from "../SettingsShared";
import BioModal from "../modals/bioModal";
import AvatarModal from "../modals/avatarModal";
import BannerModal from "../modals/bannerModal";
import { userService } from "../../../services/userService";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);

  const handleSaveBio = async (bio) => {
    try {
      const response = await userService.updateProfile({ bio });
      updateUser(response.data.data.user);
      setBioModalOpen(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
      throw error;
    }
  };

  const handleSaveAvatar = async (file) => {
    try {
      const response = await userService.uploadAvatar(file);
      updateUser(response.data.data.user);
      setAvatarModalOpen(false);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      throw error;
    }
  };

  const handleSaveBanner = async (file) => {
    try {
      const response = await userService.uploadBanner(file);
      updateUser(response.data.data.user);
      setBannerModalOpen(false);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      throw error;
    }
  };

  return (
    <>
      <SettingsSection title="General">
        <SettingsRowChevron
          label="About description"
          sub={user?.bio || "Add a description to your profile"}
          onClick={() => setBioModalOpen(true)}
        />
        <SettingsRowChevron
          label="Avatar"
          sub="Edit your avatar or upload an image"
          onClick={() => setAvatarModalOpen(true)}
        />
        <SettingsRowChevron
          label="Banner"
          sub="Upload a profile background image"
          onClick={() => setBannerModalOpen(true)}
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

      {/* Modals */}
      <BioModal
        open={bioModalOpen}
        onClose={() => setBioModalOpen(false)}
        currentBio={user?.bio}
        onSave={handleSaveBio}
      />

      <AvatarModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={user?.avatar}
        onSave={handleSaveAvatar}
      />

      <BannerModal
        open={bannerModalOpen}
        onClose={() => setBannerModalOpen(false)}
        currentBanner={user?.banner}
        onSave={handleSaveBanner}
      />
    </>
  );
}
