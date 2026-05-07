import api from './api';

export const messageService = {
    // Send a message to a user
    sendMessage: (receiverUsername, content) => 
        api.post('/messages', { receiverUsername, content }),
    
    // Get conversation with a specific user
    getConversation: (username) => 
        api.get(`/messages/${username}`),
    
    // Get all conversations
    getConversations: () => 
        api.get('/messages/conversations'),
    
    // Get unread message count
    getUnreadCount: () => 
        api.get('/messages/unread'),
};
