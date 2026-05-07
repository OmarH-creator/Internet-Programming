import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

import Navbar from "../components/layout/Navbar";
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

  // State for viewed user data
  const [viewedUser, setViewedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Local image previews (blob URLs) while upload is in progress
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  // ── Derived values ─────────────────────────────────────────────────────────
  const viewedUsername = routeUsername || authUser?.username || "anonymous";
  const isOwner = isAuthenticated && authUser?.username === viewedUsername;
  const basePath = routeUsername ? `/profile/${routeUsername}` : "/profile";

  // Use viewedUser data if viewing someone else, otherwise use authUser
  const displayUser = routeUsername ? viewedUser : authUser;

  const tabs = useMemo(() => ALL_TABS.filter((t) => t.public || isOwner), [isOwner]);

  const requestedTab = (searchParams.get("tab") || "overview").toLowerCase();
  const activeTab = tabs.find((t) => t.key === requestedTab)?.key ?? tabs[0].key;

  // ── Fetch viewed user data ─────────────────────────────────────────────────
  useEffect(() => {
    // If viewing someone else's profile, fetch their data
    if (routeUsername && routeUsername !== authUser?.username) {
      setLoadingUser(true);
      userService.getUserByUsername(routeUsername)
        .then(response => {
          setViewedUser(response.data.data.user);
          setLoadingUser(false);
        })
        .catch(error => {
          console.error("Failed to load user:", error);
          setLoadingUser(false);
        });
    } else {
      // Viewing own profile, use authUser
      setViewedUser(authUser);
      setLoadingUser(false);
    }
  }, [routeUsername, authUser]);

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
  if (loadingUser) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading profile...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#030303", color: "#d7dadc", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar searchScope={viewedUsername} />

      <Box sx={{ display: "flex", flexGrow: 1, pt: "56px" }}>
        {/* Left sidebar (flush to the left) */}
        <ProfileLeftPanel />

        {/* Center content wrapper */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
                gap: 3,
                alignItems: "start"
              }}
            >
              {/* Center — hero + feed */}
              <Box>
                <ProfileHero
                  username={viewedUsername}
                  avatarUrl={isOwner && avatarPreview ? avatarPreview : (displayUser?.avatarUrl || displayUser?.avatar || "")}
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
                karma={displayUser?.karma ?? 0}
                postKarma={displayUser?.postKarma ?? 0}
                createdAt={displayUser?.createdAt}
                bannerUrl={isOwner && bannerPreview ? bannerPreview : (displayUser?.bannerUrl || displayUser?.banner || "")}
                isOwner={isOwner}
                onBannerChange={handleBannerChange}
                onSettingClick={handleSettingClick}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}