import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

// Basic inline SVGs for layout icons
const Icons = {
  Grid: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Users: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Settings: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  LogOut: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
};

type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
};

const AUTH_USER_KEY = "portal_auth_user";

function readStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

const handleLogout = () => {
  localStorage.removeItem("portal_auth_token");
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event("auth-changed"));
};

// ================= LAYOUTS =================

function AdminLayout({ user }: { user: AuthUser }) {
  const location = useLocation();

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">Admin Panel</div>
        <nav className="sidebar-nav">
          <Link
            to="/admin"
            className={`sidebar-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            <Icons.Grid /> Modules
          </Link>
          <Link
            to="/admin/users"
            className={`sidebar-link ${location.pathname === "/admin/users" ? "active" : ""}`}
          >
            <Icons.Users /> Người dùng
          </Link>
          <Link
            to="/admin/settings"
            className={`sidebar-link ${location.pathname === "/admin/settings" ? "active" : ""}`}
          >
            <Icons.Settings /> Cài đặt
          </Link>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              textAlign: "left",
              padding: "12px 16px",
            }}
          >
            <Icons.LogOut /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            Quản lý hệ thống
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--accent-gradient)",
                display: "grid",
                placeItems: "center",
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                user.fullName.charAt(0)
              )}
            </div>
            <span
              style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
            >
              {user.fullName}
            </span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function UserLayout({ user }: { user: AuthUser | null }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        style={{
          padding: "24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            height: "64px",
            background: "rgba(18, 18, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "32px",
            width: "100%",
            maxWidth: "1200px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}
          >
            Portal
          </Link>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="ghost-button"
                    style={{ padding: "8px 16px", borderRadius: "10px" }}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  className="ghost-button"
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "inline-block",
                      }}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            display: "inline-grid",
                            placeItems: "center",
                            width: "100%",
                            height: "100%",
                            background: "var(--accent-gradient)",
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </span>
                      )}
                    </span>
                    <span>{user.fullName}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={handleLogout}
                  style={{ padding: "8px 16px", borderRadius: "10px" }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ghost-button"
                  style={{ padding: "8px 16px", borderRadius: "10px" }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="primary-button"
                  style={{ padding: "8px 16px", borderRadius: "10px" }}
                >
                  Tạo tài khoản
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
      <main className="page-shell" style={{ flex: 1, width: "100%" }}>
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

// ================= APP COMPONENT =================

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() =>
    readStoredUser(),
  );

  useEffect(() => {
    const syncAuth = () => setAuthUser(readStoredUser());

    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ - Ai cũng có thể vào */}
        <Route element={<UserLayout user={authUser} />}>
          <Route path="/" element={<UserPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {authUser ? (
          <>
            {/* Lớp bảo vệ riêng cho Admin */}
            <Route element={<AdminLayout user={authUser} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route
                path="/admin/*"
                element={
                  <div className="state-box" style={{ marginTop: 40 }}>
                    Tính năng đang phát triển
                  </div>
                }
              />
            </Route>

            {/* Chặn truy cập lại trang Auth */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
