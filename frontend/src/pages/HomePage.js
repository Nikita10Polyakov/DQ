import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2b2b52, #4e54c8)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧙 DungeonQuill</h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px', textAlign: 'center', marginBottom: '2rem' }}>
        Створи інтерактивні сюжетні арки для своєї гри в Dungeons & Dragons. Керуй, розгалужуй, повертай!
      </p>

      {isLoggedIn ? (
        <>
            <p style={{ marginBottom: '1rem' }}>👋 Вітаємо назад!</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                onClick={() => navigate('/story-arcs')}
                style={buttonStyle('#27ae60')}
                >
                📖 До арок
                </button>
                <button
                onClick={() => {
                    localStorage.removeItem('access');
                    navigate('/');
                }}
                style={buttonStyle('#c0392b')}
                >
                🚪 Вийти
                </button>
            </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={buttonStyle('#2980b9')}
          >
            🔐 Увійти
          </button>
          <button
            onClick={() => navigate('/register')}
            style={buttonStyle('#8e44ad')}
          >
            📝 Зареєструватися
          </button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: '0.3s',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
});

