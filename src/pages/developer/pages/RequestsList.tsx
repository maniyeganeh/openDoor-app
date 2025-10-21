import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface Request {
  _id: string;
  consultantName: string;
  project: string;
  dealType: 'خرید' | 'اجاره';
  budget: number;
  status: 'pending' | 'approved' | 'rejected';
}

const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  // دریافت داده‌ها از API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/developer/requests');
      setRequests(data);
    } catch (err) {
      message.error('خطا در دریافت درخواست‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // تأیید درخواست
  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/developer/requests/${id}/approve`);
      message.success('درخواست تأیید شد');
      fetchRequests();
    } catch {
      message.error('خطا در تأیید درخواست');
    }
  };

  // رد درخواست
  const handleReject = async (id: string) => {
    try {
      await axios.post(`/api/developer/requests/${id}/reject`);
      message.info('درخواست رد شد');
      fetchRequests();
    } catch {
      message.error('خطا در رد درخواست');
    }
  };

  const columns: ColumnsType<Request> = [
    {
      title: 'نام مشاور',
      dataIndex: 'consultantName',
      key: 'consultantName',
    },
    {
      title: 'پروژه',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'نوع معامله',
      dataIndex: 'dealType',
      key: 'dealType',
    },
    {
      title: 'بودجه (تومان)',
      dataIndex: 'budget',
      key: 'budget',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color =
          status === 'approved'
            ? 'green'
            : status === 'rejected'
            ? 'volcano'
            : 'gold';
        const text =
          status === 'approved'
            ? 'تأیید شده'
            : status === 'rejected'
            ? 'رد شده'
            : 'در انتظار';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'اقدامات',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleApprove(record._id)}
            disabled={record.status !== 'pending'}
          >
            تأیید
          </Button>
          <Button
            danger
            onClick={() => handleReject(record._id)}
            disabled={record.status !== 'pending'}
          >
            رد
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>لیست درخواست‌های مشاوران</h2>
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default RequestsList;
