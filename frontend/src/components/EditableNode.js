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

const nodeStyle = {
  padding: '0.5rem',
  border: '2px solid #6c5ce7',
  borderRadius: '8px',
  background: '#fff',
  minWidth: '130px',
  textAlign: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
};

const inputStyle = {
  border: 'none',
  background: 'transparent',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  width: '100%',
  textAlign: 'center',
  outline: 'none',
};
