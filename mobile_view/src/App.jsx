import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MobileLayout from './layouts/MobileLayout';
import DeviceSimulator from './components/DeviceSimulator';

// Pages
import Login from './pages/Login';
import ConfigScreen from './pages/ConfigScreen';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import SPCAnalytics from './pages/SPCAnalytics';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import AdminPage from './pages/AdminPage';
import ProductSummary from './pages/ProductSummary';
import FactoryOverview from './pages/FactoryOverview';
import MachineDetail from './pages/MachineDetail';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  return (
    <ThemeProvider>
      <DeviceSimulator>
        <BrowserRouter>
          <Routes>
          {/* Default home route is now Login */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/config" element={<ConfigScreen />} />
          
          {/* Main App Routes */}
          <Route path="/app" element={<MobileLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="summary" element={<ProductSummary />} />
            <Route path="monitoring" element={<LiveMonitoring />} />
            <Route path="analytics" element={<SPCAnalytics />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="user-config" element={<UserManagement />} />
            <Route path="factory" element={<FactoryOverview />} />
            <Route path="machine/:id" element={<MachineDetail />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </DeviceSimulator>
    </ThemeProvider>
  );
}
