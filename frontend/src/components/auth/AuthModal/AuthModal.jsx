import { useState } from 'react';
import "../../../styles/authModals.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SuccessView from "./SuccessView";

export default function AuthModal({defaultTab = "login", onClose, onSuccess}) {
    const [tab, setTab] = useState(defaultTab);
    const [successMode, setSuccessMode] = useState(null);

    const handleSuccess = (mode) => {
      setSuccessMode(mode);
      onSuccess?.(mode);
    };

    
    return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="auth-modal">
        {/* Sidebar */}
        <div className="auth-sidebar">
          <div className="sidebar-logo">
            <svg viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm6.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.08 2.13.45a1 1 0 101.07-.99 1 1 0 00-.95.68l-2.38-.5a.26.26 0 00-.3.2l-.73 3.44a7.14 7.14 0 00-3.89 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.82 4.06s5.83-1.82 5.83-4.06c0-.15 0-.29-.03-.43a1.46 1.46 0 00.61-1.1zM6.93 11a1 1 0 111 1 1 1 0 01-1-1zm5.57 2.65a3.55 3.55 0 01-2.5.86 3.55 3.55 0 01-2.5-.86.26.26 0 01.37-.37 3.07 3.07 0 002.13.71 3.07 3.07 0 002.13-.71.26.26 0 01.37.37zm-.18-1.65a1 1 0 111-1 1 1 0 01-1 1z"/>
            </svg>
            <span>reddit</span>
          </div>
          <p className="sidebar-tagline">
            Join the front page of the internet. Millions of communities await.
          </p>
          <div className="sidebar-perks">
            {[
              "Upvote what you love",
              "Join communities",
              "Share your stories",
              "Discover trending topics",
              "Comment & discuss",
            ].map(perk => (
              <div className="sidebar-perk" key={perk}>
                <div className="perk-dot" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="auth-content">
          <button className="auth-close" onClick={onClose}>×</button>

          {successMode ? (
            <SuccessView mode={successMode} onClose={onClose} />
          ) : (
            <>
              <div className="tab-row">
                <button
                  className={`tab-btn${tab === "login" ? " active" : ""}`}
                  onClick={() => setTab("login")}
                >
                  Log In
                </button>
                <button
                  className={`tab-btn${tab === "register" ? " active" : ""}`}
                  onClick={() => setTab("register")}
                >
                  Sign Up
                </button>
              </div>

              {tab === "login" ? (
                <LoginForm
                  onSwitch={() => setTab("register")}
                  onClose={onClose}
                  onSuccess={handleSuccess}
                />
              ) : (
                <RegisterForm
                  onSwitch={() => setTab("login")}
                  onClose={onClose}
                  onSuccess={handleSuccess}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}