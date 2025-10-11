// src/pages/Login.tsx
import React, { useState } from 'react';
import { Card, message } from 'antd';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      message.warning('ایمیل/موبایل و رمز عبور را وارد کنید');
      return;
    }

    try {
      const res = await loginUser({ emailOrPhone, password });

      const userData = {
        id: res.data.user._id,
        name: res.data.user.name,
        role: res.data.user.role,
        token: res.data.token,
        email: res.data.user.email,
        mobile: res.data.user.mobile,
        isVerified: res.data.user.isVerified,
      };

      // ذخیره در Context و localStorage
      dispatch({ type: 'LOGIN', payload: userData });
      localStorage.setItem('token', res.data.token);

      message.success('ورود موفقیت‌آمیز');
      if (res.data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('❌ Login Error:', err);
      message.error(err.response?.data?.message || 'خطا در ورود');
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          padding: 20,
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
            fontFamily: 'Iran-sans-bold',
            direction: 'rtl',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>ورود</h2>

          <FormInput
            label="ایمیل یا شماره موبایل"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          <FormInput
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ marginTop: 20 }}>
            <Button onClick={handleLogin}>ورود</Button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Link to={'/register'}>ثبت نام</Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
