import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/users/', {
        email,
        username,
        password,
      });
      navigate('/login');
    } catch (err) {
      setError('Не вдалося створити користувача');
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2>📝 Реєстрація</h2>
        {error && <p style={{ color: 'salmon' }}>{error}</p>}
        <input
          type="text"
          placeholder="Імʼя користувача"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
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
        <button type="submit" style={buttonStyle}>Зареєструватися</button>
      </form>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #8e44ad, #6c5ce7)',
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
  background: '#8e44ad',
  color: 'white',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
