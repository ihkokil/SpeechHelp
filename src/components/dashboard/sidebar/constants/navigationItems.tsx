
import { 
  LayoutDashboard as LayoutDashboardIcon, 
  Mic as MicIcon, 
  PencilRuler as PencilRulerIcon, 
  Folder as FolderIcon, 
  Settings as SettingsIcon,
  HelpCircle as HelpCircleIcon,
} from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const primaryNavItems: NavItem[] = [
  {
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: <MicIcon className="h-5 w-5" />,
    label: 'Speech Lab',
    href: '/speech-lab',
  },
  {
    icon: <PencilRulerIcon className="h-5 w-5" />,
    label: 'Writing Tips',
    href: '/writing-tips',
  },
  {
    icon: <FolderIcon className="h-5 w-5" />,
    label: 'My Speeches',
    href: '/my-speeches',
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    icon: <SettingsIcon className="h-5 w-5" />,
    label: 'Account Settings',
    href: '/settings',
  },
  {
    icon: <HelpCircleIcon className="h-5 w-5" />,
    label: 'Help & Support',
    href: '/help',
  },
];
