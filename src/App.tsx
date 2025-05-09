import { useState, useRef, useEffect } from 'react';
import JsonTree from './components/JsonTree';
import './styles/json-tree.css';
import './styles/app.css';

function App() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 示例数据
  const exampleData = {
    name: "示例数据",
    version: "1.0.0",
    items: [
      { id: 1, value: "项目 1" },
      { id: 2, value: "项目 2" }
    ],
    settings: {
      enabled: true,
      maxItems: 100
    }
  };

  // 组件挂载时设置焦点并全选内容
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleFormat = () => {
    try {
      const text = textareaRef.current?.value || '';
      const parsed = JSON.parse(text);
      setJsonData(parsed);
      setError(null);
      setShowInput(false);
    } catch (e) {
      setError('无效的 JSON 格式');
      setJsonData(null);
    }
  };

  const handleBack = () => {
    setShowInput(true);
    setJsonData(null);
  };

  return (
    <>
      {showInput ? (
        <div className="app-container">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              defaultValue={JSON.stringify(exampleData, null, 2)}
              className="json-input"
              placeholder="请输入 JSON 数据..."
            />
            <button onClick={handleFormat} className="format-button">
              格式化
            </button>
          </div>
        </div>
      ) : <JsonTree data={jsonData} />}

      {error && <div className="error-message">{error}</div>}
    </>
  );
}

export default App; 