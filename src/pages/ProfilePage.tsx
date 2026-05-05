import { useOutletContext, useNavigate, Navigate } from "react-router-dom";
import { User, Mail, Shield, ShieldCheck, Camera, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";

type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
};

export default function ProfilePage() {
  const { user } = useOutletContext<{ user: AuthUser | null }>();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("portal_auth_token");
    localStorage.removeItem("portal_auth_user");
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <>
      <section
        className="hero"
        style={{ borderBottom: "none", paddingBottom: 0 }}
      >
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Account Settings
          </p>
          <h1>Hồ sơ cá nhân</h1>
        </div>
      </section>

      <section
        className="panel profile-panel"
        style={{
          marginTop: "40px",
          maxWidth: "600px",
          margin: "40px auto",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div className="profile-avatar-large">
            {user.avatarUrl ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={user.avatarUrl} alt="avatar" />
            ) : (
              getInitials(user.fullName)
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {user.fullName}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginTop: "8px",
                fontSize: "1.1rem",
              }}
            >
              Quản lý thông tin tài khoản của bạn
            </p>
          </div>
        </div>

        <div className="profile-info-list">
          <div className="profile-info-item">
            <div className="profile-icon">
              <User size={20} />
            </div>
            <div className="profile-details">
              <span className="profile-label">Họ và tên</span>
              <span className="profile-value">{user.fullName}</span>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-icon">
              <Mail size={20} />
            </div>
            <div className="profile-details">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
          </div>

          <div className="profile-info-item">
            <div
              className="profile-icon"
              style={{
                color: user.isAdmin
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
              }}
            >
              {user.isAdmin ? <ShieldCheck size={20} /> : <Shield size={20} />}
            </div>
            <div className="profile-details">
              <span className="profile-label">Vai trò</span>
              <span
                className="profile-value"
                style={{
                  color: user.isAdmin ? "var(--accent-primary)" : "inherit",
                  fontWeight: user.isAdmin ? 600 : "normal",
                }}
              >
                {user.isAdmin
                  ? "Quản trị viên (Admin)"
                  : "Người dùng tiêu chuẩn"}
              </span>
            </div>
          </div>
        </div>

        <EditProfileForm
          user={user}
          onLogout={handleLogout}
          onBack={() => navigate(-1)}
        />
      </section>
    </>
  );
}

function EditProfileForm({
  user,
  onLogout,
  onBack,
}: {
  user: AuthUser | null;
  onLogout: () => void;
  onBack: () => void;
}) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.avatarUrl || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("portal_auth_token");

      let avatarUrl = user.avatarUrl;

      // If an image file selected, upload first
      if (file) {
        const reader = new FileReader();
        const uploadPromise = new Promise<string>((resolve, reject) => {
          reader.onload = async (e) => {
            const base64Data = e.target?.result as string;
            try {
              const resp = await fetch(
                "http://localhost:3001/auth/profile/avatar",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                  },
                  body: JSON.stringify({ avatarData: base64Data }),
                }
              );
              if (!resp.ok) throw new Error("Upload failed");
              const data = await resp.json();
              resolve(data.user?.avatarUrl);
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsDataURL(file);
        });
        avatarUrl = await uploadPromise;
      }

      // Update profile
      const payload: any = { fullName };
      if (avatarUrl) payload.avatarUrl = avatarUrl;

      const res = await fetch("http://localhost:3001/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      const json = await res.json();

      const updatedUser = json.user || json;
      localStorage.setItem("portal_auth_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-changed"));
      setFile(null);
      setLoading(false);
      // Optional: alert or visual feedback
    } catch (err) {
      console.error(err);
      setError("Cập nhật thất bại. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="avatar-upload-container">
        <label className="avatar-upload-preview" htmlFor="avatar-input">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            user?.fullName.charAt(0).toUpperCase()
          )}
          <div className="avatar-overlay">
            <Camera size={24} />
          </div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Nhấn vào ảnh để thay đổi avatar
        </p>
      </div>

      <div className="input-group-premium">
        <span className="profile-label">Họ và tên</span>
        <div className="input-wrapper-premium">
          <User className="input-icon" size={20} />
          <input
            placeholder="Nhập họ và tên của bạn"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            color: "var(--danger)",
            fontSize: "0.9rem",
            background: "var(--danger-bg)",
            padding: "12px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div className="edit-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft size={18} style={{ marginRight: 8 }} />
          Quay lại
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>

      <div className="logout-wrapper">
        <button type="button" className="danger-button" onClick={onLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Đăng xuất tài khoản
        </button>
      </div>
    </div>
  );
}
