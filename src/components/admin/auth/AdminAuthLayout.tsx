
import React from 'react';

interface AdminAuthLayoutProps {
  children: React.ReactNode;
}

const AdminAuthLayout: React.FC<AdminAuthLayoutProps> = ({ children }) => {
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="mb-6 flex items-center space-x-2">
        <img 
          src={logoPath}
          alt="Speech Help Logo" 
          className="h-10 w-auto" 
        />
        <div className="text-2xl font-bold text-pink-600">Admin Portal</div>
      </div>
      
      {children}
    </div>
  );
};

export default AdminAuthLayout;
