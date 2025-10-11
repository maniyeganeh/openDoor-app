import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* صفحات عمومی */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* داشبورد کاربر (مشاور / سازنده) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['consultant', 'developer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* داشبورد ادمین */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
