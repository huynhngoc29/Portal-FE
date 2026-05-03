import { useEffect, useMemo, useState, FormEvent } from 'react';
import axios from 'axios';

type Tool = {
  id: number;
  name: string;
  description: string | null;
  icon_url: string | null;
  url: string;
  is_active: boolean;
};

type ToolFormState = {
  name: string;
  description: string;
  icon_url: string;
  url: string;
  is_active: boolean;
};

const emptyForm: ToolFormState = {
  name: '',
  description: '',
  icon_url: '',
  url: '',
  is_active: true,
};

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ToolFormState>(emptyForm);
  const [editingToolId, setEditingToolId] = useState<number | null>(null);

  useEffect(() => {
    void fetchTools();
  }, []);

  const activeCount = useMemo(
    () => tools.filter((tool) => tool.is_active).length,
    [tools],
  );

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Tool[]>('/tools');
      setTools(response.data);
    } catch (requestError) {
      console.error('Error fetching tools:', requestError);
      setError('Không tải được danh sách tool. Kiểm tra backend đang chạy ở port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingToolId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ...form,
        description: form.description.trim() || null,
        icon_url: form.icon_url.trim() || null,
      };

      if (editingToolId) {
        await api.put(`/tools/${editingToolId}`, payload);
      } else {
        await api.post('/tools', payload);
      }

      await fetchTools();
      resetForm();
    } catch (requestError) {
      console.error('Error saving tool:', requestError);
      setError('Không lưu được tool. Kiểm tra dữ liệu hoặc backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingToolId(tool.id);
    setForm({
      name: tool.name,
      description: tool.description ?? '',
      icon_url: tool.icon_url ?? '',
      url: tool.url,
      is_active: tool.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (toolId: number) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa tool này không?');
    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/tools/${toolId}`);
      await fetchTools();
      if (editingToolId === toolId) {
        resetForm();
      }
    } catch (requestError) {
      console.error('Error deleting tool:', requestError);
      setError('Không xóa được tool.');
    }
  };

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Quản trị viên</p>
          <h1>Quản lý hệ thống</h1>
          <p className="hero-copy">
            Thêm tool mới bằng link, cấu hình và kích hoạt các ứng dụng cho người dùng trong hệ thống.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">{tools.length}</span>
            <span className="stat-label">Tổng số hệ thống</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">Đang kích hoạt</span>
          </div>
        </div>
      </section>

      {error && <div className="alert error">{error}</div>}

      <section className="layout-grid">
        <div className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Admin form</p>
              <h2>{editingToolId ? 'Cập nhật hệ thống' : 'Thêm mới'}</h2>
            </div>
            {editingToolId && (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Hủy sửa
              </button>
            )}
          </div>

          <form className="tool-form" onSubmit={handleSubmit}>
            <label>
              Tên hệ thống
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ví dụ: Report System"
                required
              />
            </label>

            <label>
              Link truy cập
              <input
                value={form.url}
                onChange={(event) => setForm({ ...form, url: event.target.value })}
                placeholder="https://..."
                required
              />
            </label>

            <label>
              Icon URL
              <input
                value={form.icon_url}
                onChange={(event) => setForm({ ...form, icon_url: event.target.value })}
                placeholder="https://.../icon.png"
              />
            </label>

            <label className="full-width">
              Mô tả ngắn
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Mô tả chức năng của hệ thống này..."
              />
            </label>

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
              />
              <span>Kích hoạt (Hiển thị cho User)</span>
            </label>

            <div className="form-actions full-width">
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? 'Đang lưu...' : editingToolId ? 'Lưu thay đổi' : 'Thêm hệ thống'}
              </button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                Làm mới
              </button>
            </div>
          </form>
        </div>

        <div className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Danh sách</p>
              <h2>Quản lý các hệ thống</h2>
            </div>
          </div>

          {loading ? (
            <div className="state-box">Đang tải dữ liệu...</div>
          ) : tools.length === 0 ? (
            <div className="state-box">Hệ thống trống. Hãy thêm ứng dụng mới bên cạnh.</div>
          ) : (
            <div className="tools-grid">
              {tools.map((tool) => (
                <article key={tool.id} className="tool-card">
                  <div className="tool-card-top">
                    <div className="tool-icon-wrap">
                      {tool.icon_url ? (
                         <img src={tool.icon_url} alt={tool.name} className="tool-icon" />
                      ) : (
                        <span>{tool.name.slice(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h3>{tool.name}</h3>
                      <p>{tool.description || 'Không có mô tả.'}</p>
                    </div>
                  </div>

                  <div className="tool-meta">
                    <span className={tool.is_active ? 'badge active' : 'badge inactive'}>
                      {tool.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="tool-link" title={tool.url}>{tool.url}</span>
                  </div>

                  <div className="tool-actions">
                    <a href={tool.url} target="_blank" rel="noreferrer" className="link-button">
                      Mở tab
                    </a>
                    <button type="button" className="secondary-button" onClick={() => handleEdit(tool)}>
                      Sửa
                    </button>
                    <button type="button" className="danger-button" onClick={() => handleDelete(tool.id)}>
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
