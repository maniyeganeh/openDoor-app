import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Spin, Select, Input } from 'antd';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const { Option } = Select;
const { Search } = Input;

interface User {
  _id: string;
  name?: string;
  email?: string;
  mobile?: string;
  developerPhone?: string;
  role: 'admin' | 'consultant' | 'developer';
  agencyName?: string;
  address?: string;
  isVerified: boolean;
}

const UsersList: React.FC = () => {
  const { state } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<
    'all' | 'consultant' | 'developer'
  >('all');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'verified' | 'pending'
  >('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${state.user?.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      message.error('خطا در دریافت اطلاعات کاربران');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (user: User) => {
    try {
      const url =
        user.role === 'consultant'
          ? `http://localhost:3000/api/admin/verify-consultant/${user._id}`
          : `http://localhost:3000/api/admin/verify-developer/${user._id}`;

      await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${state.user?.token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isVerified: true } : u))
      );

      message.success(
        `${user.role === 'consultant' ? 'مشاور' : 'سازنده'} تأیید شد`
      );
    } catch (err) {
      console.error(err);
      message.error('خطا در تأیید کاربر');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${state.user?.token}` },
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));

      message.success('کاربر حذف شد');
    } catch (err) {
      console.error(err);
      message.error('خطا در حذف کاربر');
    }
  };

  const filteredUsers = users.filter((user) => {
    if (user.role === 'admin') return false; // ادمین رو نمایش نمیدیم

    // فیلتر نقش
    if (filterRole !== 'all' && user.role !== filterRole) return false;

    // فیلتر وضعیت
    if (filterStatus === 'verified' && !user.isVerified) return false;
    if (filterStatus === 'pending' && user.isVerified) return false;

    // فیلتر سرچ
    const searchLower = searchText.toLowerCase();
    const matchName = user.name?.toLowerCase().includes(searchLower);
    const matchEmail = user.email?.toLowerCase().includes(searchLower);
    const matchPhone =
      user.mobile?.toLowerCase().includes(searchLower) ||
      user.developerPhone?.toLowerCase().includes(searchLower);

    return matchName || matchEmail || matchPhone;
  });

  const columns = [
    {
      title: 'نام',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: 'موبایل / شماره تماس',
      key: 'phone',
      render: (_: any, record: User) =>
        record.mobile || record.developerPhone || '-',
    },
    {
      title: 'ایمیل',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => text || '-',
    },
    {
      title: 'نقش',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color =
          role === 'admin'
            ? 'geekblue'
            : role === 'consultant'
            ? 'green'
            : 'volcano';
        const roleText =
          role === 'admin'
            ? 'ادمین'
            : role === 'consultant'
            ? 'مشاور'
            : 'سازنده';
        return <Tag color={color}>{roleText}</Tag>;
      },
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
    {
      title: 'آژانس / شرکت',
      dataIndex: 'agencyName',
      key: 'agencyName',
      render: (text: string) => text || '-',
    },
    {
      title: 'آدرس',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => text || '-',
    },
    {
      title: 'اقدامات',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          {!record.isVerified && record.role !== 'admin' && (
            <Button type="primary" onClick={() => handleVerify(record)}>
              تأیید
            </Button>
          )}
          {record.role !== 'admin' && (
            <Button danger onClick={() => handleDelete(record._id)}>
              حذف
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontFamily: 'Iran-sans-bold' }}>
        مدیریت کاربران
      </h2>

      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ marginRight: 8, fontFamily: 'Iran-sans-reg' }}>
            فیلتر نقش:
          </span>
          <Select
            value={filterRole}
            onChange={(val) => setFilterRole(val)}
            style={{
              width: 160,
              marginRight: '10px',
              fontFamily: 'Iran-sans-reg',
            }}
          >
            <Option value="all">همه</Option>
            <Option value="consultant">مشاور</Option>
            <Option value="developer">سازنده</Option>
          </Select>
        </div>

        <div>
          <span style={{ marginRight: 8, fontFamily: 'Iran-sans-reg' }}>
            فیلتر وضعیت:
          </span>
          <Select
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            style={{
              width: 160,
              marginRight: '10px',
              fontFamily: 'Iran-sans-reg',
            }}
          >
            <Option value="all">همه</Option>
            <Option value="verified">تأیید شده</Option>
            <Option value="pending">در انتظار تأیید</Option>
          </Select>
        </div>

        <div>
          <span style={{ marginRight: 8, fontFamily: 'Iran-sans-reg' }}>
            جستجو:
          </span>
          <Search
            placeholder="نام، ایمیل یا شماره تماس"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240, marginRight: '10px' }}
            allowClear
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}
    </div>
  );
};

export default UsersList;
