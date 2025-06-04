import React, { useState } from 'react';
import { registerUser } from '../api/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Реєстрація успішна!');
    } catch (err) {
      alert('Помилка реєстрації');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input placeholder="Імʼя користувача" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Пароль" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Зареєструватись</button>
    </form>
  );
}
