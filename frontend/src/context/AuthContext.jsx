import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on app start
    const savedToken = localStorage.getItem('token');
    const savedCompany = localStorage.getItem('company');

    if (savedToken && savedCompany) {
      setToken(savedToken);
      setCompany(JSON.parse(savedCompany));
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, companyData) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('company', JSON.stringify(companyData));
    setToken(tokenValue);
    setCompany(companyData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    setToken(null);
    setCompany(null);
  };

  const updateCompany = (updatedData) => {
    const updated = { ...company, ...updatedData };
    localStorage.setItem('company', JSON.stringify(updated));
    setCompany(updated);
  };

  return (
    <AuthContext.Provider value={{ 
      company, 
      token, 
      loading,
      login, 
      logout,
      updateCompany,
      isLoggedIn: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);