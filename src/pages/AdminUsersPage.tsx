import { useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: number;
  email: string;
  fullName: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
  createdAt?: string;
};

const AUTH_TOKEN_KEY = "portal_auth_token";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
      const resp = await api.get<User[]>("/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(resp.data as unknown as User[]);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (u: User) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
      await api.patch(
        "/auth/admin/users/" + u.id,
        { id: u.id, isAdmin: !u.isAdmin },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Cập nhật thất bại");
    }
  };

  const removeUser = async (u: User) => {
    if (!confirm(`Xóa người dùng ${u.email}?`)) return;
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
      await api.delete("/auth/admin/users/" + u.id, {
        data: { id: u.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Xóa thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <div className="panel-heading" style={{ marginBottom: 20 }}>
        <h2>Quản lý người dùng</h2>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="state-box">Đang tải...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <th style={{ padding: "12px" }}>#</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Admin</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              >
                <td style={{ padding: "12px" }}>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.fullName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.isAdmin}
                    onChange={() => toggleAdmin(u)}
                  />
                </td>
                <td>
                  <button
                    className="ghost-button"
                    onClick={() => removeUser(u)}
                    style={{ marginLeft: 8 }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
