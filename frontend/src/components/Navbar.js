import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    navigate('/');
  };

  if (!isLoggedIn) return null;

  return (
    <div
      style={{
        padding: '1rem',
        background: '#2c3e50',
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        🚪 Вийти
      </button>
    </div>
  );
}
