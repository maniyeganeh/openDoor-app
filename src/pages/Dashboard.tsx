import React from 'react';
import { Button } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>سلام {state.user?.name || 'کاربر'} 👋</h2>
      <p>نقش شما: {state.user?.role}</p>
      <Button danger onClick={handleLogout}>
        خروج
      </Button>
    </div>
  );
};

export default Dashboard;
