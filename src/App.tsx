import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import "./App.css";

function NavigationBar() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "rgba(18, 18, 24, 0.4)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Portal
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Link
          to="/"
          className={!isAdmin ? "primary-button" : "ghost-button"}
          style={{ padding: "8px 16px", borderRadius: "10px" }}
        >
          User View
        </Link>
        <Link
          to="/admin"
          className={isAdmin ? "primary-button" : "ghost-button"}
          style={{ padding: "8px 16px", borderRadius: "10px" }}
        >
          Admin Dashboard
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
