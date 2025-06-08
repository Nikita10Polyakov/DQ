// === NodeSidebar.js ===
import React, { useEffect, useState } from 'react';

export default function NodeSidebar({ node, onChange, onClose, onAnyFieldFocus }) {
  const labelRaw = node?.data?.label ?? '';
  const details = node?.data?.details ?? {};
  const type = node?.data?.type ?? '';

  const [label, setLabel] = useState(labelRaw);
  const [description, setDescription] = useState(details.description ?? '');
  const [notes, setNotes] = useState(details.notes ?? '');
  const [tags, setTags] = useState((details.tags ?? []).join(', '));
  const [difficulty, setDifficulty] = useState(details.difficulty ?? 1);

  useEffect(() => {
    if (!node) return;
    const { label, details = {} } = node.data;
    setLabel(label || '');
    setDescription(details.description || '');
    setNotes(details.notes || '');
    setTags((details.tags || []).join(', '));
    setDifficulty(details.difficulty || 1);
  }, [node]);

  useEffect(() => {
    if (!node) return;
    onChange(node.id, {
      ...node.data,
      label,
      details: {
        description,
        notes,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty,
      },
    });
  }, [label, description, notes, tags, difficulty]);

  if (!node) return null;

  return (
    <div style={sidebarStyle}>
      <button style={closeButtonStyle} onClick={onClose}>×</button>
      <h3>🧩 Вузол</h3>

      <label>Назва:</label>
      <input
        type="text"
        value={label}
        onFocus={onAnyFieldFocus}
        onChange={(e) => setLabel(e.target.value)}
        style={inputStyle}
      />

      <p><strong>Тип:</strong> {type}</p>

      <label>Опис:</label>
      <textarea
        value={description}
        onFocus={onAnyFieldFocus}
        onChange={(e) => setDescription(e.target.value)}
        style={textareaStyle}
      />

      <label>Нотатки:</label>
      <textarea
        value={notes}
        onFocus={onAnyFieldFocus}
        onChange={(e) => setNotes(e.target.value)}
        style={textareaStyle}
      />

      <label>Теги (через кому):</label>
      <input
        type="text"
        value={tags}
        onFocus={onAnyFieldFocus}
        onChange={(e) => setTags(e.target.value)}
        style={inputStyle}
      />

      <label>Складність: {difficulty}</label>
      <input
        type="range"
        min={1}
        max={5}
        value={difficulty}
        onFocus={onAnyFieldFocus}
        onChange={(e) => setDifficulty(parseInt(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}

const sidebarStyle = {
  position: 'absolute',
  top: '0px',
  right: 0,
  width: '300px',
  height: 'calc(100%)',
  background: '#f1f2f6',
  borderLeft: '1px solid #ccc',
  padding: '1rem',
  overflowY: 'auto',
  zIndex: 100,
};

const closeButtonStyle = {
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

const textareaStyle = {
  width: '100%',
  minHeight: '60px',
  marginBottom: '1rem',
};

const inputStyle = {
  width: '100%',
  marginBottom: '1rem',
};
