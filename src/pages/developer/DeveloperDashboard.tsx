import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import RequestsList from './pages/RequestsList'; // درخواست‌ها
import VisitsCalendar from './pages/VisitsCalendar'; // تقویم بازدیدها

import DeveloperProfile from './pages/DeveloperProfile';
// import History from './pages/History'; // تاریخچه بازدیدها

const { Header, Content, Sider } = Layout;

const DeveloperDashboard: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('home');

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return (
          <div style={{ padding: 20 }}>
            <h2 style={{ fontFamily: 'Iran-sans-reg' }}>خوش آمدید 👋</h2>
            <p>
              از منوی سمت راست برای مدیریت درخواست‌ها، بازدیدها و پروفایل خود
              استفاده کنید.
            </p>
          </div>
        );
      case 'requests':
        return <RequestsList />;
      case 'visits':
        return <VisitsCalendar />;
      case 'profile':
        return <DeveloperProfile />;
      //   case 'history':
      //     return <History />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', direction: 'rtl' }}>
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
          پنل سازنده
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
            { key: 'visits', icon: <CalendarOutlined />, label: 'بازدیدها' },
            {
              key: 'history',
              icon: <HistoryOutlined />,
              label: 'تاریخچه بازدیدها',
            },
            { key: 'profile', icon: <UserOutlined />, label: 'پروفایل' },
          ]}
        />
      </Sider>

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
          <div style={{ fontFamily: 'Iran-sans-reg' }}>داشبورد سازنده</div>
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

export default DeveloperDashboard;
