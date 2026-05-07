import { useState, useEffect, useRef } from "react";
import { messageService } from "../../services/messageService";
import { useAuth } from "../../context/AuthContext";

function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list"); // "list" or "chat"
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations when opened
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversations();
      loadUnreadCount();
    }
  }, [isOpen, isAuthenticated]);

  // Poll for new messages every 5 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    const interval = setInterval(() => {
      if (currentChat) {
        loadMessages(currentChat);
      }
      loadUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, currentChat, isAuthenticated]);

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data.data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadMessages = async (username) => {
    try {
      const response = await messageService.getConversation(username);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await messageService.getUnreadCount();
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const username = currentChat || searchUsername;
      await messageService.sendMessage(username, newMessage);
      setNewMessage("");
      setSearchUsername("");
      await loadMessages(username);
      await loadConversations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  const openChat = (username) => {
    setCurrentChat(username);
    setView("chat");
    loadMessages(username);
  };

  const backToList = () => {
    setView("list");
    setCurrentChat(null);
    setMessages([]);
    loadConversations();
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          backgroundColor: "#ff4500",
          color: "white",
          padding: "12px 20px",
          borderRadius: "24px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        💬 Chat
        {unreadCount > 0 && (
          <span
            style={{
              backgroundColor: "white",
              color: "#ff4500",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "#1a1a1b",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#ff4500",
              color: "white",
              padding: "16px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {view === "chat" && (
                <button
                  onClick={backToList}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  ←
                </button>
              )}
              <span>{view === "chat" ? `Chat with ${currentChat}` : "Messages"}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                padding: "0",
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {view === "list" ? (
            <div style={{ flex: 1, overflow: "auto" }}>
              {/* New Chat Form */}
              <div style={{ padding: "16px", borderBottom: "1px solid #343536" }}>
                <form onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type username to chat..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#272729",
                      border: "1px solid #343536",
                      borderRadius: "8px",
                      color: "#d7dadc",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  />
                  <textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows="2"
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#272729",
                      border: "1px solid #343536",
                      borderRadius: "8px",
                      color: "#d7dadc",
                      fontSize: "14px",
                      resize: "none",
                      marginBottom: "8px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!searchUsername.trim() || !newMessage.trim()}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#ff4500",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      opacity: !searchUsername.trim() || !newMessage.trim() ? 0.5 : 1,
                    }}
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Conversations List */}
              <div>
                {conversations.length === 0 ? (
                  <p style={{ padding: "20px", color: "#818384", textAlign: "center" }}>
                    No conversations yet
                  </p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.user._id}
                      onClick={() => openChat(conv.user.username)}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #343536",
                        cursor: "pointer",
                        backgroundColor: conv.unread ? "#272729" : "transparent",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#272729")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = conv.unread ? "#272729" : "transparent")
                      }
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#ff4500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          {conv.user.username[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#d7dadc", fontWeight: "600", marginBottom: "4px" }}>
                            {conv.user.username}
                          </div>
                          <div
                            style={{
                              color: "#818384",
                              fontSize: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conv.lastMessage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflow: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {messages.map((msg) => {
                  const isMine = msg.sender._id === user.id;
                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "10px 14px",
                          borderRadius: "16px",
                          backgroundColor: isMine ? "#ff4500" : "#272729",
                          color: "white",
                          fontSize: "14px",
                          wordWrap: "break-word",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Message Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "16px",
                  borderTop: "1px solid #343536",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#272729",
                    border: "1px solid #343536",
                    borderRadius: "20px",
                    color: "#d7dadc",
                    fontSize: "14px",
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ff4500",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "600",
                    opacity: !newMessage.trim() ? 0.5 : 1,
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ChatWidget;
