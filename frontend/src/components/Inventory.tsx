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
  const [sellPrice, setSellPrice] = useState<{ [key: number]: string }>({});

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
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleSell = async (inventoryItemId: number) => {
    const price = parseFloat(sellPrice[inventoryItemId]);
    if (!price || price <= 0) return alert("Podaj prawidłową cenę!");

    try {
      await api.post('/users/market/sell', {
        userId,
        inventoryItemId,
        price
      });
      alert("Wystawiono na rynek!");
      fetchInventory();
    } catch (err: any) {
      alert(err.response?.data?.message || "Błąd wystawiania");
    }
  };

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px' }}>Twój Ekwipunek 🎒</h3>
      <div style={styles.grid}>
        {items.map((entry: any) => (
          <div key={entry.id} style={{ 
            ...styles.itemCard, 
            borderColor: rarityColors[entry.item.rarity] || '#333',
            opacity: entry.listing ? 0.5 : 1
          }}>
            <div style={{ 
              ...styles.rarityTag, 
              backgroundColor: rarityColors[entry.item.rarity] 
            }}>
              {entry.item.rarity.toUpperCase()}
            </div>
            <p style={styles.itemName}>{entry.item.name}</p>
            
            {entry.listing ? (
              <p style={{ color: '#e67e22', fontWeight: 'bold' }}>
                Wystawiono za: {entry.listing.price} $
              </p>
            ) : (
              <div style={{ marginTop: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Cena $" 
                  style={styles.input}
                  value={sellPrice[entry.id] || ''}
                  onChange={(e) => setSellPrice({...sellPrice, [entry.id]: e.target.value})}
                />
                <button 
                  onClick={() => handleSell(entry.id)}
                  style={styles.sellBtn}
                >
                  Wystaw
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
  input: {
    width: '60%',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: 'white',
    marginRight: '5px'
  },
  sellBtn: {
    padding: '5px 10px',
    backgroundColor: '#e67e22',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

export default Inventory;