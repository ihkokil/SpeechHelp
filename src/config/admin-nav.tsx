
import { 
  BarChart4, 
  Users, 
  Settings, 
  Database,
  Shield,
  Home,
  Activity,
  HelpCircle,
} from 'lucide-react';

export const adminNavItems = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
  { icon: Database, label: 'Data Management', href: '/admin/data' },
  { icon: BarChart4, label: 'Analytics', href: '/admin/analytics' },
  { icon: Activity, label: 'Activity Logs', href: '/admin/logs' },
  { icon: Shield, label: 'Security', href: '/admin/security' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/admin/support' },
];
