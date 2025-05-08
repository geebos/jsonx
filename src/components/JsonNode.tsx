import React, { useState } from 'react';
import { JsonNodeProps } from '../types/json-tree';
import JsonValue from './JsonValue';
import JsonContextMenu from './JsonContextMenu';

const JsonNode: React.FC<JsonNodeProps> = ({ 
  node, 
  onNodeClick, 
  expandedNodes,
  onToggleNode,
  onCopyValue,
  onCopyPath,
  onExpandAll,
  onCollapseAll,
  selectedNode
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const isExpanded = expandedNodes?.has(node.path) ?? true;
  const isSelected = selectedNode?.path === node.path;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleNode?.(node.path);
  };

  const handleClick = () => {
    onNodeClick?.(node);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'object' || node.type === 'array') {
      onToggleNode?.(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const renderExpandIcon = () => {
    if (node.type === 'object' || node.type === 'array') {
      return (
        <span 
          className="json-node-expand-icon"
          onClick={handleToggle}
          title={isExpanded ? "折叠" : "展开"}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
      );
    }
    return null;
  };

  const renderChildren = () => {
    if (!isExpanded || !node.children) return null;
    
    return (
      <div className="json-node-children">
        {node.children.map((child, index) => (
          <JsonNode
            key={child.key || index}
            node={child}
            onNodeClick={onNodeClick}
            expandedNodes={expandedNodes}
            onToggleNode={onToggleNode}
            onCopyValue={onCopyValue}
            onCopyPath={onCopyPath}
            onExpandAll={onExpandAll}
            onCollapseAll={onCollapseAll}
            selectedNode={selectedNode}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`json-node ${isSelected ? 'json-node-selected' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <div 
        className="json-node-content" 
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {renderExpandIcon()}
        {node.key && <span className="json-node-key">{node.key}:</span>}
        <JsonValue value={node.value} type={node.type} count={node.children?.length}/>
      </div>
      {renderChildren()}
      {contextMenu && (
        <JsonContextMenu
          node={node}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onCopyValue={onCopyValue}
          onCopyPath={onCopyPath}
          onExpandAll={onExpandAll}
          onCollapseAll={onCollapseAll}
        />
      )}
    </div>
  );
};

export default JsonNode; 