import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // آدرس API خودت رو بزن

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  return data; // باید شامل token و اطلاعات کاربر باشه
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'consultant' | 'developer';
}) => {
  const { data } = await axios.post(`${API_URL}/register`, payload);
  return data;
};
