function SuccessView({ mode, onClose }) {
  const isLogin = mode === "login";

  return (
    <div className="success-box">
      <div className="success-icon">✓</div>

      <h2 className="auth-title" style={{ margin: 0 }}>
        {isLogin ? "Welcome back!" : "Welcome to Reddit!"}
      </h2>

      <p style={{ color: "#576F76", fontSize: "14px", margin: 0 }}>
        {isLogin
          ? "You've been logged in successfully."
          : "Your account has been created."}
      </p>

      <button
        className="submit-btn"
        onClick={onClose}
        style={{ width: "auto", padding: "12px 32px" }}
      >
        Get Started
      </button>
    </div>
  );
}

export default SuccessView;