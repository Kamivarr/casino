import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Witaj w naszym systemie! 🎉</h1>
      <p>Udało Ci się pomyślnie zalogować.</p>
      <button onClick={logout}>Wyloguj</button>
    </div>
  );
};

export default Welcome;