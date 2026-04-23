import { useEffect, useState } from "react";
import { postService } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";

function PostList({ refresh }) {

  const [posts, setPosts]     = useState([]);   // the list of posts
  const [loading, setLoading] = useState(true);  // are we waiting for the server?
  const [error, setError]     = useState("");    // did something go wrong?

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

  // Show different things depending on state
  if (loading) return <p style={{ color: "#818384" }}>Loading posts...</p>;
  if (error)   return <p style={{ color: "#818384" }}>{error}</p>;
  if (posts.length === 0) return <p style={{ color: "#818384" }}>No posts yet. Be the first!</p>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} style={{ borderBottom: "1px solid #343536", padding: "12px 0" }}>

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

          {/* Post body - only show if it exists */}
          {post.body && (
            <p style={{ color: "#d7dadc", fontSize: "14px", margin: "0 0 8px 0" }}>
              {post.body}
            </p>
          )}

          {/* Delete button - only show to the post author */}
          {user && user.id === post.author?._id && (
            <button
              onClick={() => handleDelete(post._id)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#ff585b",
                fontSize: "12px",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Delete
            </button>
          )}

        </div>
      ))}
    </div>
  );
}

export default PostList;
