import React, { useEffect, useState } from 'react';
import { fetchStoryArcs, createStoryArc } from '../api/storyarc';

export default function StoryArcsPage() {
  const [storyArcs, setStoryArcs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Сюжетні арки DungeonQuill</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Назва арки"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Опис..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <br />
        <button type="submit">Створити арку</button>
      </form>

      <ul>
        {storyArcs.map((arc) => (
          <li key={arc.id}>
            <strong>{arc.title}</strong>: {arc.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
