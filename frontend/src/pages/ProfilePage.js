import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

import ProfileNavbar from "../components/profile/ProfileNavbar";
import ProfileLeftPanel from "../components/profile/ProfileLeftPanel";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileFeed from "../components/profile/ProfileFeed";
import ProfileSideCard from "../components/profile/ProfileSideCard";

// ── Tab definitions ──────────────────────────────────────────────────────────
// public: true  → visible to everyone
// public: false → visible only to the profile owner
const ALL_TABS = [
  { key: "overview", label: "Overview", public: true },
  { key: "posts", label: "Posts", public: true },
  { key: "comments", label: "Comments", public: true },
  { key: "saved", label: "Saved", public: false }
];

// ── ProfilePage ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, updateUser } = useAuth();
  const { username: routeUsername } = useParams(); // present on /profile/:username
  const [searchParams, setSearchParams] = useSearchParams();

  // Local image previews (blob URLs) while upload is in progress
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  // ── Derived values ─────────────────────────────────────────────────────────
  const viewedUsername = routeUsername || authUser?.username || "anonymous";
  const isOwner = isAuthenticated && authUser?.username === viewedUsername;
  const basePath = routeUsername ? `/profile/${routeUsername}` : "/profile";

  const tabs = useMemo(() => ALL_TABS.filter((t) => t.public || isOwner), [isOwner]);

  const requestedTab = (searchParams.get("tab") || "overview").toLowerCase();
  const activeTab = tabs.find((t) => t.key === requestedTab)?.key ?? tabs[0].key;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleTabChange = (key) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", key);
      next.set("page", "1");
      return next;
    });
  };

  const handleAvatarChange = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const response = await userService.uploadAvatar(file);
      const updatedUser = response?.data?.data?.user || response?.data?.user || null;

      if (updatedUser) {
        updateUser(updatedUser);
      }

      // Switch rendering to persisted URL from auth context
      setAvatarPreview("");
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleBannerChange = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);

    try {
      const response = await userService.uploadBanner(file);
      const updatedUser = response?.data?.data?.user || response?.data?.user || null;

      if (updatedUser) {
        updateUser(updatedUser);
      }

      // Switch rendering to persisted URL from auth context
      setBannerPreview("");
    } catch (error) {
      console.error("Banner upload failed:", error);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSettingClick = (key) => {
    // "profile" and "curate" both map to Settings > Profile tab.
    if (key === "profile" || key === "curate") {
      navigate("/settings?tab=profile");
      return;
    }

    // "avatar" and "modtools" are placeholders until those flows are implemented.
    console.log("Settings action (not implemented):", key);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc" }}>
      {/* Navbar */}
      <ProfileNavbar searchScope={viewedUsername} />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px minmax(0, 1fr) 340px" },
            gap: 3,
            alignItems: "start"
          }}
        >
          {/* Left sidebar (placeholder) */}
          <ProfileLeftPanel />

          {/* Center — hero + feed */}
          <Box>
            <ProfileHero
              username={viewedUsername}
              avatarUrl={avatarPreview || authUser?.avatarUrl || authUser?.avatar || ""}
              isOwner={isOwner}
              tabs={tabs}
              activeTab={activeTab}
              basePath={basePath}
              onTabChange={handleTabChange}
              onAvatarChange={handleAvatarChange}
            />

            <ProfileFeed activeTab={activeTab} username={viewedUsername} />
          </Box>

          {/* Right sidebar */}
          <ProfileSideCard
            username={viewedUsername}
            karma={authUser?.karma ?? 0}
            postKarma={authUser?.postKarma ?? 0}
            createdAt={authUser?.createdAt}
            bannerUrl={bannerPreview || authUser?.bannerUrl || authUser?.banner || ""}
            isOwner={isOwner}
            onBannerChange={handleBannerChange}
            onSettingClick={handleSettingClick}
          />
        </Box>
      </Container>
    </Box>
  );
}