// src/pages/admin/components/Header.tsx
import React from 'react';
import { Layout } from 'antd';
import { useAuth } from '../../../context/AuthContext';

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const { state } = useAuth();
  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        fontFamily: 'Iran-sans-bold',
      }}
    >
      <h3>سلام {state.user?.name || 'ادمین'} 👋</h3>
    </Header>
  );
};

export default HeaderBar;
