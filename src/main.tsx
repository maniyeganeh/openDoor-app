import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import 'antd/dist/reset.css'; // نسخه جدید antd
import './index.css';
import { ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';
import { AuthProvider } from './context/AuthContext.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider direction="rtl" locale={faIR}>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </ConfigProvider>
);
