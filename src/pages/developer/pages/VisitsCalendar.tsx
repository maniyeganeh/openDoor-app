import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Modal,
  Button,
  Form,
  TimePicker,
  DatePicker,
  message,
  Tag,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import 'dayjs/locale/fa';
import locale from 'antd/es/date-picker/locale/fa_IR';

dayjs.locale('fa');

interface Visit {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  consultantName: string;
  status: 'approved' | 'pending' | 'done';
}

const VisitsCalendar: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/developer/visits');
      setVisits(data);
    } catch {
      message.error('خطا در دریافت اطلاعات بازدیدها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // افزودن بازه زمانی جدید
  const handleAddAvailability = async (values: any) => {
    try {
      const payload = {
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.time[0].format('HH:mm'),
        endTime: values.time[1].format('HH:mm'),
      };
      await axios.post('/api/developer/visits/availability', payload);
      message.success('بازه زمانی جدید اضافه شد');
      setIsModalOpen(false);
      fetchVisits();
    } catch {
      message.error('خطا در ثبت بازه زمانی');
    }
  };

  // نمایش رویدادهای روز خاص
  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayVisits = visits.filter((v) => v.date === dateStr);

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dayVisits.map((item) => (
          <li key={item._id}>
            <Tag
              color={
                item.status === 'approved'
                  ? 'green'
                  : item.status === 'pending'
                  ? 'gold'
                  : 'blue'
              }
            >
              {item.project} ({item.startTime} - {item.endTime})
            </Tag>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>تقویم بازدیدها</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          افزودن بازه زمانی
        </Button>
      </div>

      <Calendar
        dateCellRender={dateCellRender}
        // loading={loading}
        locale={locale}
      />

      <Modal
        title="افزودن بازه زمانی بازدید"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddAvailability}>
          <Form.Item
            label="تاریخ"
            name="date"
            rules={[{ required: true, message: 'لطفاً تاریخ را انتخاب کنید' }]}
          >
            <DatePicker locale={locale} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="بازه زمانی"
            name="time"
            rules={[
              { required: true, message: 'لطفاً بازه زمانی را وارد کنید' },
            ]}
          >
            <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              ثبت
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitsCalendar;
