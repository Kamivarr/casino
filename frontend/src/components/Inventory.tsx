import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const rarityColors: { [key: string]: string } = {
  common: '#b0c3d9',
  rare: '#4b69ff',
  epic: '#8847ff',
  legendary: '#d32ce6',
};

const Inventory = ({ userId }: { userId: number }) => {
  const [items, setItems] = useState<any[]>([]);

  const fetchInventory = async () => {
    try {
      const res = await api.get(`/users/${userId}/inventory`);
      setItems(res.data);
    } catch (err) {
      console.error("Błąd pobierania ekwipunku");
    }
  };

  useEffect(() => {
    if (userId) fetchInventory();
    // Odświeżaj co 5 sekund, aby widzieć nowe dropy bez przeładowania
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px' }}>Twój Ekwipunek 🎒</h3>
      <div style={styles.grid}>
        {items.map((entry: any) => (
          <div key={entry.id} style={{ 
            ...styles.itemCard, 
            borderColor: rarityColors[entry.item.rarity] || '#333' 
          }}>
            <div style={{ 
              ...styles.rarityTag, 
              backgroundColor: rarityColors[entry.item.rarity] 
            }}>
              {entry.item.rarity.toUpperCase()}
            </div>
            <p style={styles.itemName}>{entry.item.name}</p>
            <p style={styles.itemPrice}>{entry.item.price.toFixed(2)} $</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  itemCard: {
    backgroundColor: '#1a1a1a',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  rarityTag: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#000',
    fontWeight: 'bold' as const,
    display: 'inline-block',
    marginBottom: '10px',
  },
  itemName: {
    color: '#fff',
    fontSize: '14px',
    margin: '5px 0',
  },
  itemPrice: {
    color: '#666',
    fontSize: '12px',
    margin: 0,
  }
};

export default Inventory;