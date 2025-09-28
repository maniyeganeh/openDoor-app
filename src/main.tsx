import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import 'antd/dist/reset.css'; // نسخه جدید antd
import './index.css';
import { ConfigProvider } from 'antd';
import faIR from 'antd/locale/fa_IR';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider direction="rtl" locale={faIR}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
);
