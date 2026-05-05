import { useEffect, useState } from "react";
import { postService } from "../../services/postService";
import PostCard from "./PostCard";

// Simple component to show list of posts
function PostList({ refresh, posts: propsPosts, onPostDeleted }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If posts are passed as props, use them (for profile page)
  // Otherwise, fetch all posts (for home page)
  useEffect(() => {
    if (propsPosts) {
      // Use posts from props (profile page)
      setPosts(propsPosts);
      setLoading(false);
    } else {
      // Fetch all posts (home page)
      postService.getAllPosts()
        .then(response => {
          setPosts(response.data.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load posts");
          setLoading(false);
        });
    }
  }, [refresh, propsPosts]);

  // Handle post deleted
  const handlePostDeleted = () => {
    if (propsPosts) {
      // If using props, call parent callback
      if (onPostDeleted) {
        onPostDeleted();
      }
    } else {
      // If fetching posts, reload
      postService.getAllPosts()
        .then(response => {
          setPosts(response.data.data);
        })
        .catch(() => {
          setError("Failed to reload posts");
        });
    }
  };

  // Show loading
  if (loading) return <p style={{ color: "#818384" }}>Loading posts...</p>;
  
  // Show error
  if (error) return <p style={{ color: "#818384" }}>{error}</p>;
  
  // Show empty message
  if (posts.length === 0) return <p style={{ color: "#818384" }}>No posts yet. Be the first!</p>;

  // Show posts using PostCard component
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onPostDeleted={handlePostDeleted}
        />
      ))}
    </div>
  );
}

export default PostList;
