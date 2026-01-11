import React, { useState } from 'react';
import api from '../api/axios'; //
import { useNavigate, Link } from 'react-router-dom'; //

const Register = () => {
  const [username, setUsername] = useState(''); //
  const [email, setEmail] = useState(''); //
  const [password, setPassword] = useState(''); //
  const navigate = useNavigate(); //

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); //
    try {
      // Wysyłamy dane zgodnie z CreateUserDto z backendu
      await api.post('/auth/register', { 
        username, 
        email, 
        password 
      }); //
      alert('Rejestracja udana! Teraz możesz się zalogować.'); //
      navigate('/'); //
    } catch (error: any) {
      const message = error.response?.data?.message || 'Błąd rejestracji'; //
      alert(message); //
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Załóż konto</h2>
        <p style={styles.subtitle}>Dołącz do gry w naszym Casino</p>
        
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Nazwa użytkownika" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          
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
              placeholder="Hasło (min. 6 znaków)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.button}>Zarejestruj się</button>
        </form>
        
        <p style={styles.footerText}>
          Masz już konto? <Link to="/" style={styles.link}>Zaloguj się</Link>
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
    backgroundColor: '#0f0f0f',
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
    backgroundColor: '#2ecc71',
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

export default Register;