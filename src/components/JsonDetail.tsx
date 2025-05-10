import React, { useState, useEffect, useRef } from 'react';
import { JsonNode } from '../types/json-tree';
import { compressJson, escapeString, unescapeString } from '../core/json';
import { flushSync } from 'react-dom';

interface JsonDetailProps {
  node: JsonNode;
  onClose: () => void;
  onCopyPath: (path: string) => void;
  onUpdateValue: (path: string, value: any) => void;
}

const DEFAULT_SIZE = { width: 550, height: 600 };
const STORAGE_KEY = 'json-detail-size';

const JsonDetail: React.FC<JsonDetailProps> = ({
  node,
  onClose,
  onCopyPath,
  onUpdateValue
}) => {
  const [value, setValue] = useState<string>('');
  const [isInitial, setIsInitial] = useState(false);
  const [size, setSize] = useState(() => {
    const savedSize = localStorage.getItem(STORAGE_KEY);
    return savedSize ? JSON.parse(savedSize) : DEFAULT_SIZE;
  });
  const detailRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    let value = typeof node.value === 'object' ? JSON.stringify(node.value, null, 2) : String(node.value);
    setValue(value);
    setIsInitial(true);
  }, [node.value]);

  useEffect(() => {
    if (isInitial) {
      focusAndSelect();
      setIsInitial(false);
    }
  }, [value]);  

  const focusAndSelect = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      textareaRef.current.focus();
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(size));
  }, [size]);

  const handleCopyPath = () => {
    onCopyPath(node.path);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!detailRef.current) return;

    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width: size.width, height: size.height };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !detailRef.current) return;

    const deltaX = startPos.current.x - e.clientX;
    const deltaY = e.clientY - startPos.current.y;

    const newWidth = Math.max(300, Math.min(800, startSize.current.width + deltaX));
    const newHeight = Math.max(200, Math.min(800, startSize.current.height + deltaY));

    setSize({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleCompress = () => {
    flushSync(() => {
      setValue(compressJson(value));
    });
    focusAndSelect();
  };

  const handleCompressEscape = () => {
    flushSync(() => {
      setValue(escapeString(compressJson(value)));
    });
    focusAndSelect();
  };

  const handleUnescape = () => {
    flushSync(() => {
      setValue(unescapeString(value));
    });
    focusAndSelect();
  };

  const handleUpdate = () => {
    try {
      const parsedValue = JSON.parse(value);
      onUpdateValue(node.path, parsedValue);
      onClose();
    } catch (e) {
      console.error('Update failed:', e);
      onUpdateValue(node.path, value);
      onClose();
    }
  };

  return (
    <div
      className="json-detail"
      ref={detailRef}
      style={{ width: size.width, height: size.height }}
    >
      <div className="json-detail-header">
        <div className="json-detail-path" onClick={handleCopyPath}>
          {node.path}
        </div>
        <button className="json-detail-close" onClick={onClose}>×</button>
      </div>
      <div className="json-detail-toolbar">
        <button className="json-detail-toolbar-btn" title="压缩转义" onClick={handleCompressEscape}>
          压缩转义
        </button>
        <button className="json-detail-toolbar-btn" title="压缩" onClick={handleCompress}>
          压缩
        </button>
        <button className="json-detail-toolbar-btn" title="去除转义" onClick={handleUnescape}>
          去除转义
        </button>
        <button className="json-detail-toolbar-btn" title="修改" onClick={handleUpdate}>
          修改
        </button>
      </div>
      <div className="json-detail-content">
        <textarea
          ref={textareaRef}
          className="json-detail-value"
          value={value}
          onChange={handleValueChange}
          onFocus={(e) => e.target.select()}
          spellCheck={false}
        />
      </div>
      <div className="json-detail-resize-handle" onMouseDown={handleMouseDown} />
    </div>
  );
};

export default JsonDetail; 