import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import API from '../services/api';

function MyItems() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await API.get('/items/my-items');
      setItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/items/${id}`);
        fetchMyItems();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      title: item.title,
      description: item.description,
      location: item.location,
      status: item.status,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/items/${id}`, editData);
      setEditingId(null);
      fetchMyItems();
    } catch (err) {
      alert('Failed to update');
    }
  };

  if (loading) return (
    <div>
      <Header />
      <div style={styles.loading}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h2 style={styles.title}>My Items</h2>
        {items.length === 0 ? (
          <p style={styles.empty}>You haven't reported any items yet.</p>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} style={styles.card}>
                {editingId === item.id ? (
                  <div>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      style={styles.editInput}
                      placeholder="Title"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      style={styles.editTextarea}
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      style={styles.editInput}
                      placeholder="Location"
                    />
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      style={styles.editInput}
                    >
                      <option value="open">Open</option>
                      <option value="claimed">Claimed</option>
                      <option value="returned">Returned</option>
                    </select>
                    <div style={styles.editButtons}>
                      <button onClick={() => handleUpdate(item.id)} style={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={styles.cardBadge}>
                      <span style={item.type === 'lost' ? styles.lostBadge : styles.foundBadge}>
                        {item.type === 'lost' ? 'LOST' : 'FOUND'}
                      </span>
                    </div>
                    {item.photo_url && (
                      <img 
                        src={`http://localhost:5000${item.photo_url}`} 
                        alt={item.title}
                        style={styles.cardImage}
                      />
                    )}
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{item.title}</h3>
                      <p style={styles.cardLocation}>📍 {item.location}</p>
                      <p><strong>Status:</strong> 
                        <span style={item.status === 'open' ? styles.statusOpen : styles.statusClaimed}>
                          {' '}{item.status}
                        </span>
                      </p>
                      <p><strong>Description:</strong> {item.description}</p>
                      <div style={styles.buttonGroup}>
                        <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
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
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#1a1a2e',
    borderLeft: '4px solid #e94560',
    paddingLeft: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  cardBadge: {
    padding: '15px 15px 0 15px',
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
    height: '200px',
    objectFit: 'cover',
    marginTop: '10px',
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
    marginBottom: '10px',
  },
  statusOpen: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  statusClaimed: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  buttonGroup: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px',
  },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '10px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  editInput: {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  editTextarea: {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '80px',
  },
  editButtons: {
    marginTop: '10px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#999',
    fontSize: '16px',
  },
};

export default MyItems;
