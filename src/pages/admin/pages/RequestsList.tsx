import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Spin, Input, Select } from 'antd';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const { Search } = Input;
const { Option } = Select;

interface RequestItem {
  _id: string;
  consultant?: {
    name?: string;
    email?: string;
    mobile?: string;
  };
  project?: {
    name?: string;
    developerName?: string;
  };
  role?: 'consultant' | 'developer';
  status?: string;
  createdAt?: string;
}

const RequestsList: React.FC = () => {
  const { state } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/admin/requests', {
        headers: { Authorization: `Bearer ${state.user?.token}` },
      });
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.error(err);
      message.error('خطا در دریافت درخواست‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${state.user?.token}` } }
      );
      message.success('درخواست تأیید شد');
      fetchRequests();
    } catch (err) {
      console.error(err);
      message.error('خطا در تأیید درخواست');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/requests/${id}`, {
        headers: { Authorization: `Bearer ${state.user?.token}` },
      });
      message.success('درخواست حذف شد');
      setRequests((prev) => prev.filter((r) => r._id !== id));
      setFilteredRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      message.error('خطا در حذف درخواست');
    }
  };

  const handleFilter = (value: string) => {
    setRoleFilter(value);
    filterData(searchText, value);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, roleFilter);
  };

  const filterData = (text: string, role: string) => {
    let data = [...requests];
    if (role !== 'all') data = data.filter((r) => r.role === role);
    if (text) {
      data = data.filter(
        (r) =>
          r.consultant?.name?.includes(text) ||
          r.consultant?.email?.includes(text) ||
          r.consultant?.mobile?.includes(text) ||
          r.project?.name?.includes(text) ||
          r.project?.developerName?.includes(text)
      );
    }
    setFilteredRequests(data);
  };

  const columns = [
    {
      title: 'مشاور',
      dataIndex: ['consultant', 'name'],
      key: 'consultant',
      render: (t: string) => t || '-',
    },
    {
      title: 'ایمیل',
      key: 'email',
      render: (_: any, record: RequestItem) => record.consultant?.email || '-',
    },
    {
      title: 'شماره تماس',
      key: 'mobile',
      render: (_: any, record: RequestItem) => record.consultant?.mobile || '-',
    },
    {
      title: 'پروژه',
      key: 'project',
      render: (_: any, record: RequestItem) => record.project?.name || '-',
    },
    {
      title: 'سازنده',
      key: 'developer',
      render: (_: any, record: RequestItem) =>
        record.project?.developerName || '-',
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
      title: 'تاریخ درخواست',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) =>
        t ? new Date(t).toLocaleDateString('fa-IR') : '-',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'gold' : 'blue'}>
          {status === 'pending' ? 'در انتظار تأیید' : 'تأیید شده'}
        </Tag>
      ),
    },
    {
      title: 'اقدامات',
      key: 'actions',
      render: (_: any, record: RequestItem) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleApprove(record._id)}
            disabled={record.status === 'approved'}
          >
            تأیید
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            حذف
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontFamily: 'Iran-sans-bold' }}>
        درخواست‌ها
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Select defaultValue="all" onChange={handleFilter}>
          <Option value="all">همه</Option>
          <Option value="consultant">مشاورین</Option>
          <Option value="developer">سازندگان</Option>
        </Select>
        <Search
          placeholder="جستجو بر اساس نام یا پروژه"
          onSearch={handleSearch}
          enterButton
          allowClear
        />
      </Space>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}
    </div>
  );
};

export default RequestsList;
