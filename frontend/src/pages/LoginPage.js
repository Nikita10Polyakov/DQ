import React, { useState } from 'react';
import { loginUser } from '../api/auth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem('access', res.data.access);
      alert('Успішний вхід!');
    } catch (err) {
      alert('Помилка входу');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Пароль" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Увійти</button>
    </form>
  );
}
