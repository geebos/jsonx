import React from 'react';
import { JsonNode } from '../types/json-tree';

interface JsonContextMenuProps {
  node: JsonNode;
  x: number;
  y: number;
  onClose: () => void;
  onCopyValue: (value: any) => void;
  onCopyPath: (path: string) => void;
  onExpandAll: (node: JsonNode) => void;
  onCollapseAll: (node: JsonNode) => void;
}

const JsonContextMenu: React.FC<JsonContextMenuProps> = ({
  node,
  x,
  y,
  onClose,
  onCopyValue,
  onCopyPath,
  onExpandAll,
  onCollapseAll
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCopyValue = () => {
    onCopyValue(node.value);
    onClose();
  };

  const handleCopyPath = () => {
    onCopyPath(node.path);
    onClose();
  };

  const handleExpandAll = () => {
    onExpandAll(node);
    onClose();
  };

  const handleCollapseAll = () => {
    onCollapseAll(node);
    onClose();
  };

  return (
    <>
      <div 
        className="json-context-menu-overlay"
        onClick={onClose}
      />
      <div 
        className="json-context-menu"
        style={{ left: x, top: y }}
        onClick={handleClick}
      >
        <div className="json-context-menu-item" onClick={handleCopyValue}>
          复制值
        </div>
        <div className="json-context-menu-item" onClick={handleCopyPath}>
          复制路径
        </div>
        {(node.type === 'object' || node.type === 'array') && (
          <>
            <div className="json-context-menu-separator" />
            <div className="json-context-menu-item" onClick={handleExpandAll}>
              展开所有子节点
            </div>
            <div className="json-context-menu-item" onClick={handleCollapseAll}>
              折叠所有子节点
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JsonContextMenu; 