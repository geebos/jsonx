import React, { useState, useEffect } from 'react';
import { JsonNode } from '../types/json-tree';

interface JsonDetailProps {
  node: JsonNode;
  onClose: () => void;
  onCopyPath: (path: string) => void;
}

const JsonDetail: React.FC<JsonDetailProps> = ({
  node,
  onClose,
  onCopyPath
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(
      typeof node.value === 'object' 
        ? JSON.stringify(node.value, null, 2)
        : String(node.value)
    );
  }, [node.value]);

  const handleCopyPath = () => {
    onCopyPath(node.path);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="json-detail">
      <div className="json-detail-header">
        <div className="json-detail-path" onClick={handleCopyPath}>
          {node.path}
        </div>
        <button className="json-detail-close" onClick={onClose}>×</button>
      </div>
      <div className="json-detail-content">
        <textarea
          className="json-detail-value"
          value={value}
          onChange={handleValueChange}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default JsonDetail; 