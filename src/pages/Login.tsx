import React, { useState } from 'react';
import { Card } from 'antd';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { loginUser } from '../services/api';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginUser({ emailOrPhone, password });
      console.log(res.data);
      alert('ورود موفق!');
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
