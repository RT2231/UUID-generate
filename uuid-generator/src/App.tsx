import { useState, useEffect } from 'react';
import UUIDGenerator from './components/UUIDGenerator';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <h1>🔖 UUID Generator</h1>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>
      
      <main>
        <UUIDGenerator darkMode={darkMode} />
      </main>

      <footer className="app-footer">
        <p>Supports UUID v1, v3, v4, v5, v6, v7, v8 • RFC 4122 compliant</p>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #f5f5f5;
          color: #333;
          transition: background 0.3s, color 0.3s;
        }

        body.dark {
          background: #0f0f23;
          color: #eee;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .app-header h1 {
          font-size: 24px;
          font-weight: 600;
        }

        .theme-toggle {
          padding: 8px 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 20px;
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .theme-toggle:hover {
          background: rgba(255,255,255,0.3);
        }

        main {
          flex: 1;
          padding: 40px 20px;
        }

        .app-footer {
          text-align: center;
          padding: 20px;
          background: #f0f0f0;
          color: #666;
          font-size: 12px;
        }

        body.dark .app-footer {
          background: #1a1a2e;
          color: #888;
        }

        @media (max-width: 600px) {
          .app-header {
            padding: 15px 20px;
            flex-direction: column;
            gap: 10px;
          }

          .app-header h1 {
            font-size: 20px;
          }

          main {
            padding: 20px 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
