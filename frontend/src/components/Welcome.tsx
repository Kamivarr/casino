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

  // Pobieranie danych profilu na podstawie tokena
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const decoded: any = jwtDecode(token);
      const userId = decoded.sub || decoded.id;

      const response = await api.get(`/users/${userId}`); 
      setUser(response.data);
    } catch (error) {
      console.error("Błąd profilu:", error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie aktywnych ofert z rynku
  const fetchMarket = async () => {
    try {
      const res = await api.get('/users/market');
      setMarketListings(res.data);
    } catch (err) {
      console.error("Błąd rynku");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMarket();
    const interval = setInterval(fetchMarket, 5000);
    return () => clearInterval(interval);
  }, []);

  // Odświeżanie po otwarciu skrzynki
  const handleCaseOpened = () => {
    fetchUserData(); 
    setInventoryKey(prev => prev + 1); 
  };

  // Kupowanie przedmiotu
  const handleBuy = async (listingId: number, price: number) => {
    if (!user) return;
    if (user.balance < price) return alert("Za mało środków!");

    try {
      await api.post(`/users/market/buy/${listingId}`, { buyerId: user.id });
      alert("Zakup zakończony sukcesem!");
      fetchUserData(); 
      fetchMarket();   
      setInventoryKey(prev => prev + 1); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Błąd zakupu");
    }
  };

  // NOWOŚĆ: Anulowanie własnej oferty rynkowej
  const handleCancelListing = async (listingId: number) => {
    if (!user) return;
    try {
      // Wysyłamy userId w body, ponieważ zrezygnowaliśmy z JwtAuthGuard w tej metodzie
      await api.post(`/users/market/cancel/${listingId}`, { userId: user.id });
      alert("Oferta wycofana z rynku.");
      fetchMarket();
      setInventoryKey(prev => prev + 1); 
    } catch (err) {
      alert("Nie udało się anulować oferty.");
    }
  };

  // POPRAWKA: Bonus działający dla zalogowanego ID
  const handleAddFunds = async () => {
    if (!user) return;
    try {
      await api.post(`/users/${user.id}/bonus`);
      alert("Dodano bonus 100$!");
      fetchUserData(); 
    } catch (error) {
      alert("Błąd podczas odbierania bonusu");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.loadingText}>Synchronizacja danych...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.dashboardCard}>
        <header style={styles.header}>
          <div style={styles.userInfo}>
            <h1 style={styles.title}>Witaj, {user?.username}! 🎰</h1>
            <p style={styles.subtitle}>Konto aktywne (ID: {user?.id})</p>
          </div>
          <div style={styles.balanceContainer}>
            <span style={styles.balanceLabel}>DOSTĘPNE ŚRODKI</span>
            <span style={styles.balanceAmount}>{user?.balance?.toFixed(2)} $</span>
          </div>
        </header>

        <div style={styles.divider}></div>

        <main style={styles.main}>
          <h3 style={styles.sectionTitle}>Panel Zarządzania</h3>
          <div style={styles.actionsGrid}>
            <button onClick={handleAddFunds} style={styles.actionButton}>
              <span style={styles.btnIcon}>🎁</span>
              Odbierz Bonus (100$)
            </button>
          </div>

          {user && <Cases userId={user.id} onUpdate={handleCaseOpened} />}

          <div style={styles.divider}></div>

          <h3 style={styles.sectionTitle}>Rynek Marketplace 🛒</h3>
          {marketListings.length === 0 ? (
            <p style={{color: '#666'}}>Brak przedmiotów na sprzedaż.</p>
          ) : (
            <div style={styles.marketGrid}>
              {marketListings.map((listing: any) => (
                <div key={listing.id} style={styles.marketCard}>
                  <p style={styles.itemName}>{listing.inventoryItem.item.name}</p>
                  <p style={styles.sellerName}>Od: {listing.seller.username}</p>
                  <p style={styles.priceTag}>{listing.price} $</p>
                  
                  {listing.sellerId !== user?.id ? (
                    <button 
                      onClick={() => handleBuy(listing.id, listing.price)}
                      style={styles.buyBtn}
                    >
                      KUP TERAZ
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleCancelListing(listing.id)}
                      style={styles.cancelBtn}
                    >
                      WYCOFAJ Z RYNKU
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={styles.divider}></div>

          {user && <Inventory userId={user.id} key={inventoryKey} />}
        </main>

        <footer style={styles.footer}>
          <button onClick={logout} style={styles.logoutBtn}>
            Wyloguj się
          </button>
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', backgroundColor: '#0b0b0b', fontFamily: "'Inter', sans-serif", padding: '40px 20px' },
  loadingText: { color: '#2ecc71', fontSize: '18px' },
  dashboardCard: { backgroundColor: '#141414', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '1000px', border: '1px solid #222' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: '26px', margin: 0 },
  subtitle: { color: '#555', fontSize: '13px', marginTop: '4px' },
  balanceContainer: { backgroundColor: '#1a1a1a', padding: '12px 20px', borderRadius: '8px', borderLeft: '3px solid #2ecc71' },
  balanceLabel: { color: '#555', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' },
  balanceAmount: { color: '#2ecc71', fontSize: '24px', fontWeight: 'bold', display: 'block' },
  divider: { height: '1px', backgroundColor: '#222', margin: '30px 0' },
  sectionTitle: { color: '#fff', fontSize: '18px', marginBottom: '15px' },
  actionsGrid: { display: 'flex', gap: '15px', marginBottom: '30px' },
  actionButton: { padding: '15px 30px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  btnIcon: { fontSize: '20px' },
  marketGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' },
  marketCard: { backgroundColor: '#1d1d1d', padding: '15px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' },
  itemName: { color: '#fff', fontWeight: 'bold', marginBottom: '5px' },
  sellerName: { color: '#666', fontSize: '12px', marginBottom: '10px' },
  priceTag: { color: '#2ecc71', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' },
  buyBtn: { width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  footer: { marginTop: '40px', textAlign: 'center' },
  logoutBtn: { backgroundColor: 'transparent', color: '#555', border: 'none', cursor: 'pointer', textDecoration: 'underline' }
};

export default Welcome;