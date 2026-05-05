import api from './api';

export const commentService = {
    // Get all comments for a post
    getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
    
    // Create a comment (or reply)
    createComment: (postId, text, parentCommentId = null) => 
        api.post(`/comments/post/${postId}`, { text, parentCommentId }),
    
    // Delete a comment
    deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
    
    // Vote on comments
    upvoteComment: (commentId) => api.post(`/comments/${commentId}/upvote`),
    downvoteComment: (commentId) => api.post(`/comments/${commentId}/downvote`),
};
