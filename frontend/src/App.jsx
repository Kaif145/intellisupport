import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Tickets from './pages/Tickets';
import EmbedCode from './pages/EmbedCode';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#fff',
              border: '1px solid #2a2a3e'
            }
          }}
        />
        <Routes>

          {/* {home routes } */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          {/* Public routes */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/documents" element={
            <ProtectedRoute><Documents /></ProtectedRoute>
          }/>
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          }/>
          <Route path="/analytics" element={
            <ProtectedRoute><Analytics /></ProtectedRoute>
          }/>
          <Route path="/tickets" element={
            <ProtectedRoute><Tickets /></ProtectedRoute>
          }/>
          <Route path="/embed" element={
            <ProtectedRoute><EmbedCode /></ProtectedRoute>
          }/>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;