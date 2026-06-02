import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import API from '../services/api';

function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await API.get('/items');
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Lost But Found</h1>
        <p style={styles.heroSubtitle}>Report lost items • Find what's missing • Reunite with your belongings</p>
      </div>
      
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Recent Items</h2>
        {items.length === 0 ? (
          <p style={styles.empty}>No items reported yet. Be the first to report!</p>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardBadge}>
                  <span style={item.type === 'lost' ? styles.lostBadge : styles.foundBadge}>
                    {item.type === 'lost' ? 'LOST' : 'FOUND'}
                  </span>
                </div>
                {item.photo_url ? (
                  <img 
                    src={`http://localhost:5000${item.photo_url}`} 
                    alt={item.title}
                    style={styles.cardImage}
                  />
                ) : (
                  <div style={styles.noImage}>
                    <span>📷</span>
                    <p>No image</p>
                  </div>
                )}
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardLocation}>📍 {item.location}</p>
                  <p style={styles.cardStatus}>
                    <span style={item.status === 'open' ? styles.statusOpen : styles.statusClaimed}>
                      {item.status}
                    </span>
                  </p>
                  <p style={styles.cardReporter}>Reported by: {item.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '15px',
    letterSpacing: '2px',
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  sectionTitle: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#1a1a2e',
    borderLeft: '4px solid #e94560',
    paddingLeft: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardBadge: {
    position: 'relative',
    padding: '10px 15px',
  },
  lostBadge: {
    display: 'inline-block',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  foundBadge: {
    display: 'inline-block',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '220px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#1a1a2e',
  },
  cardLocation: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  cardStatus: {
    marginBottom: '10px',
  },
  statusOpen: {
    display: 'inline-block',
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusClaimed: {
    display: 'inline-block',
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardReporter: {
    fontSize: '12px',
    color: '#999',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#999',
    fontSize: '16px',
  },
};

export default Dashboard;
