import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)'
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    padding: '2rem',
    minHeight: '100vh'
  }
};

export default DashboardLayout;