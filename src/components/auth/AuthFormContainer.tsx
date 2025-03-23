
import React from 'react';

type AuthFormContainerProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const AuthFormContainer = ({ title, description, children }: AuthFormContainerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthFormContainer;
