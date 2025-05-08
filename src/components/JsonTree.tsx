import React, { useMemo, useState, useEffect } from 'react';
import { JsonNode } from '../types/json-tree';
import JsonNodeComponent from './JsonNode';
import JsonDetail from './JsonDetail';
import Toast from './Toast';

interface JsonTreeProps {
  data: any;
}

interface ToastMessage {
  id: number;
  message: string;
}

const JsonTree: React.FC<JsonTreeProps> = ({ data }) => {
  const buildTree = (value: any, path: string = '$', key: string = ''): JsonNode => {
    let type: JsonNode['type'];
    if (value === null) {
      type = 'null';
    } else if (Array.isArray(value)) {
      type = 'array';
    } else if (typeof value === 'object') {
      type = 'object';
    } else if (typeof value === 'string') {
      type = 'string';
    } else if (typeof value === 'number') {
      type = 'number';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else {
      type = 'string'; // 默认类型
    }

    const node: JsonNode = {
      type,
      value,
      path,
      key,
      children: type === 'object' || type === 'array' ? [] : undefined
    };

    if (type === 'object') {
      node.children = Object.entries(value).map(([k, v]) => 
        buildTree(v, `${path}.${k}`, k)
      );
    } else if (type === 'array') {
      node.children = value.map((v: any, i: number) => 
        buildTree(v, `${path}[${i}]`, i.toString())
      );
    }

    return node;
  };

  const tree = useMemo(() => buildTree(data), [data]);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initialExpandedNodes = new Set<string>();
    const traverse = (node: JsonNode) => {
      if (node.type === 'object' || node.type === 'array') {
        initialExpandedNodes.add(node.path);
        node.children?.forEach(traverse);
      }
    };
    traverse(tree);
    return initialExpandedNodes;
  });

  const [selectedNode, setSelectedNode] = useState<JsonNode | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleExpandAll = () => {
    const newExpandedNodes = new Set<string>();
    const traverse = (node: JsonNode) => {
      if (node.type === 'object' || node.type === 'array') {
        newExpandedNodes.add(node.path);
        node.children?.forEach(traverse);
      }
    };
    traverse(tree);
    setExpandedNodes(newExpandedNodes);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleCopyValue = async (value: any) => {
    try {
      const text = typeof value === 'object' 
        ? JSON.stringify(value, null, 2)
        : String(value);
      await navigator.clipboard.writeText(text);
      showToast('复制值成功');
    } catch (error) {
      console.error('复制失败:', error);
      showToast('复制失败');
    }
  };

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      showToast('复制路径成功');
    } catch (error) {
      console.error('复制失败:', error);
      showToast('复制失败');
    }
  };

  const handleExpandNode = (node: JsonNode) => {
    const newExpandedNodes = new Set(expandedNodes);
    const traverse = (n: JsonNode) => {
      if (n.type === 'object' || n.type === 'array') {
        newExpandedNodes.add(n.path);
        n.children?.forEach(traverse);
      }
    };
    traverse(node);
    setExpandedNodes(newExpandedNodes);
  };

  const handleCollapseNode = (node: JsonNode) => {
    const newExpandedNodes = new Set(expandedNodes);
    const traverse = (n: JsonNode) => {
      if (n.type === 'object' || n.type === 'array') {
        newExpandedNodes.delete(n.path);
        n.children?.forEach(traverse);
      }
    };
    traverse(node);
    setExpandedNodes(newExpandedNodes);
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && (e.metaKey || e.ctrlKey)) {
        if (selectedNode) {
          e.preventDefault();
          
          if (e.shiftKey) {
            await handleCopyPath(selectedNode.path);
          } else {
            await handleCopyValue(selectedNode.value);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode]);

  return (
    <div className="json-tree">
      <div className="json-tree-toolbar">
        <button onClick={handleExpandAll}>展开所有</button>
        <button onClick={handleCollapseAll}>折叠所有</button>
      </div>
      <JsonNodeComponent
        node={tree}
        onNodeClick={setSelectedNode}
        expandedNodes={expandedNodes}
        onToggleNode={(path: string) => {
          const newExpandedNodes = new Set(expandedNodes);
          if (newExpandedNodes.has(path)) {
            newExpandedNodes.delete(path);
          } else {
            newExpandedNodes.add(path);
          }
          setExpandedNodes(newExpandedNodes);
        }}
        onCopyValue={handleCopyValue}
        onCopyPath={handleCopyPath}
        onExpandAll={handleExpandNode}
        onCollapseAll={handleCollapseNode}
        selectedNode={selectedNode}
      />
      {selectedNode && (
        <JsonDetail
          node={selectedNode}
          onClose={() => setSelectedNode(undefined)}
          onCopyValue={handleCopyValue}
          onCopyPath={handleCopyPath}
        />
      )}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default JsonTree; 