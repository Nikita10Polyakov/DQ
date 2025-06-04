import React, { useEffect, useState } from 'react';
import { fetchStoryArcs } from '../api/storyarc';

export default function StoryArcsPage() {
  const [storyArcs, setStoryArcs] = useState([]);

  useEffect(() => {
    fetchStoryArcs()
      .then(data => setStoryArcs(data))
      .catch(err => console.error('Помилка завантаження арок:', err));
  }, []);

  return (
    <div>
      <h2>Сюжетні арки DungeonQuill</h2>
      <ul>
        {storyArcs.map(arc => (
          <li key={arc.id}>
            <strong>{arc.title}</strong>: {arc.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
