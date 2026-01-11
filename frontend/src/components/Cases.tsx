import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Cases = ({ userId, onUpdate }: any) => {
  const [cases, setCases] = useState([]);

  const fetchCases = async () => {
    try {
      const res = await api.get('/cases');
      setCases(res.data);
    } catch (err) {
      console.error("Błąd pobierania skrzynek");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpen = async (caseId: number) => {
    try {
      const res = await api.post(`/cases/${caseId}/open/${userId}`);
      alert(`🎉 Wylosowano: ${res.data.item.name}!`);
      onUpdate(); // Odśwież dane użytkownika w Welcome.tsx
    } catch (err) {
      alert("Niewystarczające środki lub błąd serwera");
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px' }}>Dostępne Skrzynki</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {cases.map((c: any) => (
          <div key={c.id} style={cardStyle}>
            <h4 style={{ color: '#fff', margin: '0 0 10px 0' }}>{c.name}</h4>
            <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>{c.price.toFixed(2)} $</p>
            <button onClick={() => handleOpen(c.id)} style={buttonStyle}>OTWÓRZ</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#252525',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #333',
  textAlign: 'center' as const
};

const buttonStyle = {
  backgroundColor: '#2ecc71',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  marginTop: '10px'
};

export default Cases;