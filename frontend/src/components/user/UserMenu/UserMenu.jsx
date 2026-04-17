import { useState, useRef, useEffect } from "react";
import { icons } from "./menuIcons";
import "../../../styles/userMenu.css";

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);




// ─── Component ────────────────────────────────────────────────────────────────

export default function UserMenu({ user, onLogout, onNavigate }) {
  // user shape: { username, displayName?, avatarUrl?, karma? }
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const initials = (user.displayName || user.username || "U")
    .slice(0, 2)
    .toUpperCase();

  const AvatarImg = ({ size = 36 }) =>
    user.avatarUrl ? (
      <img src={user.avatarUrl} alt={user.username} />
    ) : (
      <div className="um-avatar-fallback">{initials}</div>
    );

  const go = (action) => {
    setOpen(false);
    onNavigate?.(action);
  };

  return (
    <>
      <div className="um-wrap" ref={wrapRef}>
        {/* Avatar trigger button */}
        <button
          className={`um-trigger${open ? " open" : ""}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Open user menu"
          aria-expanded={open}
        >
          <AvatarImg />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="um-dropdown" role="menu">

            {/* Header — View Profile */}
            <div className="um-header">
              <div className="um-header-avatar"><AvatarImg size={44} /></div>
              <div className="um-header-info">
                <span className="um-display-name">
                  {user.displayName || user.username}
                </span>
                <span className="um-username">u/{user.username}</span>
              </div>
            </div>

            {/* Section 1 — Account */}
            <div className="um-section">
              <button className="um-item" onClick={() => go("profile")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.profile} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">View Profile</span>
                  <span className="um-item-sub">u/{user.username}</span>
                </div>
              </button>

              <button className="um-item" onClick={() => go("avatar")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.avatar} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Edit Avatar</span>
                </div>
              </button>

              <button className="um-item" onClick={() => go("drafts")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.draft} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Drafts</span>
                </div>
              </button>

              <button className="um-item" onClick={() => go("achievements")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.trophy} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Achievements</span>
                  {user.achievements != null && (
                    <span className="um-item-sub">{user.achievements} unlocked</span>
                  )}
                </div>
              </button>
            </div>

            {/* Section 2 — Monetisation */}
            <div className="um-section">
              <button className="um-item" onClick={() => go("earn")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.earn} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Earn</span>
                  <span className="um-item-sub">Earn cash on Reddit</span>
                </div>
              </button>

              <button className="um-item" onClick={() => go("premium")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.premium} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Premium</span>
                </div>
              </button>
            </div>

            {/* Section 3 — Preferences */}
            <div className="um-section">
              <button className="um-item" onClick={() => go("displayMode")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.moon} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Display Mode</span>
                </div>
              </button>

              <button className="um-item" onClick={() => { setOpen(false); onLogout?.(); }} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.logout} /></span>
                <div className="um-item-body">
                  <span className="um-item-label logout">Log Out</span>
                </div>
              </button>
            </div>

            {/* Section 4 — More */}
            <div className="um-section">
              <button className="um-item" onClick={() => go("advertise")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.ads} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Advertise on Reddit</span>
                </div>
              </button>

              <button className="um-item" onClick={() => go("pro")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.clock} /></span>
                <div className="um-item-right">
                  <span className="um-item-label">Try Reddit Pro</span>
                  <span className="um-badge">BETA</span>
                </div>
              </button>
            </div>

            {/* Section 5 — Settings */}
            <div className="um-section">
              <button className="um-item" onClick={() => go("settings")} role="menuitem">
                <span className="um-item-icon"><Icon d={icons.settings} /></span>
                <div className="um-item-body">
                  <span className="um-item-label">Settings</span>
                </div>
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
