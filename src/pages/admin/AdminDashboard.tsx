// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/Header';
import DashboardHome from './pages/DashboardHome';
import UsersList from './pages/UsersList';
import RequestsList from './pages/RequestsList';

const { Content } = Layout;

const AdminDashboard: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        direction: 'rtl',
      }}
    >
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
