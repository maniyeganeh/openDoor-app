import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';

interface BottomNavProps {
  selectedKey: string;
  onSelect: (e: { key: string }) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ selectedKey, onSelect }) => (
  <Menu
    mode="horizontal"
    selectedKeys={[selectedKey]}
    onClick={onSelect}
    style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #ddd',
    }}
  >
    <Menu.Item key="home" icon={<HomeOutlined />}>
      خانه
    </Menu.Item>
    <Menu.Item key="requests" icon={<ProfileOutlined />}>
      درخواست‌ها
    </Menu.Item>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      پروفایل
    </Menu.Item>
  </Menu>
);

export default BottomNav;
