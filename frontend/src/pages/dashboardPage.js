import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import UserMenu from "../components/user/UserMenu";
import { userService } from "../services/userService";
import "../styles/dashboardPage.css";

/* ─── Static mock data ─────────────────────────────────────── */

const NAV_ITEMS = [
  { icon: "🔥", label: "Popular", active: true },
  { icon: "📰", label: "News" },
  { icon: "🧭", label: "Explore" },
];

const RESOURCES = [
  "About Reddit",
  "Advertise",
  "Developer Platform",
  "Reddit Pro BETA",
  "Help",
  "Blog",
  "Careers",
  "Press",
];

const BOTTOM_LINKS = [
  "Best of Reddit",
  "Best of Reddit in Por...",
  "Best of Reddit in Ger...",
  "Reddit Rules",
  "Privacy Policy",
  "User Agreement",
  "Accessibility",
];

const POSTS = [
  {
    id: 1,
    subreddit: "r/AskMoul",
    timeAgo: "6 hr. ago",
    canJoin: true,
    title: "Pourquoi se retenir de péter ?",
    body: "La question paraît dingue je sais mais je n'ai jamais su pourquoi ou du moins avoir le point de vue féminin. Parce que c'est complètement humain et biologique. Et vivre avec quelqu'un, se retenir me paraît fou. Et devons \"l'argument\" \"c'est pas sexy\" ou \"une femme ne pète pas\", croyez moi j'étais avec une qui pétais plus fort que moi et c'était hilarant. Donc ma question est le titre. Edit: je parle plutôt de péter au sein d'un couple, pas en public.",
    upvotes: 36,
    comments: 114,
    hasImage: false,
    userAvatar: "🧑",
  },
  {
    id: 2,
    subreddit: "r/PasDéQuestionIdote",
    timeAgo: "5 hr. ago",
    canJoin: true,
    title: "Ça coûte combien par an un enfant ?",
    body: "Je vais très probablement concevoir un enfant l'année prochaine avec ma conjointe. Ça risque d'être 20 minutes très élevées. Et puis 20/25 ans de souffre financier... Du coup, je me pose la question : ça coûte combien un enfant au minimum par année (càd le minimum pour qu'il soit heureux et en bonne santé) ? Quelqu'un ici peut-il faire le calcul... C'est d'utilité publique. 😊",
    upvotes: 34,
    comments: 115,
    hasImage: false,
    userAvatar: "👤",
  },
  {
    id: 3,
    subreddit: "r/mapporncirclejerk",
    timeAgo: "7 hr. ago",
    canJoin: true,
    title: "I'm trying to plan a roadtrip from Berlin to the Pyramids. I'm trying to avoid dangerous areas. How's my current route?",
    body: "",
    hasImage: true,
    mapImage: true,
    upvotes: 0,
    comments: 0,
    userAvatar: "🗺️",
  },
];

const POPULAR_COMMUNITIES = [
  { name: "r/DestinyTheGame", members: "1,155,066" },
  { name: "r/anime",          members: "14,748,407" },
  { name: "r/destiny2",       members: "932,455" },
  { name: "r/FortNiteBR",     members: "5,033,794" },
  { name: "r/dndnext",        members: "818,148" },
  { name: "r/buildspc",       members: "3,440,325" },
  { name: "r/techsupport",    members: "3,166,523" },
  { name: "r/jailbreak",      members: "933,495" },
  { name: "r/livestreamFail", members: "4,765,017" },
  { name: "r/legaladvice",    members: "3,439,000" },
  { name: "r/LifeProTips",    members: "23,036,341" },
  { name: "r/AskCulinary",    members: "1,252,198" },
  { name: "r/Philippines",    members: "3,094,208" },
  { name: "r/memes",          members: "35,761,141" },
  { name: "r/Rainbows",       members: "2,134,917" },
  { name: "r/Sneakers",       members: "5,237,197" },
];

/* ─── Sub-components ───────────────────────────────────────── */

function LeftSidebar({ sidebarOpen }) {
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const [communitiesOpen, setCommunitiesOpen] = useState(true);
  const { user } = useAuth();

  const joinedCommunities = user?.joinedCommunities || [];

  return (
    <aside className={`db-sidebar-left ${sidebarOpen ? "db-sidebar-left--open" : ""}`}>
      {/* Main nav */}
      <nav className="db-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`db-nav__item ${item.active ? "db-nav__item--active" : ""}`}
          >
            <span className="db-nav__icon">{item.icon}</span>
            <span className="db-nav__label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Communities */}
      {user && (
        <>
          <div className="db-sidebar-divider" />
          <div className="db-nav-section">
            <button
              className="db-nav-section__header"
              onClick={() => setCommunitiesOpen((v) => !v)}
            >
              <span>COMMUNITIES</span>
              <span className={`db-nav-section__chevron ${communitiesOpen ? "db-nav-section__chevron--open" : ""}`}>
                ‹
              </span>
            </button>
            {communitiesOpen && (
              <div className="db-nav-section__items">
                {joinedCommunities.length === 0 ? (
                  <p className="db-nav__item db-nav__item--sub" style={{ paddingLeft: '12px' }}>No communities yet</p>
                ) : (
                  joinedCommunities.map((c) => (
                    <button key={c} className="db-nav__item db-nav__item--sub">
                      <span className="db-community-icon">r/</span>
                      <span className="db-nav__label">{c.replace('r/', '')}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}

      <div className="db-sidebar-divider" />

      {/* Resources */}
      <div className="db-nav-section">
        <button
          className="db-nav-section__header"
          onClick={() => setResourcesOpen((v) => !v)}
        >
          <span>RESOURCES</span>
          <span className={`db-nav-section__chevron ${resourcesOpen ? "db-nav-section__chevron--open" : ""}`}>
            ‹
          </span>
        </button>
        {resourcesOpen && (
          <div className="db-nav-section__items">
            {RESOURCES.map((r) => (
              <button key={r} className="db-nav__item db-nav__item--sub">
                <span className="db-nav__label">{r}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/* PostCard receives requireAuth so every action goes through the gate */
function PostCard({ post, requireAuth }) {
  const { user, updateUser } = useAuth();
  const [votes, setVotes]   = useState(post.upvotes);
  const [voted, setVoted]   = useState(null); // 'up' | 'down' | null
  
  const joined = user?.joinedCommunities?.includes(post.subreddit) || false;

  const handleUpvote = () =>
    requireAuth(() => {
      if (voted === "up") { setVotes((v) => v - 1); setVoted(null); }
      else { setVotes((v) => v + (voted === "down" ? 2 : 1)); setVoted("up"); }
    });

  const handleDownvote = () =>
    requireAuth(() => {
      if (voted === "down") { setVotes((v) => v + 1); setVoted(null); }
      else { setVotes((v) => v - (voted === "up" ? 2 : 1)); setVoted("down"); }
    });

  const handleJoin = () =>
    requireAuth(async () => {
      try {
        const res = await userService.toggleCommunity({ communityName: post.subreddit });
        if (res.data?.success) {
          updateUser({ joinedCommunities: res.data.data.user.joinedCommunities });
        }
      } catch (error) {
        console.error("Failed to toggle community", error);
      }
    });
  const handleComment = () => requireAuth(() => {/* open comment panel */});
  const handleShare   = () => requireAuth(() => {/* open share dialog */});

  return (
    <article className="db-post-card">
      {/* Header */}
      <div className="db-post-card__header">
        <span className="db-post-card__avatar">{post.userAvatar}</span>
        <div className="db-post-card__meta">
          <span className="db-post-card__subreddit">{post.subreddit}</span>
          <span className="db-post-card__dot">•</span>
          <span className="db-post-card__time">{post.timeAgo}</span>
        </div>
        {post.canJoin && (
          <button
            className={`db-post-card__join ${joined ? "db-post-card__join--joined" : ""}`}
            onClick={handleJoin}
          >
            {joined ? "✓ Joined" : "Join"}
          </button>
        )}
        <button className="db-post-card__more" aria-label="More options">•••</button>
      </div>

      {/* Title */}
      <h2 className="db-post-card__title">{post.title}</h2>

      {/* Body */}
      {post.body && <p className="db-post-card__body">{post.body}</p>}

      {/* Map visual */}
      {post.mapImage && (
        <div className="db-post-card__map-container">
          <div className="db-post-card__map">
            <div className="db-map-bg">
              <div className="db-map-label db-map-label--europe">EUROPE</div>
              <div className="db-map-line" />
              <div className="db-map-cities">
                <span style={{ top: "22%", left: "38%" }}>London</span>
                <span style={{ top: "32%", left: "45%" }}>Paris</span>
                <span style={{ top: "18%", left: "55%" }}>Stockholm</span>
                <span style={{ top: "28%", left: "63%" }}>Moscow</span>
                <span style={{ top: "38%", left: "52%" }}>Berlin</span>
                <span style={{ top: "55%", left: "58%" }}>Istanbul</span>
                <span style={{ top: "50%", left: "45%" }}>Rome</span>
                <span style={{ top: "68%", left: "65%" }}>Tehran</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="db-post-card__actions">
        <div className="db-post-card__votes">
          <button
            className={`db-post-card__vote-btn ${voted === "up" ? "db-post-card__vote-btn--active-up" : ""}`}
            onClick={handleUpvote}
            aria-label="Upvote"
          >
            ↑
          </button>
          <span className="db-post-card__vote-count">{votes}</span>
          <button
            className={`db-post-card__vote-btn ${voted === "down" ? "db-post-card__vote-btn--active-down" : ""}`}
            onClick={handleDownvote}
            aria-label="Downvote"
          >
            ↓
          </button>
        </div>

        <button className="db-post-card__action-btn" onClick={handleComment} aria-label="Comments">
          💬 <span>{post.comments}</span>
        </button>

        <button className="db-post-card__action-btn" onClick={handleShare} aria-label="Share">
          ⬆ Share
        </button>
      </div>
    </article>
  );
}

function FeedControls() {
  return (
    <div className="db-feed-controls">
      <div className="db-feed-controls__left">
        <button className="db-feed-controls__btn db-feed-controls__btn--active">
          Best <span className="db-feed-controls__chevron">▾</span>
        </button>
        <button className="db-feed-controls__btn">
          Everywhere <span className="db-feed-controls__chevron">▾</span>
        </button>
        <button className="db-feed-controls__btn">
          <span>☰</span> <span className="db-feed-controls__chevron">▾</span>
        </button>
      </div>
    </div>
  );
}

function RightSidebar({ requireAuth }) {
  return (
    <aside className="db-sidebar-right">
      <div className="db-sidebar-right__card db-sidebar-right__footer">
        <div className="db-footer-links">
          {BOTTOM_LINKS.map((link) => (
            <a key={link} href="#" className="db-footer-link">{link}</a>
          ))}
        </div>
        <p className="db-sidebar-footer">Reddit, Inc. © 2025. All rights reserved.</p>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════
   AUTH GATE TOOLTIP / NUDGE
══════════════════════════════════════════ */
function AuthNudge({ visible, onLogin, onSignup, onClose }) {
  if (!visible) return null;
  return (
    <>
      {/* Backdrop – clicking outside dismisses */}
      <div className="db-nudge-backdrop" onClick={onClose} />
      <div className="db-nudge" role="dialog" aria-modal="true" aria-label="Sign in prompt">
        <button className="db-nudge__close" onClick={onClose} aria-label="Close">✕</button>
        <p className="db-nudge__title">🔐 Log in to continue</p>
        <p className="db-nudge__body">
          You need an account to vote, comment, share, or join communities.
        </p>
        <div className="db-nudge__actions">
          <button className="db-nudge__btn db-nudge__btn--filled" onClick={onLogin}>
            Log In
          </button>
          <button className="db-nudge__btn db-nudge__btn--outline" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Dashboard Page ──────────────────────────────────── */

function DashboardPage() {
  const navigate        = useNavigate();
  const [authOpen,      setAuthOpen]      = useState(false);
  const [defaultTab,    setDefaultTab]    = useState("login");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [nudgeVisible,  setNudgeVisible]  = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  /* ── Auth gate ──────────────────────────────────────────────
     Usage:  requireAuth(() => doSomething())
     If authenticated  → runs the callback immediately.
     If not            → shows the login nudge instead.
  ─────────────────────────────────────────────────────────── */
  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action();
      } else {
        setNudgeVisible(true);
      }
    },
    [isAuthenticated]
  );

  const openLogin  = () => { setNudgeVisible(false); setDefaultTab("login");    setAuthOpen(true); };
  const openSignup = () => { setNudgeVisible(false); setDefaultTab("register"); setAuthOpen(true); };

  const handleAuthSuccess = () => setAuthOpen(false);
  const handleLogout      = () => logout();

  const handleNavigate = (action) => {
    if (action === "profile")  { navigate("/profile");  return; }
    if (action === "settings") { navigate("/settings"); return; }
  };

  return (
    <div className="db-root">
      {/* ── Top bar ── */}
      <header className="db-topbar">
        {/* Logo + hamburger */}
        <div className="db-topbar__left">
          <button
            className="db-topbar__hamburger"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <a href="/dashboard" className="db-topbar__logo">
            <span className="db-logo-icon">🔴</span>
            <span className="db-logo-text">reddit</span>
          </a>
        </div>

        {/* Search bar — Ask button gated */}
        <div className="db-topbar__search">
          <span className="db-search__icon">🔍</span>
          <input
            className="db-search__input"
            type="text"
            placeholder="Find anything"
            aria-label="Search Reddit"
          />
          <button
            className="db-search__ask"
            onClick={() => requireAuth(() => {})}
          >
             Ask
          </button>
        </div>

        {/* Auth area */}
        <div className="db-topbar__right">
          {isAuthenticated && user ? (
            <UserMenu user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
          ) : (
            <>
              <button
                id="db-signup-btn"
                className="db-topbar__btn db-topbar__btn--outline"
                onClick={openSignup}
              >
                Sign Up
              </button>
              <button
                id="db-login-btn"
                className="db-topbar__btn db-topbar__btn--filled"
                onClick={openLogin}
              >
                Log In
              </button>
              <button className="db-topbar__more" aria-label="More options">•••</button>
            </>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="db-body">
        <LeftSidebar sidebarOpen={sidebarOpen} />

        <main className="db-main">
          <FeedControls />
          <div className="db-feed">
            {POSTS.map((post) => (
              <PostCard key={post.id} post={post} requireAuth={requireAuth} />
            ))}
          </div>
        </main>

        <RightSidebar requireAuth={requireAuth} />
      </div>

      {/* ── Auth nudge (shown on any gated action) ── */}
      <AuthNudge
        visible={nudgeVisible}
        onLogin={openLogin}
        onSignup={openSignup}
        onClose={() => setNudgeVisible(false)}
      />

      {/* ── Auth modal ── */}
      {authOpen && (
        <AuthModal
          defaultTab={defaultTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default DashboardPage;
