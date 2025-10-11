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
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [step1Data, setStep1Data] = useState<any>({}); // ✅ ذخیره داده‌های مرحله دوم
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const next = async () => {
    try {
      if (current === 1) {
        await formStep1.validateFields();
        const values = formStep1.getFieldsValue();
        setStep1Data(values); // ✅ ذخیره نام، ایمیل و پسورد
      }
      setCurrent((prev) => prev + 1);
    } catch {
      message.error('اطلاعات را کامل وارد کنید');
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const handleRegister = async () => {
    try {
      await formStep2.validateFields();
      const values2 = formStep2.getFieldsValue();

      if (!role) {
        message.error('نقش را انتخاب کنید');
        return;
      }

      // ✅ ترکیب داده‌های مرحله ۲ و ۳
      const payload = { ...step1Data, ...values2, role };

      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        payload
      );

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
      message.success('ثبت‌نام موفقیت‌آمیز بود 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'خطا در ثبت‌نام');
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
          {/* مرحله ۱ */}
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

          {/* مرحله ۲ */}
          {current === 1 && (
            <Form form={formStep1} layout="vertical" preserve={true}>
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
                rules={[
                  {
                    type: 'string',
                    required: true,
                    min: 6,
                    message: 'حداقل ۶ کاراکتر',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <div className="form-buttons">
                <Button onClick={prev}>قبلی</Button>
                <Button
                  type="primary"
                  onClick={next}
                  style={{ marginRight: '10px' }}
                >
                  ادامه
                </Button>
              </div>
            </Form>
          )}

          {/* مرحله ۳ */}
          {current === 2 && (
            <Form form={formStep2} layout="vertical" preserve={true}>
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
                <Button
                  type="primary"
                  onClick={handleRegister}
                  style={{ marginRight: '10px' }}
                >
                  ثبت‌نام
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
