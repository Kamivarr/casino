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
  <div style={styles.page}>
    <div style={styles.card}>
      <h2 style={styles.title}>Casino Login</h2>
      <p style={styles.subtitle}>Witaj ponownie, graczu!</p>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Hasło" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Zaloguj się</button>
      </form>
      <p style={styles.footerText}>
        Nie masz konta? <Link to="/register" style={styles.link}>Zarejestruj się</Link>
      </p>
    </div>
  </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f', // Bardzo ciemny szary
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #333',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    marginBottom: '10px',
    letterSpacing: '1px',
  },
  subtitle: {
    color: '#888',
    marginBottom: '30px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#252525',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2ecc71', // Kasynowa zieleń
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '10px',
  },
  footerText: {
    marginTop: '25px',
    color: '#aaa',
    fontSize: '14px',
  },
  link: {
    color: '#2ecc71',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Login;