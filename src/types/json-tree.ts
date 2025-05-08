export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = JsonValue[];

export type JsonValueType = 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array';

export interface JsonNode {
  type: JsonValueType;
  value: any;
  path: string;
  key: string;
  children?: JsonNode[];
}

export interface JsonTreeProps {
  data: JsonValue;
  onNodeClick?: (node: JsonNode) => void;
}

export interface JsonNodeProps {
  node: JsonNode;
  onNodeClick?: (node: JsonNode) => void;
  level?: number;
  expandedNodes?: Set<string>;
  onToggleNode?: (path: string) => void;
  onCopyValue?: (value: any) => void;
  onCopyPath?: (path: string) => void;
  onExpandAll?: (node: JsonNode) => void;
  onCollapseAll?: (node: JsonNode) => void;
  selectedNode?: JsonNode;
}

export interface JsonValueProps {
  value: any;
  type: JsonValueType;
  count?: number;
} 