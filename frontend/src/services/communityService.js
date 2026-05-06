import api from './api';

export const communityService = {
    getAllCommunities: () => api.get('/communities'),
    getCommunityById: (communityId) => api.get(`/communities/${communityId}`),
    createCommunity: (communityData) => api.post('/communities', communityData),
    joinCommunity: (communityId) => api.post(`/communities/${communityId}/join`),
    leaveCommunity: (communityId) => api.post(`/communities/${communityId}/leave`),
};
