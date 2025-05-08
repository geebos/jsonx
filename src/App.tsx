import React, { useState } from 'react';
import JsonTree from './components/JsonTree';
import { JsonNode } from './types/json-tree';
import './styles/json-tree.css';
import './styles/app.css';

const sampleData = {
  name: "John Doe",
  age: 30,
  isActive: true,
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "gaming", "coding"],
  scores: [95, 88, 92],
  metadata: {
    createdAt: "2024-03-20",
    tags: ["user", "premium"],
    settings: {
      theme: "dark",
      notifications: true
    }
  }
};

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<JsonNode | null>(null);

  const handleNodeClick = (node: JsonNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="app">
      <div className="app-content">
        <div className="json-tree-container">
          <JsonTree data={sampleData} onNodeClick={handleNodeClick} />
        </div>
        {selectedNode && (
          <div className="json-detail-container">
            <div className="json-detail-header">
              <h2>节点详情</h2>
            </div>
            <div className="json-detail-content">
              <div className="json-path">路径: {selectedNode.path}</div>
              <div className="json-value">
                <pre>{JSON.stringify(selectedNode.value, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 