import React from 'react';
import { Input } from 'antd';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => (
  <div style={{ marginBottom: 16, fontFamily: 'Iran-sans-bold' }}>
    <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
    <Input {...props} />
  </div>
);

export default FormInput;
