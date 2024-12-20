
import React from 'react';
import AuthLayout from './AuthLayout';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
};

export default AuthContainer;
