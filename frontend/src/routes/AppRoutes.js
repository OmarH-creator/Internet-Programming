// frontend/src/routes/AppRoutes.js
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import PostDetailPage from "../pages/PostDetailPage";
import SettingsPage from "../pages/SettingsPage";
import CommunitiesPage from "../pages/CommunitiesPage";
import CommunityDetailPage from "../pages/CommunityDetailPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/communities" element={<CommunitiesPage />} />
      <Route path="/community/:communityId" element={<CommunityDetailPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;