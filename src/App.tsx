import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Tool {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  url: string;
  is_active: boolean;
}

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tools');
      setTools(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load tools');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tools...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Portal Dashboard</h1>
        <p>Quản lý và truy cập các công cụ khác nhau</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tools-grid">
        {tools.length === 0 ? (
          <div className="no-tools">Không có tool nào</div>
        ) : (
          tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-card"
            >
              {tool.icon_url && (
                <img src={tool.icon_url} alt={tool.name} className="tool-icon" />
              )}
              <h2 className="tool-name">{tool.name}</h2>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-footer">
                <span className="tool-badge">Truy cập →</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
