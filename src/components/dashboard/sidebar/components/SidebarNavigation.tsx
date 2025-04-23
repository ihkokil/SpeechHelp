
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { primaryNavItems, secondaryNavItems } from '../constants/navigationItems';

export const SidebarNavigation = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3">
      <div className="space-y-1">
        {primaryNavItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              currentPath.startsWith(item.href) 
                ? "bg-purple-50 text-purple-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={onItemClick}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="h-px bg-gray-200 my-6 mx-3"></div>

      <div className="px-3">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Settings
        </p>
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                currentPath.startsWith(item.href) 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={onItemClick}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
