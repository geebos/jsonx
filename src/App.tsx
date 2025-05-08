import React from 'react';
import JsonTree from './components/JsonTree';
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
  return (
    <div className="app">
      <div className="app-content">
        <div className="json-tree-container">
          <JsonTree data={sampleData} />
        </div>
      </div>
    </div>
  );
};

export default App; 