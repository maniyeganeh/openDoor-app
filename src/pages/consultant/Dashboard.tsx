import React, { useState } from 'react';
import { Layout, Menu, Badge } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import RequestsList from './pages/RequestsList';
import VisitForm from './pages/VisitForm';
import Profile from './pages/Profile';

const { Header, Content, Sider } = Layout;

const ConsultantDashboard: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('home');

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return (
          <div style={{ padding: 20 }}>
            <h2 style={{ fontFamily: 'Iran-sans-reg' }}>خوش آمدید 👋</h2>
            <p>
              از منو سمت راست برای مدیریت درخواست‌ها و بازدیدها استفاده کنید.
            </p>
          </div>
        );
      case 'requests':
        return <RequestsList />;
      case 'visit':
        return <VisitForm />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={200}
        style={{ background: '#fff', borderLeft: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            padding: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Iran-sans-reg',
          }}
        >
          پنل مشاور
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['home']}
          onClick={(e) => setSelectedKey(e.key)}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: 'صفحه اصلی' },
            {
              key: 'requests',
              icon: <FileTextOutlined />,
              label: 'درخواست‌ها',
            },
            { key: 'visit', icon: <PlusOutlined />, label: 'ثبت بازدید' },
            { key: 'profile', icon: <UserOutlined />, label: 'پروفایل' },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontFamily: 'Iran-sans-reg' }}>داشبورد مشاور</div>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: '16px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ConsultantDashboard;
