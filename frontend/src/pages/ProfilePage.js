import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";

import ProfileNavbar    from "../components/profile/ProfileNavbar";
import ProfileLeftPanel from "../components/profile/ProfileLeftPanel";
import ProfileHero      from "../components/profile/ProfileHero";
import ProfileFeed      from "../components/profile/ProfileFeed";
import ProfileSideCard  from "../components/profile/ProfileSideCard";

// ── Tab definitions ──────────────────────────────────────────────────────────
// public: true  → visible to everyone
// public: false → visible only to the profile owner
const ALL_TABS = [
  { key: "overview",  label: "Overview",  public: true  },
  { key: "posts",     label: "Posts",     public: true  },
  { key: "comments",  label: "Comments",  public: true  },
  { key: "saved",     label: "Saved",     public: false },
];

// ── ProfilePage ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const { username: routeUsername } = useParams();          // present on /profile/:username
  const [searchParams, setSearchParams] = useSearchParams();

  // Local image previews (blob URLs) — replace with real upload calls when ready
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  // ── Derived values ─────────────────────────────────────────────────────────
  const viewedUsername = routeUsername || authUser?.username || "anonymous";
  const isOwner        = isAuthenticated && authUser?.username === viewedUsername;
  const basePath       = routeUsername ? `/profile/${routeUsername}` : "/profile";

  const tabs = useMemo(
    () => ALL_TABS.filter((t) => t.public || isOwner),
    [isOwner]
  );

  const requestedTab = (searchParams.get("tab") || "overview").toLowerCase();
  const activeTab    = tabs.find((t) => t.key === requestedTab)?.key ?? tabs[0].key;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleTabChange = (key) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", key);
      next.set("page", "1");
      return next;
    });
  };

  const handleAvatarChange = (file) => {
    // TODO: upload file to your API, then update authUser.avatarUrl in context
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (file) => {
    // TODO: upload file to your API, then persist the banner URL
    setBannerPreview(URL.createObjectURL(file));
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
            alignItems: "start",
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

            <ProfileFeed activeTab={activeTab} />
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
