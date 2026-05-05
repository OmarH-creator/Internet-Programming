import { useNavigate } from "react-router-dom";
import ProfileCircle from "../common/ProfileCircle";

// Simple component to show list of comments
function CommentList({ comments }) {
  const navigate = useNavigate();

  if (comments.length === 0) {
    return <p style={{ color: "#818384" }}>No comments yet</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment._id}
          onClick={() => navigate(`/post/${comment.post._id}`)}
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
          {/* Who commented and when */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            {/* Profile circle - reusable component */}
            <ProfileCircle user={comment.author} size={20} />

            {/* Username and date */}
            <p style={{ color: "#818384", fontSize: "12px", margin: "0" }}>
              <strong style={{ color: "#d7dadc" }}>u/{comment.author?.username}</strong>
              &nbsp;·&nbsp;
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Comment text */}
          <p style={{
            color: "#d7dadc",
            fontSize: "14px",
            margin: "0 0 6px 0",
            lineHeight: "1.5"
          }}>
            {comment.text}
          </p>

          {/* Post title this comment is on */}
          <p style={{ color: "#818384", fontSize: "12px", margin: "0" }}>
            💬 on post: <strong>{comment.post?.title || "Unknown"}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
