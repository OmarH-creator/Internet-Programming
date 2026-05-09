import api from './api';

export const communityService = {
    getAllCommunities: () => api.get('/communities'),
    getCommunityById: (communityId) => api.get(`/communities/${communityId}`),
    createCommunity: (communityData) => api.post('/communities', communityData),
    joinCommunity: (communityId) => api.post(`/communities/${communityId}/join`),
    leaveCommunity: (communityId) => api.post(`/communities/${communityId}/leave`),
    searchCommunities: (query) => api.get(`/communities/search?q=${query}`),
    uploadAvatar: (communityId, formData) => api.post(`/communities/${communityId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadBanner: (communityId, formData) => api.post(`/communities/${communityId}/banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    kickMember: (communityId, userId) => api.post(`/communities/${communityId}/kick/${userId}`),
    promoteToAdmin: (communityId, userId) => api.post(`/communities/${communityId}/promote/${userId}`),
};
