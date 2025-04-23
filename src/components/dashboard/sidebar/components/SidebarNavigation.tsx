
import { NavLink } from 'react-router-dom';
import { primaryNavItems, secondaryNavItems } from '../constants/navigationItems';
import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  onItemClick?: () => void;
}

export const SidebarNavigation = ({ onItemClick }: SidebarNavigationProps) => {
  return (
    <nav className="flex-1 px-4 py-4 overflow-y-auto">
      <div className="space-y-5">
        <div className="space-y-1.5">
          {primaryNavItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 text-sm rounded-md font-medium transition-colors",
                isActive 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span className="mr-3 flex items-center justify-center">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Support
          </h3>
          <div className="mt-2 space-y-1.5">
            {secondaryNavItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                onClick={onItemClick}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2.5 text-sm rounded-md font-medium transition-colors",
                  isActive 
                    ? "bg-purple-50 text-purple-700" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <span className="mr-3 flex items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
