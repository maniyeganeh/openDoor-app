import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

interface LoginData {
  emailOrPhone: string;
  password: string;
}

interface RegisterData {
  role: string;
  name?: string;
  email?: string;
  password: string;
  mobile?: string;
  agencyPhone?: string;
  agencyName?: string;
  address?: string;
  instagramPage?: string;
  businessCard?: string;
  projectName?: string;
  projectAddress?: string;
  developerPhone?: string;
  developerInsta?: string;
  needInstaSupport?: boolean;
}

export const loginUser = (data: LoginData) => API.post('/auth/login', data);
export const registerUser = (data: RegisterData) =>
  API.post('/auth/register', data);
export const getProjects = () => API.get('/projects');
// فرض بر اینه که مسیر GET /api/projects همه پروژه‌هایی که مشاور می‌تونه روی اون‌ها بازدید ثبت کنه رو برمی‌گردونه
export const getRequests = () => API.get('/requests/consultant');
// مسیر GET /api/requests/consultant لیست درخواست‌هایی که مشاور ثبت کرده رو برمی‌گردونه
interface CreateVisitData {
  project: string;
  developer: string;
  request: string;
  date: string; // yyyy-mm-dd
  timeSlot: string; // مثلا "10:00-11:00"
}

export const createVisit = (data: CreateVisitData) => API.post('/visits', data);
export const getRequestsForConsultant = () => {
  const token = localStorage.getItem('token'); // توکن ذخیره شده بعد از ورود
  return API.get('/request/consultant', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getConsultantProfile = () => {
  const token = localStorage.getItem('token');
  return API.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateConsultantProfile = () => API.get('/requests/consultant');
