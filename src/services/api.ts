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
