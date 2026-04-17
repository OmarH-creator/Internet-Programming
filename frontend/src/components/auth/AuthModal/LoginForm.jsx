import { useState } from "react";
import EyeIcon from "./icons/EyeIcon";
import { useAuth } from "../../../context/AuthContext";

function LoginForm({ onSwitch, onClose, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email or username is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { 
      setErrors(e); 
      return; 
    }
    setLoading(true);
    setErrors({});
    try {
      const result = await login({ identifier: email, password });
      if (!result?.success) {
        throw new Error(result?.message || "Login failed. Check your credentials.");
      }
      onSuccess?.("login");
    } catch (err) {
      setErrors({ submit: err.message || "Login failed. Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Log In</h2>
      <p className="auth-subtitle">
        New to Reddit? <a onClick={onSwitch}>Sign up</a>
      </p>

      <button className="social-btn" onClick={() => {/* trigger Google OAuth */}}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
      <button className="social-btn" onClick={() => {/* trigger Apple OAuth */}}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.17 1.29-2.15 3.84.03 3.02 2.65 4.03 2.68 4.04l-.08.24zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Continue with Apple
      </button>

      <div className="divider">
        <div className="divider-line" />
        <span className="divider-text">or</span>
        <div className="divider-line" />
      </div>

      <div className="form-group">
        <label className="form-label">Email or username</label>
        <input
          className={`form-input${errors.email ? " error" : ""}`}
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your email or username"
          autoFocus
        />
        {errors.email && <p className="form-error">⚠ {errors.email}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="password-wrapper">
          <input
            className={`form-input${errors.password ? " error" : ""}`}
            type={showPass ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your password"
            style={{ paddingRight: "70px" }}
          />
          <button className="password-toggle" onClick={() => setShowPass(v => !v)} type="button">
            <EyeIcon visible={showPass} />
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        <a className="forgot-link" onClick={() => {/* navigate to reset */}}>Forgot password?</a>
        {errors.password && <p className="form-error" style={{clear:"both"}}>⚠ {errors.password}</p>}
      </div>

      {errors.submit && (
        <p className="form-error" style={{marginBottom: "8px", fontSize: "13px"}}>
          ⚠ {errors.submit}
        </p>
      )}

      <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{clear:"both"}}>
        {loading ? "Logging in…" : "Log In"}
      </button>

      <p className="terms">
        By continuing, you agree to our{" "}
        <a href="#">User Agreement</a> and acknowledge that you understand our{" "}
        <a href="#">Privacy Policy</a>.
      </p>
    </>
  );
}

export default LoginForm;