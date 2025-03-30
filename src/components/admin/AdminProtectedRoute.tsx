
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { adminUser, isLoading, hasPermission } = useAdmin();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
