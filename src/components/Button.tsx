import React from 'react';
import { Button as AntButton } from 'antd';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <AntButton
    type="primary"
    block
    {...props}
    style={{ fontFamily: 'Iran-sans-bold' }}
  >
    {children}
  </AntButton>
);

export default Button;
