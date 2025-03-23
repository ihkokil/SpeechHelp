
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return '';
    
    if (user.user_metadata && user.user_metadata.first_name) {
      return user.user_metadata.first_name[0].toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return '';
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.user_metadata && user.user_metadata.first_name) {
      return user.user_metadata.first_name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return '';
  };

  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* User information header */}
        {user && (
          <div className="bg-white border-b border-gray-200 p-4 flex justify-end items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {getUserDisplayName()}
              </span>
              <Avatar className="h-8 w-8 bg-purple-100">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
