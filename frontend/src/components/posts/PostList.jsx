import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import PostSummary from "./PostSummary";

function PostList({ refresh }) {

  const navigate = useNavigate();
  const [posts, setPosts]     = useState([]);   // the list of posts
  const [loading, setLoading] = useState(true);  // are we waiting for the server?
  const [error, setError]     = useState("");    // did something go wrong?
  const [fullscreenImage, setFullscreenImage] = useState(null); // Store image for fullscreen view
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open

  const { user } = useAuth(); // get the logged in user

  // This runs when the component loads, and every time "refresh" changes
  useEffect(() => {
    postService.getAllPosts()
      .then(response => {
        setPosts(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load posts");
        setLoading(false);
      });
  }, [refresh]);

  // Delete a post by ID
  const handleDelete = (postId) => {
    postService.deletePost(postId)
      .then(() => {
        // Remove the deleted post from the list without reloading
        setPosts(posts.filter(post => post._id !== postId));
      })
      .catch(() => {
        alert("Failed to delete post");
      });
  };

  // Upvote a post
  const handleUpvote = (postId) => {
    postService.upvote(postId)
      .then(response => {
        // Update the post in the list with new vote counts
        setPosts(posts.map(post => 
          post._id === postId ? response.data.data : post
        ));
      })
      .catch(() => {
        alert("Failed to upvote. Please log in.");
      });
  };

  // Downvote a post
  const handleDownvote = (postId) => {
    postService.downvote(postId)
      .then(response => {
        // Update the post in the list with new vote counts
        setPosts(posts.map(post => 
          post._id === postId ? response.data.data : post
        ));
      })
      .catch(() => {
        alert("Failed to downvote. Please log in.");
      });
  };

  // Calculate vote score (upvotes - downvotes)
  const getVoteScore = (post) => {
    const upvoteCount = post.upvotes?.length || 0;
    const downvoteCount = post.downvotes?.length || 0;
    return upvoteCount - downvoteCount;
  };

  // Check if current user upvoted this post
  const didUserUpvote = (post) => {
    if (!user) return false;
    return post.upvotes?.some(id => id === user.id);
  };

  // Check if current user downvoted this post
  const didUserDownvote = (post) => {
    if (!user) return false;
    return post.downvotes?.some(id => id === user.id);
  };

  // Get background color based on vote status
  const getVoteBackgroundColor = (post) => {
    if (didUserUpvote(post)) return "#ff4500"; // Orange for upvote
    if (didUserDownvote(post)) return "#7193ff"; // Blue for downvote
    return "#1a1a1b"; // Default dark
  };

  // Show different things depending on state
  if (loading) return <p style={{ color: "#818384" }}>Loading posts...</p>;
  if (error)   return <p style={{ color: "#818384" }}>{error}</p>;
  if (posts.length === 0) return <p style={{ color: "#818384" }}>No posts yet. Be the first!</p>;

  return (
    <div>
      {posts.map((post) => (
        <div 
          key={post._id} 
          onClick={() => navigate(`/post/${post._id}`)}
          style={{ 
            borderBottom: "1px solid #343536", 
            padding: "12px",
            cursor: "pointer",
            backgroundColor: "transparent",
            borderRadius: "8px",
            marginBottom: "8px",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1a1a1b"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >

          {/* Who posted and when */}
          <p style={{ color: "#818384", fontSize: "12px", margin: "0 0 6px 0" }}>
            <strong style={{ color: "#d7dadc" }}>u/{post.author?.username}</strong>
            &nbsp;·&nbsp;
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {/* Post title */}
          <h3 style={{ color: "#d7dadc", fontSize: "18px", fontWeight: "500", margin: "0 0 6px 0" }}>
            {post.title}
          </h3>

          {/* Post body - only show if it exists AND there's no image */}
          {post.body && !post.image && (
            <p style={{ 
              color: "#d7dadc", 
              fontSize: "14px", 
              margin: "0 0 12px 0",
              textAlign: "justify",
              lineHeight: "1.5"
            }}>
              {post.body}
            </p>
          )}

          {/* Post image - only show if it exists */}
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title}
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(post.image);
              }}
              style={{ 
                width: "100%", 
                height: "auto",
                display: "block",
                borderRadius: "12px",
                marginBottom: "12px",
                cursor: "pointer"
              }}
            />
          )}

          {/* AI Summary Component */}
          <div onClick={(e) => e.stopPropagation()}>
            <PostSummary postId={post._id} initialSummary={post.summary} />
          </div>

          {/* Vote buttons at the bottom - horizontal layout */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px"
            }}
          >
            {/* Vote buttons */}
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: "4px",
              backgroundColor: getVoteBackgroundColor(post),
              borderRadius: "20px",
              padding: "4px 10px",
              transition: "background-color 0.2s ease"
            }}>
              <button
                onClick={() => handleUpvote(post._id)}
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
                {getVoteScore(post)}
              </span>

              <button
                onClick={() => handleDownvote(post._id)}
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

            {/* Comment button */}
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#1a1a1b",
              borderRadius: "20px",
              padding: "4px 10px",
              cursor: "pointer"
            }}>
              <span style={{ fontSize: "16px" }}>💬</span>
              <span style={{ 
                color: "#d7dadc", 
                fontSize: "12px", 
                fontWeight: "600"
              }}>
                {post.commentCount || 0}
              </span>
            </div>
          </div>

          {/* Delete button - only show to the post author */}
          {user && user.id === post.author?._id && (
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative", display: "inline-block" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === post._id ? null : post._id);
                }}
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
              {openMenuId === post._id && (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                      setOpenMenuId(null);
                    }}
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
      ))}

      {/* Fullscreen image viewer */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer"
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              border: "none",
              color: "white",
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>

          {/* Fullscreen image */}
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              objectFit: "contain"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PostList;
