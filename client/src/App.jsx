import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobOrders from './pages/JobOrders';
import JobOrderDetail from './pages/JobOrderDetail';
import CreateJobOrder from './pages/CreateJobOrder';
import Materials from './pages/Materials';
import Vendors from './pages/Vendors';
import CreateVendor from './pages/CreateVendor';
import Inventory from './pages/Inventory';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import { authService } from './services/authService';

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="job-orders" element={<JobOrders />} />
        <Route path="job-orders/:id" element={<JobOrderDetail />} />
        {/* Only Admin and Supervisor can create job orders */}
        <Route 
          path="job-orders/create" 
          element={
            <RoleBasedRoute allowedRoles={['Admin', 'Supervisor']}>
              <CreateJobOrder />
            </RoleBasedRoute>
          } 
        />
        {/* Only Admin and Supervisor can access materials, vendors, and inventory */}
        <Route 
          path="materials" 
          element={
            <RoleBasedRoute allowedRoles={['Admin', 'Supervisor']}>
              <Materials />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="vendors" 
          element={
            <RoleBasedRoute allowedRoles={['Admin', 'Supervisor']}>
              <Vendors />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="vendors/create" 
          element={
            <RoleBasedRoute allowedRoles={['Admin', 'Supervisor']}>
              <CreateVendor />
            </RoleBasedRoute>
          } 
        />
        <Route 
          path="inventory" 
          element={
            <RoleBasedRoute allowedRoles={['Admin', 'Supervisor']}>
              <Inventory />
            </RoleBasedRoute>
          } 
        />
      </Route>
    </Routes>
    </ThemeProvider>
  );
}

export default App;

