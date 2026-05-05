import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";

// Reusable component to show a single post
function PostCard({ post, onPostDeleted, showFullContent = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState(post);
  const [openMenu, setOpenMenu] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Upvote post
  const handleUpvote = () => {
    postService.upvote(currentPost._id)
      .then(response => {
        setCurrentPost(response.data.data);
      })
      .catch(() => {
        alert("Failed to upvote. Please log in.");
      });
  };

  // Downvote post
  const handleDownvote = () => {
    postService.downvote(currentPost._id)
      .then(response => {
        setCurrentPost(response.data.data);
      })
      .catch(() => {
        alert("Failed to downvote. Please log in.");
      });
  };

  // Delete post
  const handleDelete = () => {
    postService.deletePost(currentPost._id)
      .then(() => {
        setOpenMenu(false);
        if (onPostDeleted) {
          onPostDeleted();
        }
      })
      .catch(() => {
        alert("Failed to delete post");
      });
  };

  // Calculate vote score
  const voteScore = (currentPost.upvotes?.length || 0) - (currentPost.downvotes?.length || 0);
  
  // Check if user voted
  const userUpvoted = user && currentPost.upvotes?.some(id => id === user.id);
  const userDownvoted = user && currentPost.downvotes?.some(id => id === user.id);
  
  // Vote button color
  const voteColor = userUpvoted ? "#ff4500" : userDownvoted ? "#7193ff" : "#1a1a1b";

  // Check if user is post author
  const isAuthor = user && user.id === currentPost.author?._id;

  return (
    <div
      onClick={() => !showFullContent && navigate(`/post/${currentPost._id}`)}
      style={{
        borderBottom: "1px solid #343536",
        padding: "12px",
        cursor: showFullContent ? "default" : "pointer",
        backgroundColor: "transparent",
        borderRadius: "8px",
        marginBottom: "8px",
        transition: "background-color 0.2s"
      }}
      onMouseEnter={(e) => !showFullContent && (e.currentTarget.style.backgroundColor = "#1a1a1b")}
      onMouseLeave={(e) => !showFullContent && (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {/* Author and date */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        {/* Profile image circle */}
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#ff4500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0
        }}>
          {currentPost.author?.avatar ? (
            <img
              src={currentPost.author.avatar}
              alt={currentPost.author.username}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          ) : (
            <span style={{
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "700"
            }}>
              {currentPost.author?.username?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>

        {/* Username and date */}
        <p style={{ color: "#818384", fontSize: "12px", margin: "0" }}>
          <strong style={{ color: "#d7dadc" }}>u/{currentPost.author?.username}</strong>
          &nbsp;·&nbsp;
          {new Date(currentPost.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Title */}
      <h3 style={{
        color: "#d7dadc",
        fontSize: showFullContent ? "28px" : "18px",
        fontWeight: showFullContent ? "600" : "500",
        margin: "0 0 6px 0",
        lineHeight: showFullContent ? "1.3" : "1.2"
      }}>
        {currentPost.title}
      </h3>

      {/* Body text */}
      {currentPost.body && !currentPost.image && (
        <p style={{
          color: "#d7dadc",
          fontSize: "14px",
          margin: "0 0 12px 0",
          textAlign: "justify",
          lineHeight: "1.5"
        }}>
          {currentPost.body}
        </p>
      )}

      {/* Image */}
      {currentPost.image && (
        <img
          src={currentPost.image}
          alt={currentPost.title}
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenImage(currentPost.image);
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

      {/* Body text after image (if image exists) */}
      {currentPost.body && currentPost.image && (
        <p style={{
          color: "#d7dadc",
          fontSize: "14px",
          margin: "0 0 12px 0",
          textAlign: "justify",
          lineHeight: "1.5"
        }}>
          {currentPost.body}
        </p>
      )}

      {/* Vote buttons */}
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
          backgroundColor: voteColor,
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
            {voteScore}
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
        {!showFullContent && (
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
              {currentPost.commentCount || 0}
            </span>
          </div>
        )}
      </div>

      {/* Delete button - only for post author */}
      {isAuthor && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: "relative", display: "inline-block" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(!openMenu);
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
          {openMenu && (
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
                  handleDelete();
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

export default PostCard;
