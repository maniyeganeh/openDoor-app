import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Spin,
  message,
  Table,
  Tag,
  Button,
  Space,
} from 'antd';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

interface User {
  _id: string;
  name?: string;
  role: 'consultant' | 'developer';
  isVerified: boolean;
}

interface Request {
  _id: string;
  type: 'verify' | 'update';
  user: {
    _id: string;
    name?: string;
    role: 'consultant' | 'developer';
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const DashboardHome: React.FC = () => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState({
    totalConsultants: 0,
    totalDevelopers: 0,
    pendingConsultants: 0,
    pendingDevelopers: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // کاربران
      const usersRes = await axios.get(
        'http://localhost:3000/api/admin/users',
        {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        }
      );
      const allUsers = usersRes.data as User[];
      setUsers(allUsers.slice(-5).reverse());
      setStats({
        totalConsultants: allUsers.filter((u) => u.role === 'consultant')
          .length,
        totalDevelopers: allUsers.filter((u) => u.role === 'developer').length,
        pendingConsultants: allUsers.filter(
          (u) => u.role === 'consultant' && !u.isVerified
        ).length,
        pendingDevelopers: allUsers.filter(
          (u) => u.role === 'developer' && !u.isVerified
        ).length,
      });

      // درخواست‌ها
      const reqRes = await axios.get(
        'http://localhost:3000/api/admin/requests',
        {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        }
      );
      setRequests(reqRes.data.slice(-5).reverse());
    } catch (err) {
      console.error(err);
      message.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/requests/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        }
      );
      message.success('درخواست تأیید شد');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('خطا در تأیید درخواست');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/requests/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${state.user?.token}` },
        }
      );
      message.success('درخواست رد شد');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('خطا در رد درخواست');
    }
  };

  const userColumns = [
    {
      title: 'نام',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: 'نقش',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'consultant' ? 'green' : 'volcano'}>
          {role === 'consultant' ? 'مشاور' : 'سازنده'}
        </Tag>
      ),
    },
    {
      title: 'وضعیت',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (verified: boolean) => (
        <Tag color={verified ? 'green' : 'red'}>
          {verified ? 'تأیید شده' : 'در انتظار تأیید'}
        </Tag>
      ),
    },
  ];

  const requestColumns = [
    {
      title: 'کاربر',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (text: string) => text || '-',
    },
    {
      title: 'نقش',
      dataIndex: ['user', 'role'],
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'consultant' ? 'green' : 'volcano'}>
          {role === 'consultant' ? 'مشاور' : 'سازنده'}
        </Tag>
      ),
    },
    {
      title: 'نوع درخواست',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) =>
        type === 'verify' ? 'تأیید کاربر' : 'ویرایش اطلاعات',
    },
    {
      title: 'تاریخ ثبت',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('fa-IR'),
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'pending'
              ? 'orange'
              : status === 'approved'
              ? 'green'
              : 'red'
          }
        >
          {status === 'pending'
            ? 'در انتظار بررسی'
            : status === 'approved'
            ? 'تأیید شده'
            : 'رد شده'}
        </Tag>
      ),
    },
    {
      title: 'اقدامات',
      key: 'actions',
      render: (_: any, record: Request) =>
        record.status === 'pending' && (
          <Space>
            <Button type="primary" onClick={() => handleApprove(record._id)}>
              تأیید
            </Button>
            <Button danger onClick={() => handleReject(record._id)}>
              رد
            </Button>
          </Space>
        ),
    },
  ];

  if (loading)
    return (
      <div className="text-center py-5">
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ fontFamily: 'Iran-sans-reg' }}>
      <h2>داشبورد مدیریت</h2>

      <Row gutter={16} style={{ margin: '20px 0' }}>
        <Col span={6}>
          <Card style={{ fontFamily: 'Iran-sans-reg' }}>
            <Statistic title="کل مشاورین" value={stats.totalConsultants} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="کل سازنده‌ها" value={stats.totalDevelopers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="مشاورین تأیید نشده"
              value={stats.pendingConsultants}
              valueStyle={{ color: 'red' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="سازنده‌های تأیید نشده"
              value={stats.pendingDevelopers}
              valueStyle={{ color: 'red' }}
            />
          </Card>
        </Col>
      </Row>

      <h3>آخرین کاربران ثبت‌شده</h3>
      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="_id"
        pagination={false}
        bordered
      />

      <h3 style={{ marginTop: 40 }}>درخواست‌های اخیر</h3>
      <Table
        columns={requestColumns}
        dataSource={requests}
        rowKey="_id"
        pagination={false}
        bordered
      />
    </div>
  );
};

export default DashboardHome;
