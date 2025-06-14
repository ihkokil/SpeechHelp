
import { X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarState } from './sidebar/hooks/useSidebarState';
import { UserProfile } from './sidebar/components/UserProfile';
import { SidebarNavigation } from './sidebar/components/SidebarNavigation';
import { LogoutButton } from './sidebar/components/LogoutButton';

const DashboardSidebar = () => {
  const { isOpen, setIsOpen, toggleSidebar, isMobile } = useSidebarState();
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg";

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      <aside className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-screen shadow-md transition-all duration-300 z-40",
        isMobile 
          ? isOpen 
            ? "fixed w-64 translate-x-0" 
            : "fixed w-64 -translate-x-full"
          : "fixed w-64",
      )}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-center">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoPath} alt="Speech Help" className="h-10 w-auto" />
          </Link>
          {isMobile && isOpen && (
            <button onClick={toggleSidebar} className="absolute right-2 p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col flex-grow overflow-hidden">
          <UserProfile />
          <div className="flex-grow overflow-y-auto">
            <SidebarNavigation onItemClick={() => isMobile && setIsOpen(false)} />
          </div>
          <LogoutButton />
        </div>
      </aside>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default DashboardSidebar;
