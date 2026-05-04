import api from './api';

// Convert image file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const postService = {
    getAllPosts: () => api.get('/posts'),
    getPostByID: (postId) => api.get(`/posts/${postId}`),
    createPost: async (postData) => {
        // Convert image to base64 if present
        if (postData.image) {
            postData.image = await fileToBase64(postData.image);
        }
        return api.post('/posts', postData);
    },
    deletePost: (postId) => api.delete(`/posts/${postId}`),
    
    // Vote functions
    upvote: (postId) => api.post(`/posts/${postId}/upvote`),
    downvote: (postId) => api.post(`/posts/${postId}/downvote`),
}