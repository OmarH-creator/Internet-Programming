import api from "./api";

export const userService = {
  getMe: () => api.get("/users/me"),
  updateAccount: (payload) => api.patch("/users/me/account", payload),
  updateProfile: (payload) => api.patch("/users/me/profile", payload),
  changePassword: (payload) => api.patch("/users/me/password", payload),
  deleteAccount: (payload) => api.delete("/users/me", { data: payload })
};