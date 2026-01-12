import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import Cases from './Cases'; 
import Inventory from './Inventory'; 
import { jwtDecode } from 'jwt-decode';

const Welcome = () => {
  const [user, setUser] = useState<any>(null);
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryKey, setInventoryKey] = useState(0); 
  const navigate = useNavigate();

const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Powrót do logowania, jeśli brak tokena
        return;
      }

      // Dekodujemy token, aby wyciągnąć z niego sub (ID użytkownika)
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub || decoded.id; // Zależy jak Twój backend nazywa pole ID w tokenie

      // Teraz używamy dynamicznego userId zamiast "1"
      const response = await api.get(`/users/${userId}`); 
      setUser(response.data);
    } catch (error) {
      console.error("Błąd pobierania danych użytkownika:", error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarket = async () => {
    try {
      const res = await api.get('/users/market');
      setMarketListings(res.data);
    } catch (err) {
      console.error("Błąd pobierania rynku");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMarket();
    // Odświeżanie rynku co 5s
    const interval = setInterval(fetchMarket, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCaseOpened = () => {
    fetchUserData(); 
    setInventoryKey(prev => prev + 1); 
  };

  const handleBuy = async (listingId: number, price: number) => {
    if (!user) return;
    if (user.balance < price) return alert("Za mało środków!");

    try {
      await api.post(`/users/market/buy/${listingId}`, { buyerId: user.id });
      alert("Kupiono przedmiot!");
      fetchUserData(); // Odśwież balans
      fetchMarket();   // Odśwież rynek
      setInventoryKey(prev => prev + 1); // Odśwież ekwipunek (nowy przedmiot)
    } catch (err: any) {
      alert(err.response?.data?.message || "Błąd zakupu");
    }
  };

  const handleAddFunds = async () => {
    try {
      await api.post('/users/1/add-funds');
      fetchUserData(); 
    } catch (error) {
      alert("Nie udało się dodać środków");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.loadingText}>Ładowanie profilu...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.dashboardCard}>
        <header style={styles.header}>
          <div style={styles.userInfo}>
            <h1 style={styles.title}>Witaj, {user?.username || 'Graczu'}! 🎰</h1>
            <p style={styles.subtitle}>ID Użytkownika: {user?.id}</p>
          </div>
          <div style={styles.balanceContainer}>
            <span style={styles.balanceLabel}>TWÓJ BALANS</span>
            <span style={styles.balanceAmount}>{user?.balance?.toFixed(2)} $</span>
          </div>
        </header>

        <div style={styles.divider}></div>

        <main style={styles.main}>
          <h3 style={styles.sectionTitle}>Szybkie akcje</h3>
          <div style={styles.actionsGrid}>
            <button onClick={handleAddFunds} style={styles.actionButton}>
              <span style={styles.btnIcon}>💰</span>
              Odbierz bonus 100$
            </button>
          </div>

          {user && (
            <Cases 
              userId={user.id} 
              onUpdate={handleCaseOpened} 
            />
          )}

          <div style={styles.divider}></div>

          {/* SEKCJA RYNKU */}
          <h3 style={styles.sectionTitle}>Rynek Graczy 🛒</h3>
          {marketListings.length === 0 ? (
            <p style={{color: '#666'}}>Brak ofert na rynku.</p>
          ) : (
            <div style={styles.marketGrid}>
              {marketListings.map((listing: any) => (
                <div key={listing.id} style={styles.marketCard}>
                  <p style={{color: '#fff', fontWeight: 'bold'}}>{listing.inventoryItem.item.name}</p>
                  <p style={{color: '#aaa', fontSize: '12px'}}>Sprzedawca: {listing.seller.username}</p>
                  <p style={{color: '#2ecc71', fontSize: '18px', fontWeight: 'bold'}}>{listing.price} $</p>
                  {listing.sellerId !== user?.id && (
                    <button 
                      onClick={() => handleBuy(listing.id, listing.price)}
                      style={styles.buyBtn}
                    >
                      KUP TERAZ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={styles.divider}></div>

          {user && (
            <Inventory 
              userId={user.id} 
              key={inventoryKey} 
            />
          )}
        </main>

        <footer style={styles.footer}>
          <button onClick={logout} style={styles.logoutBtn}>
            Wyloguj się bezpiecznie
          </button>
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingTop: '50px',
    paddingBottom: '50px',
  },
  loadingText: {
    color: '#2ecc71',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  dashboardCard: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    width: '100%',
    maxWidth: '900px',
    border: '1px solid #333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    margin: 0,
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    margin: '5px 0 0 0',
  },
  balanceContainer: {
    backgroundColor: '#252525',
    padding: '15px 25px',
    borderRadius: '10px',
    borderLeft: '4px solid #2ecc71',
    textAlign: 'right',
  },
  balanceLabel: {
    display: 'block',
    color: '#888',
    fontSize: '12px',
    letterSpacing: '1px',
    marginBottom: '5px',
  },
  balanceAmount: {
    color: '#2ecc71',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  divider: {
    height: '1px',
    backgroundColor: '#333',
    margin: '30px 0',
  },
  main: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '18px',
    marginBottom: '20px',
  },
  actionsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  actionButton: {
    flex: '0 1 250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  btnIcon: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  // Style dla Rynku
  marketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  marketCard: {
    backgroundColor: '#252525',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #444',
    textAlign: 'center' as const,
  },
  buyBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default Welcome;