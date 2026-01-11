import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Wysyłamy dane zgodnie z CreateUserDto z backendu
      await api.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      alert('Rejestracja udana! Teraz możesz się zalogować.');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd rejestracji';
      alert(message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Załóż konto w Casino</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Nazwa użytkownika" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        /><br/><br/>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        /><br/><br/>
        <input 
          type="password" 
          placeholder="Hasło (min. 6 znaków)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        /><br/><br/>
        <button type="submit">Zarejestruj się</button>
      </form>
      <p>Masz już konto? <Link to="/">Zaloguj się</Link></p>
    </div>
  );
};

export default Register;