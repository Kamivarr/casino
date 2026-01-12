import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const rarityColors: { [key: string]: string } = {
  common: '#b0c3d9',
  rare: '#4b69ff',
  epic: '#8847ff',
  legendary: '#d32ce6',
};

const ITEM_WIDTH = 150; // Szerokość jednego kafelka w karuzeli
const WINNING_INDEX = 40; // Na której pozycji znajdzie się wygrany przedmiot

const Cases = ({ userId, onUpdate }: { userId: number; onUpdate: () => void }) => {
  const [cases, setCases] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rolledItem, setRolledItem] = useState<any>(null);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/cases').then(res => setCases(res.data));
  }, []);

  const openCase = async (caseId: number) => {
    if (isSpinning) return;

    try {
      // 1. Wywołanie API
      const res = await api.post(`/cases/${caseId}/open/${userId}`);
      const winner = res.data.item;
      const currentCase = cases.find(c => c.id === caseId);
      const ITEM_FULL_WIDTH = ITEM_WIDTH + 4;
      // Zabezpieczenie: Czy skrzynka ma przedmioty?
      if (!currentCase || !currentCase.items || currentCase.items.length === 0) {
        throw new Error("Ta skrzynka nie ma przypisanych przedmiotów w bazie!");
      }

      // 2. Przygotowanie przedmiotów do karuzeli
      const itemsForCarousel = [];
      for (let i = 0; i < 60; i++) {
        const randomItem = currentCase.items[Math.floor(Math.random() * currentCase.items.length)];
        itemsForCarousel.push(randomItem);
      }
      itemsForCarousel[WINNING_INDEX] = winner;

      setCarouselItems(itemsForCarousel);
      setRolledItem(null);
      setIsSpinning(true);
      setOffset(0);

      // 3. Czekamy krótką chwilę, aż Modal się wyrenderuje, żeby pobrać offsetWidth
      setTimeout(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          
          const randomFineTune = Math.floor(Math.random() * (ITEM_WIDTH - 40)) - (ITEM_WIDTH / 2 - 20);
          
          // 2. Użyj ITEM_FULL_WIDTH zamiast ITEM_WIDTH w mnożeniu
          const targetOffset = (WINNING_INDEX * ITEM_FULL_WIDTH) - (containerWidth / 2) + (ITEM_FULL_WIDTH / 2) + randomFineTune;
          
          setOffset(targetOffset);
        }
      }, 100);

      // 4. Koniec animacji
      setTimeout(() => {
        setIsSpinning(false);
        setRolledItem(winner);
        onUpdate(); 
      }, 7100); // 7s animacji + 100ms zapasu

    } catch (err: any) {
      console.error("Błąd szczegółowy:", err);
      // Jeśli błąd pochodzi z API (np. brak kasy), pokaże komunikat z serwera
      // Jeśli błąd to crash JS, pokaże domyślny tekst
      alert(err.response?.data?.message || err.message || "Błąd otwierania skrzynki");
      setIsSpinning(false);
    }
  };
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#fff' }}>Dostępne Skrzynki 📦</h3>
      <div style={styles.casesGrid}>
        {cases.map(c => (
          <div key={c.id} style={styles.caseCard}>
            <div style={styles.caseImage}>📦</div>
            <h4 style={{ color: '#fff' }}>{c.name}</h4>
            <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>{c.price} $</p>
            <button 
              disabled={isSpinning}
              onClick={() => openCase(c.id)}
              style={isSpinning ? styles.btnDisabled : styles.btn}
            >
              OTWÓRZ
            </button>
          </div>
        ))}
      </div>

      {/* MODAL / WIDOK KARUZELI */}
      {(isSpinning || rolledItem) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ color: '#fff' }}>{isSpinning ? 'Losowanie...' : 'GRATULACJE!'}</h2>
            
            <div style={styles.spinnerContainer} ref={containerRef}>
              <div style={styles.pointer}></div>
              <div 
                style={{
                  ...styles.carousel,
                  transform: `translateX(-${offset}px)`,
                  transition: isSpinning ? 'transform 7s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                }}
              >
                {carouselItems.map((item, idx) => (
                  <div key={idx} style={{ 
                    ...styles.carouselItem, 
                    borderBottom: `4px solid ${rarityColors[item.rarity]}` 
                  }}>
                    <div style={{fontSize: '30px'}}>🔫</div>
                    <div style={{fontSize: '11px', color: '#fff'}}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {rolledItem && !isSpinning && (
              <div style={styles.winInfo}>
                <h3 style={{ color: rarityColors[rolledItem.rarity] }}>{rolledItem.name}</h3>
                <button onClick={() => setRolledItem(null)} style={styles.closeBtn}>Super!</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  casesGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  caseCard: { backgroundColor: '#222', padding: '20px', borderRadius: '10px', textAlign: 'center', width: '150px' },
  caseImage: { fontSize: '50px', marginBottom: '10px' },
  btn: { padding: '10px 20px', backgroundColor: '#2ecc71', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnDisabled: { padding: '10px 20px', backgroundColor: '#555', border: 'none', borderRadius: '5px', cursor: 'not-allowed' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '80%', maxWidth: '800px', textAlign: 'center' },
  spinnerContainer: { position: 'relative', width: '100%', height: '150px', backgroundColor: '#111', overflow: 'hidden', border: '2px solid #333', marginTop: '20px' },
  pointer: { position: 'absolute', top: 0, left: '50%', width: '4px', height: '100%', backgroundColor: '#ff4d4d', zIndex: 10, transform: 'translateX(-50%)', boxShadow: '0 0 10px #ff4d4d' },
  carousel: { display: 'flex', height: '100%', alignItems: 'center' },
  carouselItem: { flexShrink: 0, width: `${ITEM_WIDTH}px`, height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', margin: '0 2px' },
  winInfo: { marginTop: '30px', animation: 'fadeIn 1s' },
  closeBtn: { padding: '10px 30px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }
};

export default Cases;