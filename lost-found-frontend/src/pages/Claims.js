import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import API from '../services/api';

function Claims() {
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const [myRequests, received] = await Promise.all([
        API.get('/claims/my-requests'),
        API.get('/claims/received'),
      ]);
      setMyClaims(myRequests.data);
      setReceivedClaims(received.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimResponse = async (claimId, status) => {
    const adminMessage = prompt('Message to the claimant:');
    try {
      await API.put(`/claims/${claimId}`, { status, admin_message: adminMessage });
      alert(`Claim ${status}!`);
      fetchClaims();
    } catch (err) {
      alert('Failed to update claim');
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
        <h2 style={styles.title}>Claims Management</h2>
        
        <div style={styles.tabs}>
          <button 
            onClick={() => setActiveTab('received')} 
            style={activeTab === 'received' ? styles.activeTab : styles.tab}
          >
            Claims on My Items ({receivedClaims.length})
          </button>
          <button 
            onClick={() => setActiveTab('my')} 
            style={activeTab === 'my' ? styles.activeTab : styles.tab}
          >
            My Claim Requests ({myClaims.length})
          </button>
        </div>

        {activeTab === 'received' && (
          <div>
            {receivedClaims.length === 0 ? (
              <p style={styles.empty}>No one has requested any of your items yet.</p>
            ) : (
              <div style={styles.grid}>
                {receivedClaims.map((claim) => (
                  <div key={claim.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{claim.title}</h3>
                    <p><strong>Claimant:</strong> {claim.claimant_name}</p>
                    <p><strong>Email:</strong> {claim.claimant_email}</p>
                    <p><strong>Proof provided:</strong> "{claim.proof_message}"</p>
                    <p><strong>Status:</strong> 
                      <span style={claim.status === 'pending' ? styles.pending : (claim.status === 'approved' ? styles.approved : styles.denied)}>
                        {' '}{claim.status}
                      </span>
                    </p>
                    {claim.status === 'pending' && (
                      <div style={styles.buttonGroup}>
                        <button 
                          onClick={() => handleClaimResponse(claim.id, 'approved')} 
                          style={styles.approveBtn}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          onClick={() => handleClaimResponse(claim.id, 'denied')} 
                          style={styles.denyBtn}
                        >
                          ✗ Deny
                        </button>
                      </div>
                    )}
                    {claim.admin_message && (
                      <p style={styles.message}><strong>Response:</strong> {claim.admin_message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div>
            {myClaims.length === 0 ? (
              <p style={styles.empty}>You haven't requested any items yet.</p>
            ) : (
              <div style={styles.grid}>
                {myClaims.map((claim) => (
                  <div key={claim.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{claim.title}</h3>
                    <p><strong>Owner:</strong> {claim.owner_name}</p>
                    <p><strong>Location:</strong> {claim.location}</p>
                    <p><strong>Your proof:</strong> "{claim.proof_message}"</p>
                    <p><strong>Status:</strong> 
                      <span style={claim.status === 'pending' ? styles.pending : (claim.status === 'approved' ? styles.approved : styles.denied)}>
                        {' '}{claim.status}
                      </span>
                    </p>
                    {claim.admin_message && (
                      <p style={styles.message}><strong>Response from owner:</strong> {claim.admin_message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
  tabs: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px',
  },
  tab: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
  },
  activeTab: {
    padding: '10px 24px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#1a1a2e',
  },
  pending: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  approved: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  denied: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  approveBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    flex: 1,
  },
  denyBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    flex: 1,
  },
  message: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    fontSize: '14px',
    color: '#666',
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

export default Claims;
