import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/jwt/create/', {
        email,
        password,
      });
      localStorage.setItem('access', response.data.access);
      navigate('/story-arcs');
    } catch (err) {
      setError('Невірна пошта або пароль');
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2>🔐 Вхід</h2>
        {error && <p style={{ color: 'salmon' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Увійти</button>
      </form>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #3c3b6e, #6b59d3)',
};

const formStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '300px',
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  background: '#6b59d3',
  color: 'white',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
