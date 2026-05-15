import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '▦', label: 'Dashboard' },
  { path: '/documents', icon: '📄', label: 'Documents' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/tickets', icon: '🎫', label: 'Tickets' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
  { path: '/embed', icon: '🔗', label: 'Embed Code' },
];

const Sidebar = () => {
  const { company, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>IS</div>
        <span style={styles.logoText}>IntelliSupport</span>
      </div>

      {/* Company info */}
      <div style={styles.companyInfo}>
        <div style={styles.companyAvatar}>
          {company?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.companyDetails}>
          <div style={styles.companyName}>{company?.name}</div>
          <div style={styles.companyPlan}>{company?.plan} plan</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--muted)'
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <span>↩</span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '2rem',
    paddingLeft: '0.5rem'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff'
  },
  logoText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text)'
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.75rem',
    background: 'var(--surface2)',
    borderRadius: '10px',
    marginBottom: '1.5rem'
  },
  companyAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    flexShrink: 0
  },
  companyDetails: {
    overflow: 'hidden'
  },
  companyName: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  companyPlan: {
    fontSize: '0.75rem',
    color: 'var(--muted)',
    textTransform: 'capitalize'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.7rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    textDecoration: 'none'
  },
  navIcon: {
    fontSize: '1rem',
    width: '20px',
    textAlign: 'center'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.7rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--muted)',
    background: 'none',
    border: 'none',
    width: '100%',
    transition: 'color 0.2s',
    marginTop: '0.5rem'
  }
};

export default Sidebar;