import { useState } from "react";
import { postService } from "../../services/postService";

function CreatePostForm({ onPostCreated }) {
  // Store what the user types
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null); // Store selected image file
  const [imagePreview, setImagePreview] = useState(""); // Show image preview

  // Tab selection: "text" or "image"
  const [postType, setPostType] = useState("text");

  // Store error and loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

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
      await postService.createPost({ title, body, image });

      // Clear the form
      setTitle("");
      setBody("");
      setImage(null);
      setImagePreview("");

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

      {/* Tabs: Text or Image */}
      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => setPostType("text")}
          style={{
            ...styles.tab,
            ...(postType === "text" ? styles.activeTab : {}),
          }}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setPostType("image")}
          style={{
            ...styles.tab,
            ...(postType === "image" ? styles.activeTab : {}),
          }}
        >
          Image
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={300}
        style={styles.input}
      />

      {/* Show different content based on tab */}
      {postType === "text" ? (
        // Text post - show textarea
        <textarea
          placeholder="Body text (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          style={styles.textarea}
        />
      ) : (
        // Image post - show image upload
        <div style={styles.imageSection}>
          {!imagePreview ? (
            <label style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div style={styles.uploadText}>
                📷 Drag and Drop or upload media
              </div>
            </label>
          ) : (
            <div style={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" style={styles.previewImg} />
              <button
                type="button"
                onClick={removeImage}
                style={styles.removeBtn}
              >
                ✕ Remove
              </button>
            </div>
          )}
          {/* Optional body text for image posts */}
          <textarea
            placeholder="Body text (optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            style={styles.textarea}
          />
        </div>
      )}

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
  tabs: {
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid #343536",
    paddingBottom: "8px",
  },
  tab: {
    backgroundColor: "transparent",
    border: "none",
    color: "#818384",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  activeTab: {
    color: "#d7dadc",
    borderBottom: "2px solid #0079d3",
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
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  uploadArea: {
    backgroundColor: "#272729",
    border: "2px dashed #343536",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
  },
  uploadText: {
    color: "#818384",
    fontSize: "14px",
  },
  imagePreview: {
    position: "relative",
    backgroundColor: "#272729",
    borderRadius: "12px",
    padding: "12px",
  },
  previewImg: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  removeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#ff585b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    cursor: "pointer",
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
