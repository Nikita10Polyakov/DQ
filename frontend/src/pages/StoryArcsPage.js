import React, { useEffect, useState } from 'react';
import {
  fetchStoryArcs,
  createStoryArc,
  updateStoryArc,
  deleteStoryArc,
} from '../api/storyarc';
import { useNavigate } from 'react-router-dom';

export default function StoryArcsPage() {
  const [storyArcs, setStoryArcs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStoryArcs();
  }, []);

  const loadStoryArcs = async () => {
    try {
      const data = await fetchStoryArcs();
      setStoryArcs(data);
    } catch (error) {
      console.error('Помилка завантаження арок:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createStoryArc({ title, description });
      setTitle('');
      setDescription('');
      loadStoryArcs();
    } catch (error) {
      console.error('Помилка створення арки:', error);
    }
  };

  const handleEdit = (arc) => {
    setEditingId(arc.id);
    setEditTitle(arc.title);
    setEditDescription(arc.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStoryArc(editingId, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      loadStoryArcs();
    } catch (error) {
      console.error('Помилка оновлення арки:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Точно видалити цю арку?')) {
      try {
        await deleteStoryArc(id);
        loadStoryArcs();
      } catch (error) {
        console.error('Помилка видалення арки:', error);
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📖 Мої сюжетні арки</h2>

      <form onSubmit={handleCreate} style={formStyle}>
        <input
          type="text"
          placeholder="Назва арки"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Короткий опис..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'none' }}
        />
        <button type="submit" style={buttonStyle}>➕ Створити</button>
      </form>

      <div style={listStyle}>
        {storyArcs.map((arc) => (
          <div key={arc.id} style={cardStyle}>
            {editingId === arc.id ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={inputStyle}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" style={buttonStyle}>💾 Зберегти</button>
                  <button onClick={() => setEditingId(null)} style={cancelButtonStyle}>❌ Скасувати</button>
                </div>
              </form>
            ) : (
              <>
                <h3>🧩 {arc.title}</h3>
                <p>{arc.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleEdit(arc)} style={buttonStyle}>✏️ Редагувати</button>
                  <button onClick={() => handleDelete(arc.id)} style={deleteButtonStyle}>🗑 Видалити</button>
                  <button
                    onClick={() => navigate(`/story-arcs/${arc.id}/editor`)}
                    style={{ ...buttonStyle, backgroundColor: '#0984e3' }}
                  >
                    🧠 Редактор
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// === Стилі ===

const containerStyle = {
  maxWidth: '800px',
  margin: '3rem auto',
  padding: '1rem',
  fontFamily: 'Segoe UI, sans-serif',
  background: 'linear-gradient(135deg, #f9f9f9, #e6ecf0)',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  fontSize: '2.5rem',
  marginBottom: '2rem',
  textAlign: 'center',
  color: '#2d3436',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '3rem',
  background: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  backgroundColor: '#fdfdfd',
};

const buttonStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#6c5ce7',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: '0.3s ease',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#e74c3c',
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#b2bec3',
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const cardStyle = {
  padding: '1.25rem',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderLeft: '4px solid #6c5ce7',
};
