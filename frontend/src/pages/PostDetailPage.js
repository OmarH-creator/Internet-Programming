import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import { useAuth } from "../context/AuthContext";

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we're replying to
  const [replyText, setReplyText] = useState(""); // Text for reply
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open (for post and comments)

  // Load the post and comments
  useEffect(() => {
    // Load post
    postService.getPostByID(postId)
      .then(response => {
        setPost(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    
    // Load comments
    commentService.getCommentsByPost(postId)
      .then(response => {
        setComments(response.data.data);
      })
      .catch(() => {
        // Ignore error
      });
  }, [postId]);

  // Vote handlers
  const handleUpvote = () => {
    postService.upvote(postId)
      .then(response => {
        setPost(response.data.data);
      })
      .catch(() => {
        alert("Failed to upvote. Please log in.");
      });
  };

  const handleDownvote = () => {
    postService.downvote(postId)
      .then(response => {
        setPost(response.data.data);
      })
      .catch(() => {
        alert("Failed to downvote. Please log in.");
      });
  };

  const getVoteScore = () => {
    if (!post) return 0;
    const upvoteCount = post.upvotes?.length || 0;
    const downvoteCount = post.downvotes?.length || 0;
    return upvoteCount - downvoteCount;
  };

  const didUserUpvote = () => {
    if (!user || !post) return false;
    return post.upvotes?.some(id => id === user.id);
  };

  const didUserDownvote = () => {
    if (!user || !post) return false;
    return post.downvotes?.some(id => id === user.id);
  };

  const getVoteBackgroundColor = () => {
    if (didUserUpvote()) return "#ff4500";
    if (didUserDownvote()) return "#7193ff";
    return "#1a1a1b";
  };

  // Submit a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await commentService.createComment(postId, commentText);
      setComments([response.data.data, ...comments]); // Add to top
      setCommentText(""); // Clear input
    } catch (error) {
      alert("Failed to post comment. Please log in.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit a reply
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyText.trim()) return;
    
    try {
      await commentService.createComment(postId, replyText, parentCommentId);
      
      // Reload all comments to show the new reply
      const response = await commentService.getCommentsByPost(postId);
      setComments(response.data.data);
      
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      alert("Failed to post reply. Please log in.");
    }
  };

  // Get all replies for a comment (including nested)
  const getReplies = (parentId) => {
    return comments.filter(c => c.parentComment === parentId);
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      setOpenMenuId(null);
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  // Delete the post
  const handleDeletePost = async () => {
    try {
      await postService.deletePost(postId);
      setOpenMenuId(null);
      navigate("/"); // Go back to home after deleting
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  // Vote on comment
  const handleCommentUpvote = async (commentId) => {
    try {
      const response = await commentService.upvoteComment(commentId);
      setComments(comments.map(c => c._id === commentId ? response.data.data : c));
    } catch (error) {
      alert("Failed to upvote. Please log in.");
    }
  };

  const handleCommentDownvote = async (commentId) => {
    try {
      const response = await commentService.downvoteComment(commentId);
      setComments(comments.map(c => c._id === commentId ? response.data.data : c));
    } catch (error) {
      alert("Failed to downvote. Please log in.");
    }
  };

  // Get comment vote score
  const getCommentVoteScore = (comment) => {
    const upvotes = comment.upvotes?.length || 0;
    const downvotes = comment.downvotes?.length || 0;
    return upvotes - downvotes;
  };

  const didUserUpvoteComment = (comment) => {
    if (!user) return false;
    return comment.upvotes?.some(id => id === user.id);
  };

  const didUserDownvoteComment = (comment) => {
    if (!user) return false;
    return comment.downvotes?.some(id => id === user.id);
  };

  const getCommentVoteBackgroundColor = (comment) => {
    if (didUserUpvoteComment(comment)) return "#ff4500";
    if (didUserDownvoteComment(comment)) return "#7193ff";
    return "#1a1a1b";
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#0E1113", color: "#d7dadc", p: 4 }}>
        <p>Loading post...</p>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#0E1113", color: "#d7dadc", p: 4 }}>
        <p>Post not found</p>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0E1113", color: "#d7dadc" }}>
      {/* Header with back button */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#0e1113",
          borderBottom: "1px solid #2a3236",
        }}
      >
        <Toolbar sx={{ minHeight: "56px" }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{ color: "#d7dadc", mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "20px", flexGrow: 1 }}>
            {post.community ? `r/${post.community.name}` : 'r/test'}
          </Typography>
          <Button 
            sx={{ color: '#d7dadc', textTransform: 'none' }}
            onClick={() => navigate("/communities")}
          >
            Communities
          </Button>
        </Toolbar>
      </AppBar>

      {/* Post content */}
      <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
        {/* Author and date */}
        <p style={{ color: "#818384", fontSize: "12px", margin: "0 0 12px 0" }}>
          <strong style={{ color: "#d7dadc" }}>u/{post.author?.username}</strong>
          &nbsp;·&nbsp;
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {/* Title */}
        <h1 style={{ 
          color: "#d7dadc", 
          fontSize: "28px", 
          fontWeight: "600", 
          margin: "0 0 16px 0",
          lineHeight: "1.3"
        }}>
          {post.title}
        </h1>

        {/* Image */}
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
            style={{ 
              width: "100%", 
              height: "auto",
              display: "block",
              borderRadius: "12px",
              marginBottom: "20px"
            }}
          />
        )}

        {/* Body text - shown after image if image exists */}
        {post.body && (
          <p style={{ 
            color: "#d7dadc", 
            fontSize: "16px", 
            margin: "0 0 16px 0",
            textAlign: "justify",
            lineHeight: "1.6"
          }}>
            {post.body}
          </p>
        )}

        {/* Vote buttons */}
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px"
        }}>
          {/* Vote buttons */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center",
            gap: "4px",
            backgroundColor: getVoteBackgroundColor(),
            borderRadius: "20px",
            padding: "4px 10px",
            transition: "background-color 0.2s ease"
          }}>
            <button
              onClick={handleUpvote}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#ffffff",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                lineHeight: 1
              }}
            >
              ▲
            </button>

            <span style={{ 
              color: "#ffffff", 
              fontSize: "12px", 
              fontWeight: "600",
              minWidth: "16px",
              textAlign: "center"
            }}>
              {getVoteScore()}
            </span>

            <button
              onClick={handleDownvote}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#ffffff",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                lineHeight: 1
              }}
            >
              ▼
            </button>
          </div>

          {/* Comment count */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#1a1a1b",
            borderRadius: "20px",
            padding: "4px 10px"
          }}>
            <span style={{ fontSize: "16px" }}>💬</span>
            <span style={{ 
              color: "#d7dadc", 
              fontSize: "12px", 
              fontWeight: "600"
            }}>
              {comments.length}
            </span>
          </div>

          {/* Three-dot menu for post author */}
          {user && user.id === post.author?._id && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setOpenMenuId(openMenuId === 'post' ? null : 'post')}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#818384",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                ⋯
              </button>

              {/* Dropdown menu */}
              {openMenuId === 'post' && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    backgroundColor: "#1a1a1b",
                    border: "1px solid #343536",
                    borderRadius: "8px",
                    minWidth: "150px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                    marginTop: "4px"
                  }}
                >
                  <button
                    onClick={handleDeletePost}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ff585b",
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "12px 16px",
                      textAlign: "center",
                      display: "block"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272729"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments section */}
        <Box sx={{ 
          borderTop: "1px solid #343536",
          pt: 3
        }}>
          {/* Comment input - only show if logged in */}
          {user && (
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: "24px" }}>
              <textarea
                placeholder="Join the conversation"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  backgroundColor: "#272729",
                  border: "1px solid #343536",
                  borderRadius: "12px",
                  color: "#d7dadc",
                  padding: "12px",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                style={{
                  backgroundColor: "#ff4500",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 20px",
                  fontWeight: "700",
                  cursor: submitting ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  opacity: submitting || !commentText.trim() ? 0.5 : 1
                }}
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </form>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ fontSize: "48px", mb: 2 }}>🤖</Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 1 }}>
                Be the first to comment
              </Typography>
              <Typography sx={{ color: "#818384", fontSize: "14px" }}>
                Nobody's responded to this post yet. Add your thoughts and get the conversation going.
              </Typography>
            </Box>
          ) : (
            <div>
              {comments.filter(c => !c.parentComment).map((comment) => (
                <div key={comment._id} style={{ borderBottom: "1px solid #343536", paddingBottom: "8px", marginBottom: "8px" }}>
                  <CommentThread 
                    comment={comment}
                    allComments={comments}
                    post={post}
                    user={user}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyingTo={setReplyingTo}
                    setReplyText={setReplyText}
                    handleCommentUpvote={handleCommentUpvote}
                    handleCommentDownvote={handleCommentDownvote}
                    handleDeleteComment={handleDeleteComment}
                    handleReplySubmit={handleReplySubmit}
                    getCommentVoteScore={getCommentVoteScore}
                    getCommentVoteBackgroundColor={getCommentVoteBackgroundColor}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    depth={0}
                  />
                </div>
              ))}
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// Recursive comment component
function CommentThread({ 
  comment, 
  allComments, 
  post, 
  user, 
  replyingTo, 
  replyText, 
  setReplyingTo, 
  setReplyText,
  handleCommentUpvote,
  handleCommentDownvote,
  handleDeleteComment,
  handleReplySubmit,
  getCommentVoteScore,
  getCommentVoteBackgroundColor,
  openMenuId,
  setOpenMenuId,
  depth 
}) {
  const replies = allComments.filter(c => c.parentComment === comment._id);
  const isNested = depth > 0;
  const marginLeft = depth * 32; // Increase margin for each level

  return (
    <div style={{ marginLeft: isNested ? `${marginLeft}px` : "0" }}>
      <div
        style={{
          paddingBottom: isNested ? "12px" : "16px",
          marginBottom: isNested ? "12px" : "16px",
          borderLeft: isNested ? "2px solid #343536" : "none",
          paddingLeft: isNested ? "16px" : "0"
        }}
      >
        {/* Comment author and date */}
        <p style={{ color: "#818384", fontSize: isNested ? "11px" : "12px", margin: "0 0 8px 0" }}>
          <strong style={{ color: "#d7dadc" }}>u/{comment.author?.username}</strong>
          {post && post.author?._id === comment.author?._id && (
            <span style={{
              marginLeft: "6px",
              color: "#0079d3",
              fontSize: isNested ? "11px" : "12px",
              fontWeight: "700"
            }}>
              OP
            </span>
          )}
          &nbsp;·&nbsp;
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>

        {/* Comment text */}
        <p style={{ 
          color: "#d7dadc", 
          fontSize: isNested ? "13px" : "14px", 
          margin: "0 0 12px 0",
          lineHeight: "1.5"
        }}>
          {comment.text}
        </p>

        {/* Comment actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Vote buttons */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center",
            gap: "4px",
            backgroundColor: getCommentVoteBackgroundColor(comment),
            borderRadius: "20px",
            padding: "2px 8px",
            transition: "background-color 0.2s ease"
          }}>
            <button
              onClick={() => handleCommentUpvote(comment._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#ffffff",
                fontSize: isNested ? "12px" : "14px",
                display: "flex",
                alignItems: "center"
              }}
            >
              ▲
            </button>
            <span style={{ 
              color: "#ffffff", 
              fontSize: isNested ? "10px" : "11px", 
              fontWeight: "600",
              minWidth: "14px",
              textAlign: "center"
            }}>
              {getCommentVoteScore(comment)}
            </span>
            <button
              onClick={() => handleCommentDownvote(comment._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#ffffff",
                fontSize: isNested ? "12px" : "14px",
                display: "flex",
                alignItems: "center"
              }}
            >
              ▼
            </button>
          </div>

          {/* Reply button */}
          {user && (
            <button
              onClick={() => setReplyingTo(comment._id)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#818384",
                fontSize: isNested ? "11px" : "12px",
                cursor: "pointer",
                padding: "4px 8px",
                fontWeight: "600"
              }}
            >
              💬 Reply
            </button>
          )}

          {/* Three-dot menu for comment author */}
          {user && user.id === comment.author?._id && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#818384",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                ⋯
              </button>

              {/* Dropdown menu */}
              {openMenuId === comment._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    backgroundColor: "#1a1a1b",
                    border: "1px solid #343536",
                    borderRadius: "8px",
                    minWidth: "150px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                    marginTop: "4px"
                  }}
                >
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ff585b",
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "12px 16px",
                      textAlign: "center",
                      display: "block"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272729"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply form */}
        {replyingTo === comment._id && (
          <div style={{ marginTop: "12px" }}>
            <textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                backgroundColor: "#272729",
                border: "1px solid #343536",
                borderRadius: "8px",
                color: "#d7dadc",
                padding: "8px",
                fontSize: isNested ? "12px" : "13px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
            <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleReplySubmit(comment._id)}
                style={{
                  backgroundColor: "#ff4500",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "4px 16px",
                  fontSize: isNested ? "11px" : "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#818384",
                  border: "1px solid #343536",
                  borderRadius: "999px",
                  padding: "4px 16px",
                  fontSize: isNested ? "11px" : "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursively render replies */}
      {replies.map(reply => (
        <CommentThread
          key={reply._id}
          comment={reply}
          allComments={allComments}
          post={post}
          user={user}
          replyingTo={replyingTo}
          replyText={replyText}
          setReplyingTo={setReplyingTo}
          setReplyText={setReplyText}
          handleCommentUpvote={handleCommentUpvote}
          handleCommentDownvote={handleCommentDownvote}
          handleDeleteComment={handleDeleteComment}
          handleReplySubmit={handleReplySubmit}
          getCommentVoteScore={getCommentVoteScore}
          getCommentVoteBackgroundColor={getCommentVoteBackgroundColor}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default PostDetailPage;
