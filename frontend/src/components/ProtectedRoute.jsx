import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f0f14',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;