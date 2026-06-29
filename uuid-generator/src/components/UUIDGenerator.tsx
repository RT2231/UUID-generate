import { useState } from 'react';
import { generateUUIDs, formatUUID, NAMESPACE_PRESETS } from '../utils/uuid';
import { useTranslation } from './i18n/useTranslation';

interface UUIDGeneratorProps {
  darkMode: boolean;
}

const UUIDGenerator: React.FC<UUIDGeneratorProps> = ({ darkMode }) => {
  const t = useTranslation();
  const [version, setVersion] = useState<number>(4);
  const [count, setCount] = useState<number>(1);
  const [namespace, setNamespace] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [customData, setCustomData] = useState<string>('');
  const [format, setFormat] = useState<string>('normal');
  const [outputType, setOutputType] = useState<string>('newline');
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleGenerate = () => {
    setError('');
    
    if (count < 1 || count > 1000) {
      setError(t.countError);
      return;
    }

    if ((version === 3 || version === 5) && (!namespace || !name)) {
      setError(t.namespaceRequired);
      return;
    }

    try {
      const generated = generateUUIDs({
        version,
        count,
        namespace: namespace || undefined,
        name: name || undefined,
        customData: customData || undefined,
      });
      setUuids(generated);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: t.copiedToClipboard, type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast({ message: '✗ Failed to copy', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const copyAll = () => {
    const text = uuids.map(u => formatUUID(u, format)).join('\n');
    copyToClipboard(text);
  };

  const downloadFile = (type: 'txt' | 'csv' | 'json') => {
    let content: string;
    let mimeType: string;
    let extension: string;

    const formatted = uuids.map(u => formatUUID(u, format));

    switch (type) {
      case 'txt':
        content = formatted.join('\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      case 'csv':
        content = formatted.join(',');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'json':
        content = JSON.stringify(formatted, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
    }

    const date = new Date().toISOString().split('T')[0];
    const filename = `uuid-${date}.${extension}`;
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast({ message: `✓ Downloaded ${filename}`, type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const getFormattedUUID = (uuid: string) => {
    return formatUUID(uuid, format);
  };

  const isGenerateDisabled = (version === 3 || version === 5) && (!namespace || !name);

  return (
    <div className={`uuid-generator ${darkMode ? 'dark' : ''}`}>
      <div className="controls">
        <h1>UUID Generator</h1>
        
        <div className="control-group">
          <label htmlFor="version">Version</label>
          <select 
            id="version" 
            value={version} 
            onChange={(e) => setVersion(Number(e.target.value))}
          >
            <option value={1}>v1 (Time-based)</option>
            <option value={3}>v3 (Name-based MD5)</option>
            <option value={4}>v4 (Random)</option>
            <option value={5}>v5 (Name-based SHA-1)</option>
            <option value={6}>v6 (Ordered time-based)</option>
            <option value={7}>v7 (Unix timestamp)</option>
            <option value={8}>v8 (Custom)</option>
          </select>
        </div>

        {(version === 3 || version === 5) && (
          <>
            <div className="control-group">
              <label htmlFor="namespace">Namespace</label>
              <select 
                id="namespace" 
                value={namespace} 
                onChange={(e) => setNamespace(e.target.value)}
              >
                <option value="">Select preset...</option>
                {NAMESPACE_PRESETS.map(ns => (
                  <option key={ns.name} value={ns.value}>{ns.name}</option>
                ))}
                <option value="custom">Custom...</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
          </>
        )}

        {version === 8 && (
          <div className="control-group">
            <label htmlFor="customData">Custom Data (32 hex chars)</label>
            <input
              id="customData"
              type="text"
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              placeholder="Optional: 32 hex characters"
              maxLength={32}
            />
          </div>
        )}

        <div className="control-group">
          <label htmlFor="count">Count</label>
          <input
            id="count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label htmlFor="format">Format</label>
          <select 
            id="format" 
            value={format} 
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="normal">Normal (with hyphens)</option>
            <option value="no-hyphen">No hyphens</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="outputType">Output Type</label>
          <select 
            id="outputType" 
            value={outputType} 
            onChange={(e) => setOutputType(e.target.value)}
          >
            <option value="newline">Newline separated</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <button 
          className="generate-btn" 
          onClick={handleGenerate}
          disabled={isGenerateDisabled}
        >
          Generate
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {uuids.length > 0 && (
        <div className="results">
          <div className="actions">
            <button className="action-btn" onClick={copyAll}>
              📋 Copy All
            </button>
            <div className="dropdown">
              <button className="action-btn dropdown-toggle">
                Download ▼
              </button>
              <div className="dropdown-content">
                <button onClick={() => downloadFile('txt')}>TXT</button>
                <button onClick={() => downloadFile('csv')}>CSV</button>
                <button onClick={() => downloadFile('json')}>JSON</button>
              </div>
            </div>
          </div>

          <div className="uuid-list">
            {uuids.map((uuid, index) => (
              <div key={index} className="uuid-item">
                <span className="line-number">{index + 1}.</span>
                <span className="uuid-text">{getFormattedUUID(uuid)}</span>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(getFormattedUUID(uuid))}
                  title="Copy"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <style>{`
        .uuid-generator {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .uuid-generator.dark {
          background: #1a1a2e;
          color: #eee;
          min-height: 100vh;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: ${darkMode ? '#fff' : '#333'};
        }

        .controls {
          background: ${darkMode ? '#16213e' : '#f5f5f5'};
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .control-group {
          margin-bottom: 15px;
        }

        .control-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: ${darkMode ? '#aaa' : '#555'};
        }

        .control-group select,
        .control-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid ${darkMode ? '#444' : '#ddd'};
          border-radius: 4px;
          font-size: 14px;
          background: ${darkMode ? '#1a1a2e' : '#fff'};
          color: ${darkMode ? '#fff' : '#333'};
        }

        .generate-btn {
          width: 100%;
          padding: 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .generate-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .generate-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #f44336;
          margin-top: 10px;
          padding: 10px;
          background: #ffebee;
          border-radius: 4px;
        }

        .results {
          background: ${darkMode ? '#16213e' : '#f5f5f5'};
          padding: 20px;
          border-radius: 8px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          position: relative;
        }

        .action-btn {
          padding: 10px 20px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .action-btn:hover {
          background: #1976D2;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: ${darkMode ? '#1a1a2e' : '#fff'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border-radius: 4px;
          z-index: 100;
          min-width: 120px;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .dropdown-content button {
          display: block;
          width: 100%;
          padding: 10px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: ${darkMode ? '#fff' : '#333'};
        }

        .dropdown-content button:hover {
          background: ${darkMode ? '#2a2a4e' : '#f0f0f0'};
        }

        .uuid-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .uuid-item {
          display: flex;
          align-items: center;
          padding: 10px;
          background: ${darkMode ? '#1a1a2e' : '#fff'};
          border-radius: 4px;
          margin-bottom: 8px;
          gap: 10px;
        }

        .line-number {
          color: ${darkMode ? '#888' : '#999'};
          font-size: 12px;
          min-width: 30px;
        }

        .uuid-text {
          flex: 1;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          word-break: break-all;
          color: ${darkMode ? '#fff' : '#333'};
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 5px;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .copy-btn:hover {
          opacity: 1;
        }

        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 24px;
          border-radius: 4px;
          color: white;
          font-weight: 600;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .toast.success {
          background: #4CAF50;
        }

        .toast.error {
          background: #f44336;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .uuid-generator {
            padding: 10px;
          }

          .actions {
            flex-direction: column;
          }

          .uuid-item {
            flex-wrap: wrap;
          }

          .uuid-text {
            order: 3;
            width: 100%;
            margin-top: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default UUIDGenerator;
