
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SpeechLabLayoutProps {
  children: React.ReactNode;
}

const SpeechLabLayout: React.FC<SpeechLabLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        setIsAdmin(data || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {isMobile && (
          <div className="p-4">
            <SidebarTrigger />
          </div>
        )}
        
        {/* Admin Button - only visible to admins */}
        {isAdmin && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link to="/admin/dashboard">
              <Button 
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all"
                size="icon"
              >
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default SpeechLabLayout;
