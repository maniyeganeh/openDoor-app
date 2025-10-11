// src/pages/admin/components/Sidebar.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const items = [
    {
      key: '/admin',
      icon: <HomeOutlined />,
      label: 'داشبورد',
      onClick: () => navigate('/admin'),
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'کاربران (مشاورین و سازنده‌ها)',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: '/admin/requests',
      icon: <FileDoneOutlined />,
      label: 'درخواست‌ها',
      onClick: () => navigate('/admin/requests'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'خروج',
      onClick: handleLogout,
    },
  ];

  return (
    <Sider collapsible>
      <div
        style={{
          color: '#fff',
          padding: '16px',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
          fontFamily: 'Iran-sans-bold',
        }}
      >
        پنل ادمین
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ fontFamily: 'Iran-sans-reg' }}
      />
    </Sider>
  );
};

export default Sidebar;
