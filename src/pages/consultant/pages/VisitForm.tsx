import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Select,
  TimePicker,
  message,
  Spin,
  ConfigProvider,
} from 'antd';
import faIR from 'antd/locale/fa_IR';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import { DatePicker } from 'antd-jalali'; // ✅ استفاده از DatePicker شمسی
import { getProjects, getRequests, createVisit } from '../../../services/api';

import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';

dayjs.extend(jalaliday);
dayjs.locale('fa');
dayjs.calendar('jalali');

const { Option } = Select;

const VisitForm: React.FC = () => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchRequests();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch {
      message.error('خطا در بارگذاری پروژه‌ها');
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch {
      message.error('خطا در بارگذاری درخواست‌ها');
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        project: values.project,
        developer: values.developer,
        request: values.request,
        date: values.date.calendar('gregory').format('YYYY-MM-DD'), // ✅ تبدیل شمسی به میلادی برای API
        timeSlot: values.time.format('HH:mm'),
      };

      await createVisit(payload);
      message.success('بازدید با موفقیت ثبت شد ✅');
      form.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'خطا در ثبت بازدید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider locale={faIR} direction="rtl">
      <Spin spinning={loading}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
            🗓️ ثبت بازدید
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ fontFamily: 'Iran-sans-reg' }}
          >
            <Form.Item
              label="پروژه"
              name="project"
              rules={[{ required: true, message: 'پروژه را انتخاب کنید' }]}
            >
              <Select placeholder="انتخاب پروژه">
                {projects.map((p) => (
                  <Option key={p._id} value={p._id}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="درخواست مرتبط"
              name="request"
              rules={[{ required: true, message: 'درخواست را انتخاب کنید' }]}
            >
              <Select placeholder="انتخاب درخواست">
                {requests.map((r) => (
                  <Option key={r._id} value={r._id}>
                    {r.customerName} - {r.type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* ✅ تقویم شمسی */}
            <Form.Item
              label="تاریخ بازدید"
              name="date"
              rules={[{ required: true, message: 'تاریخ را وارد کنید' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="انتخاب تاریخ"
                format="jYYYY/jMM/jDD"
              />
            </Form.Item>

            <Form.Item
              label="ساعت بازدید"
              name="time"
              rules={[{ required: true, message: 'ساعت را انتخاب کنید' }]}
            >
              <TimePicker
                style={{ width: '100%' }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                ثبت بازدید
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </ConfigProvider>
  );
};

export default VisitForm;
