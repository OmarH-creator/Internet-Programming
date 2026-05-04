import api from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const extractPayload = (response) => response?.data?.data || response?.data || {};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    avatar: user.avatar || user.avatarUrl || "",
    phoneNumber: user.phoneNumber || "",
    gender: user.gender || "",
    banner: user.banner || user.bannerUrl || "",
    avatarUrl: user.avatarUrl || user.avatar || "",
    bannerUrl: user.bannerUrl || user.banner || "",
    bio: user.bio || "",
    karma: user.karma ?? 0,
    postKarma: user.postKarma ?? 0,
    commentKarma: user.commentKarma ?? 0,
    joinedCommunities: user.joinedCommunities || []
  };
};

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),

  register: (payload) => api.post("/auth/register", payload),

  getCurrentUser: () => api.get("/auth/me"),

  forgotPassword: ({ email }) => api.post("/auth/forgot-password", { email }),

  resetPassword: ({ token, password }) =>
    api.post("/auth/reset-password", { token, password }),

  getStoredToken: () => localStorage.getItem(TOKEN_KEY),

  getStoredUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return normalizeUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  persistSessionFromResponse: (response) => {
    const payload = extractPayload(response);
    const token = payload?.token;
    const user = normalizeUser(payload?.user);

    if (!token || !user) {
      throw new Error("Invalid authentication response format");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { token, user };
  },

  persistSession: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
