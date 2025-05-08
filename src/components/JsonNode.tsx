import React from 'react';
import { JsonNodeProps } from '../types/json-tree';
import JsonValue from './JsonValue';

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
    >
      <div
        className="json-node-content"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {renderExpandIcon()}
        {node.key && <span className="json-node-key">{node.key}:</span>}
        <JsonValue value={node.value} type={node.type} count={node.children?.length} />
      </div>
      {renderChildren()}
    </div>
  );
};

export default JsonNode; 