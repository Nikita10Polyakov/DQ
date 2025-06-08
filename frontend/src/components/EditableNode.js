import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const EditableNode = ({ data, id }) => {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleBlur = () => {
    setEditing(false);
    data.onChange?.(id, label);
  };

  const borderColor = {
    scene: '#0984e3', // синій
    npc: '#6c5ce7',   // фіолетовий
    event: '#fdcb6e', // жовтий
  }[data.type] || '#636e72';

  const background = {
    scene: '#dfe6e9',
    npc: '#e4d7f5',
    event: '#fff3bf',
  }[data.type] || '#ffffff';

  const emoji = {
    scene: '📘',
    npc: '🧙‍♂️',
    event: '🎲',
  }[data.type] || '📍';

  return (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        padding: 10,
        borderRadius: 8,
        background,
        minWidth: 120,
        textAlign: 'center',
        fontWeight: 500,
        fontSize: '0.9rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{emoji} {label}</span>
      )}
      <Handle type="target" position={Position.Top} style={{ background: '#ccc' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#ccc' }} />
    </div>
  );
};

export default EditableNode;
