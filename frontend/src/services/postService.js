import api from './api';

export const postService = {
    getAllPosts: () => api.get('/posts'),
    getPostByID: (postId) => api.get(`/posts/${postId}`),
    createPost: (postData) => api.post('/posts', postData),
    deletePost: (postId) => api.delete(`/posts/${postId}`),
}