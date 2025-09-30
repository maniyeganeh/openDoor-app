import React, { useState } from 'react';
import { Form, Input, Button, Steps, Card, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const { Step } = Steps;

const Register: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [role, setRole] = useState<'consultant' | 'developer' | null>(null);
  const [form] = Form.useForm();
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleSubmit = async (values: any) => {
    try {
      const res = await axios.post('/api/auth/register', { ...values, role });

      // لاگین خودکار بعد از ثبت‌نام
      dispatch({
        type: 'LOGIN',
        payload: {
          id: res.data.user._id,
          name: res.data.user.name,
          role: res.data.user.role,
          token: res.data.token,
          email: res.data.user.email,
          mobile: res.data.user.mobile,
          isVerified: res.data.user.isVerified,
        },
      });

      localStorage.setItem('token', res.data.token);

      message.success('ثبت نام موفقیت آمیز بود');
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'خطا در ثبت نام');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <Steps current={current} responsive>
          <Step title="نقش" />
          <Step title="کاربری" />
          <Step title="جزئیات" />
        </Steps>

        <div style={{ marginTop: 24 }}>
          {current === 0 && (
            <div className="role-cards">
              <Card
                hoverable
                className={role === 'consultant' ? 'selected' : ''}
                onClick={() => setRole('consultant')}
              >
                👤 مشاور املاک
              </Card>
              <Card
                hoverable
                className={role === 'developer' ? 'selected' : ''}
                onClick={() => setRole('developer')}
              >
                🏗 سازنده
              </Card>
              {role && (
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 16 }}
                  onClick={next}
                >
                  ادامه
                </Button>
              )}
            </div>
          )}

          {current === 1 && (
            <Form form={form} layout="vertical" onFinish={next}>
              <Form.Item label="نام" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="ایمیل"
                name="email"
                rules={[{ type: 'email', required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="رمز عبور"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <div className="form-buttons">
                <Button onClick={prev}>قبلی</Button>
                <Button type="primary" htmlType="submit">
                  ادامه
                </Button>
              </div>
            </Form>
          )}

          {current === 2 && (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {role === 'consultant' ? (
                <>
                  <Form.Item
                    label="موبایل"
                    name="mobile"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="نام آژانس" name="agencyName">
                    <Input />
                  </Form.Item>
                  <Form.Item label="آدرس" name="address">
                    <Input />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="نام پروژه"
                    name="projectName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="آدرس پروژه" name="projectAddress">
                    <Input />
                  </Form.Item>
                  <Form.Item label="شماره تماس" name="developerPhone">
                    <Input />
                  </Form.Item>
                </>
              )}
              <div className="form-buttons">
                <Button onClick={prev}>قبلی</Button>
                <Button type="primary" htmlType="submit">
                  ثبت نام
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
