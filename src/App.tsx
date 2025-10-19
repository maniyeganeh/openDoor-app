import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ConsultantDashboard from './pages/consultant/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';

function App() {
  return (
    <ConfigProvider locale={faIR} direction="rtl">
      <Router>
        <Routes>
          {/* ریدایرکت پیش‌فرض */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* صفحات عمومی */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* داشبورد مشاور / سازنده */}
          <Route
            path="/consultant/*"
            element={
              <ProtectedRoute allowedRoles={['consultant', 'developer']}>
                <ConsultantDashboard />
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

          {/* مسیرهای اشتباه */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
