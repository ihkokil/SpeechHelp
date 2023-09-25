
import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  BarChart, 
  Settings, 
  Shield, 
  FileDown, 
  LogOut, 
  Menu, 
  X, 
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { adminUser, logout, isLoading, hasPermission } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, isLoading, navigate]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!adminUser) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Title */}
          <div className="flex items-center justify-center p-6 border-b">
            <Shield className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          {/* Admin user info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{adminUser.username}</p>
                <p className="text-xs text-gray-500">{adminUser.is_super_admin ? 'Super Admin' : adminUser.roles.join(', ')}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <ScrollArea className="flex-grow py-2">
            <nav className="px-2 space-y-1">
              <NavItem 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                label="Dashboard" 
                onClick={() => navigate('/admin/dashboard')} 
              />
              
              {hasPermission('view_users') && (
                <NavItem 
                  icon={<Users className="h-5 w-5" />} 
                  label="User Management" 
                  onClick={() => navigate('/admin/users')} 
                />
              )}
              
              {hasPermission('view_speeches') && (
                <NavItem 
                  icon={<FileText className="h-5 w-5" />} 
                  label="Speech Content" 
                  onClick={() => navigate('/admin/speeches')} 
                />
              )}
              
              {hasPermission('manage_billing') && (
                <NavItem 
                  icon={<CreditCard className="h-5 w-5" />} 
                  label="Billing & Plans" 
                  onClick={() => navigate('/admin/billing')} 
                />
              )}
              
              {hasPermission('view_analytics') && (
                <NavItem 
                  icon={<BarChart className="h-5 w-5" />} 
                  label="Analytics" 
                  onClick={() => navigate('/admin/analytics')} 
                />
              )}
              
              {hasPermission('export_data') && (
                <NavItem 
                  icon={<FileDown className="h-5 w-5" />} 
                  label="Export Data" 
                  onClick={() => navigate('/admin/export')} 
                />
              )}
              
              {adminUser.is_super_admin && (
                <NavItem 
                  icon={<Settings className="h-5 w-5" />} 
                  label="Admin Settings" 
                  onClick={() => navigate('/admin/settings')} 
                />
              )}
            </nav>
          </ScrollArea>
          
          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="px-4 py-6 sm:px-6 lg:px-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors"
    >
      <span className="text-gray-500 mr-3">{icon}</span>
      {label}
    </button>
  );
};

export default AdminLayout;
