import React from 'react';
import { JsonValueProps } from '../types/json-tree';

const JsonValue: React.FC<JsonValueProps> = ({ value, type, count }) => {
    const renderValue = () => {
        switch (type) {
            case 'string':
                return <span className="json-value-string">"{value}"</span>;
            case 'number':
                return <span className="json-value-number">{value}</span>;
            case 'boolean':
                return <span className="json-value-boolean">{value.toString()}</span>;
            case 'null':
                return <span className="json-value-null">null</span>;
            case 'object':
                return <span className="json-value-object">{`${count}`}</span>
            case 'array':
                return <span className="json-value-array">{`${count}`}</span>
            default:
                return <span className="json-value">{String(value)}</span>;
        }
    };

    return renderValue();
};

export default JsonValue; 