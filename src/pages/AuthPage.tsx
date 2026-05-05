import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  isAdmin: boolean;
};

type AuthResponse = {
  access_token: string;
  user: AuthUser;
};

type AuthFormState = {
  email: string;
  fullName: string;
  password: string;
};

const authApi = axios.create({
  baseURL: "http://localhost:3001",
});

const emptyForm: AuthFormState = {
  email: "",
  fullName: "",
  password: "",
};

const AUTH_TOKEN_KEY = "portal_auth_token";
const AUTH_USER_KEY = "portal_auth_user";

function getMode(pathname: string) {
  return pathname === "/register" ? "register" : "login";
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMemo(() => getMode(location.pathname), [location.pathname]);
  const [form, setForm] = useState<AuthFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setForm(emptyForm);
  }, [mode]);

  const title = mode === "register" ? "Tạo tài khoản" : "Đăng nhập";
  const subtitle =
    mode === "register"
      ? "Đăng ký để truy cập hệ thống nội bộ và theo dõi các công cụ được cấp quyền."
      : "Đăng nhập để tiếp tục truy cập Portal và các hệ thống nội bộ.";

  const switchLabel =
    mode === "register"
      ? "Đã có tài khoản? Đăng nhập ngay"
      : "Chưa có tài khoản? Đăng ký";

  const switchPath = mode === "register" ? "/login" : "/register";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const payload =
        mode === "register"
          ? {
              email: form.email.trim(),
              fullName: form.fullName.trim(),
              password: form.password,
            }
          : {
              email: form.email.trim(),
              password: form.password,
            };

      const endpoint = mode === "register" ? "/auth/signup" : "/auth/login";
      const response = await authApi.post<AuthResponse>(endpoint, payload);

      localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/", { replace: true });
    } catch (requestError) {
      console.error("Auth error:", requestError);
      setError(
        mode === "register"
          ? "Không đăng ký được. Kiểm tra email hoặc mật khẩu."
          : "Đăng nhập thất bại. Kiểm tra email và mật khẩu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Decorative Left Side */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-card)', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        borderRight: '1px solid var(--border-light)'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: '40px'
          }}>
            Portal Systems
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2 }}>
            Công cụ quản lý nội bộ tập trung.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6 }}>
            Truy cập mọi hệ thống, ứng dụng và báo cáo từ một nền tảng duy nhất với giao diện chuyên nghiệp.
          </p>
        </div>
        
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-5%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
        }} />
      </div>

      {/* Right Form Side */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', 
        padding: '40px',
        background: 'var(--bg-main)'
      }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div className="auth-hero" style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>{title}</h1>
            <p className="hero-copy" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
          </div>

          {error && <div className="alert error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {mode === "register" && (
              <label>
                Họ và tên
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                placeholder="Ít nhất 6 ký tự"
                minLength={6}
                required
              />
            </label>

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? "Đang xử lý..." : title}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '30px', justifyContent: 'center' }}>
            <Link to={switchPath} className="ghost-button auth-switch">
              {switchLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
