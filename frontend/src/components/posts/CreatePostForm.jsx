import { useState } from "react";
import { postService } from "../../services/postService";

function CreatePostForm({ onPostCreated }) {
  // Store what the user types
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Store error and loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Stop the page from refreshing
    e.preventDefault();

    // Simple check - title is required
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the backend
      await postService.createPost({ title, body });

      // Clear the form
      setTitle("");
      setBody("");

      // Tell the parent component a post was created
      onPostCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Create Post</h2>

      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={300}
        style={styles.input}
      />

      {/* Body input */}
      <textarea
        placeholder="Body text (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        style={styles.textarea}
      />

      {/* Error message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Submit button */}
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

// Simple styles
const styles = {
  form: {
    backgroundColor: "#1a1a1b",
    border: "1px solid #343536",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  heading: {
    color: "#d7dadc",
    fontSize: "18px",
    margin: 0,
  },
  input: {
    backgroundColor: "#272729",
    border: "1px solid #343536",
    borderRadius: "12px",
    color: "#d7dadc",
    padding: "10px",
    fontSize: "14px",
  },
  textarea: {
    backgroundColor: "#272729",
    border: "1px solid #343536",
    borderRadius: "12px",
    color: "#d7dadc",
    padding: "10px",
    fontSize: "14px",
    resize: "vertical",
  },
  error: {
    color: "#ff585b",
    fontSize: "13px",
    margin: 0,
  },
  button: {
    backgroundColor: "#ff4500",
    color: "white",
    border: "none",
    borderRadius: "999px",
    padding: "8px 16px",
    fontWeight: "700",
    cursor: "pointer",
    alignSelf: "flex-end",
  },
};

export default CreatePostForm;
