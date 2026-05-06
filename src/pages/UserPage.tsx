import { useEffect, useState } from 'react';
import axios from 'axios';

type Tool = {
  id: number;
  name: string;
  description: string | null;
  icon_url: string | null;
  url: string;
  is_active: boolean;
};

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export default function UserPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all tools, then filter out inactive ones for regular users
      const response = await api.get<Tool[]>('/tools');
      const activeTools = response.data.filter((tool) => tool.is_active);
      setTools(activeTools);
    } catch (requestError) {
      console.error('Error fetching tools:', requestError);
      setError('Không tải được danh sách hệ thống. Vui lòng liên hệ Admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div style={{ margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Portal Systems</p>
          <h1>Chào mừng đến với Cổng hệ thống</h1>
          <p className="hero-copy" style={{ margin: '0 auto' }}>
            Khám phá và truy cập nhanh vào các ứng dụng nội bộ từ một nơi duy nhất.
          </p>
        </div>
      </section>

      {error ? (
        <div className="alert error">{error}</div>
      ) : (
        <section className="panel" style={{ marginTop: '40px', maxWidth: '1000px', margin: '40px auto' }}>
          <div className="panel-heading" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            <h2>Danh sách ứng dụng khả dụng</h2>
          </div>

          {loading ? (
            <div className="state-box">Đang tải ứng dụng của bạn...</div>
          ) : tools.length === 0 ? (
            <div className="state-box">Hiện tại chưa có hệ thống nào được kích hoạt.</div>
          ) : (
            <div className="tools-grid">
              {tools.map((tool) => (
                <article key={tool.id} className="tool-card">
                  <div className="tool-card-top">
                    <div className="tool-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      {tool.icon_url ? (
                         <img src={tool.icon_url} alt={tool.name} className="tool-icon" />
                      ) : (
                        <span>{tool.name.slice(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h3>{tool.name}</h3>
                    </div>
                  </div>
                  
                  <p style={{ marginTop: '10px' }}>{tool.description || 'Hệ thống tiện ích nội bộ.'}</p>

                  <div className="tool-actions" style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <a href={tool.url} target="_blank" rel="noreferrer" className="primary-button" style={{ textDecoration: 'none', width: '100%' }}>
                      Truy cập ngay
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
