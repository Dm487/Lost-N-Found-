import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.header}>
      <div style={styles.logoArea}>
        <Link to="/dashboard" style={styles.logoLink}>
          <div style={styles.logoIcon}>🔍</div>
          <div style={styles.logoText}>
            <span style={styles.logoMain}>Lost & Found</span>
            <span style={styles.logoSub}>ZUCT</span>
          </div>
        </Link>
      </div>
      
      {isAuthenticated && (
        <div style={styles.navArea}>
          <Link to="/dashboard" style={styles.navLink}>Home</Link>
          <Link to="/add-item" style={styles.navLink}>Report Item</Link>
          <Link to="/my-items" style={styles.navLink}>My Items</Link>
          <Link to="/claims" style={styles.navLink}>Claims</Link>
          <div style={styles.userArea}>
            <span style={styles.userName}>👤 {user?.full_name?.split(' ')[0] || 'User'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '32px',
    backgroundColor: '#e94560',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoMain: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  },
  logoSub: {
    fontSize: '12px',
    color: '#e94560',
  },
  navArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.3s',
    fontSize: '14px',
    fontWeight: '500',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginLeft: '20px',
    paddingLeft: '20px',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
  },
  userName: {
    fontSize: '14px',
    color: '#e94560',
  },
  logoutBtn: {
    padding: '6px 16px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
};

export default Header;
