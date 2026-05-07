import { useEffect, useState } from "react";
import { postService } from "../../services/postService";
import PostCard from "./PostCard";

// Simple component to show list of posts
// Can show: all posts, community posts, or user posts
function PostList({ refresh, posts: userPosts, onPostDeleted, communityId }) {
  // State to store posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load posts when component loads or when inputs change
  useEffect(() => {
    // If userPosts provided, use them (for profile page)
    if (userPosts) {
      setPosts(userPosts);
      setLoading(false);
    } else {
      // Otherwise, fetch posts from server
      // communityId is optional - if provided, only get that community's posts
      postService.getAllPosts(communityId)
        .then(response => {
          setPosts(response.data.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load posts");
          setLoading(false);
        });
    }
  }, [refresh, userPosts, communityId]);

  // When a post is deleted
  const handlePostDeleted = () => {
    if (userPosts) {
      // If using userPosts, tell parent to reload
      if (onPostDeleted) {
        onPostDeleted();
      }
    } else {
      // Otherwise, reload posts ourselves
      postService.getAllPosts(communityId)
        .then(response => {
          setPosts(response.data.data);
        })
        .catch(() => {
          setError("Failed to reload posts");
        });
    }
  };

  // Show loading message
  if (loading) return <p style={{ color: "#818384" }}>Loading posts...</p>;
  
  // Show error message
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
