import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import API from '../services/api';

function AddItem() {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    date_reported: new Date().toISOString().split('T')[0],
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('date_reported', formData.date_reported);
      if (photo) {
        data.append('photo', photo);
      }

      await API.post('/items', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.formContainer}>
        <div style={styles.card}>
          <h2 style={styles.title}>Report an Item</h2>
          <p style={styles.subtitle}>Help someone find what they've lost or return what you've found</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <select name="type" value={formData.type} onChange={handleChange} style={styles.input}>
              <option value="lost">Lost Item</option>
              <option value="found">Found Item</option>
            </select>
            
            <input
              type="text"
              name="title"
              placeholder="Item Title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
            
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
            
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
            
            <input
              type="date"
              name="date_reported"
              value={formData.date_reported}
              onChange={handleChange}
              style={styles.input}
              required
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '550px',
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    minHeight: '100px',
  },
  fileInput: {
    margin: '10px 0',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e94560',
    textAlign: 'center',
    marginBottom: '15px',
  },
};

export default AddItem;
