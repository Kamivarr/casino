import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom'; // Dodano Link

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/welcome');
    } catch (error) {
      alert('Błąd logowania! Sprawdź dane.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logowanie do Casino</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        /><br/><br/>
        <input 
          type="password" 
          placeholder="Hasło" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        /><br/><br/>
        <button type="submit">Zaloguj się</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Nie masz konta? <Link to="/register">Zarejestruj się tutaj</Link>
      </p>
    </div>
  );
};

export default Login;