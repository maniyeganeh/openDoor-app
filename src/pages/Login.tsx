import React, { useState } from 'react';
import { Card } from 'antd';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ emailOrPhone, password });

      // ذخیره کاربر در context
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

      // ذخیره توکن برای session
      localStorage.setItem('token', res.data.token);

      alert('ورود موفق!');
      navigate('/dashboard'); // هدایت به داشبورد
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
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
        style={{ width: '100%', maxWidth: 400, fontFamily: 'Iran-sans-bold' }}
      >
        <h2 style={{ textAlign: 'center' }}>ورود</h2>
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
        <Button onClick={handleLogin}>ورود</Button>
      </Card>
    </div>
  );
};

export default Login;
