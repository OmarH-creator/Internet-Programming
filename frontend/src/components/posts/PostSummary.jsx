import { useState } from "react";
import { postService } from "../../services/postService";

function PostSummary({ postId, initialSummary = null }) {
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await postService.summarize(postId);
      setSummary(response.data.data.summary);
      setIsExpanded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {!summary ? (
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          style={{
            ...styles.button,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "⏳ Summarizing..." : "✨ AI Summary"}
        </button>
      ) : (
        <div style={styles.summaryBox}>
          <div style={styles.summaryHeader}>
            <span style={styles.summaryTitle}>📝 AI Summary</span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={styles.toggleButton}
            >
              {isExpanded ? "▼ Hide" : "▶ Show"}
            </button>
          </div>
          {isExpanded && (
            <p style={styles.summaryText}>{summary}</p>
          )}
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "12px",
    marginBottom: "8px",
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#818384",
    color: "#fff",
    border: "1px solid #818384",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  summaryBox: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #d7dadc",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "8px",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  summaryTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1c1c1c",
  },
  toggleButton: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#818384",
    cursor: "pointer",
    padding: 0,
  },
  summaryText: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#575757",
    margin: "8px 0 0 0",
  },
  error: {
    fontSize: "12px",
    color: "#d32f2f",
    margin: "4px 0",
  },
};

export default PostSummary;
