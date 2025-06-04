import React, { useState } from 'react';
import { Handle } from 'reactflow';

export default function EditableNode({ id, data, isConnectable }) {
  const [label, setLabel] = useState(data.label);

  return (
    <div style={{ padding: 10, border: '1px solid #222', borderRadius: 8, background: 'white' }}>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => data.onChange(id, label)}
        style={{ width: 150, border: 'none', outline: 'none' }}
      />
      <Handle type="target" position="top" isConnectable={isConnectable} />
      <Handle type="source" position="bottom" isConnectable={isConnectable} />
    </div>
  );
}
