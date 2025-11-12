
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, active, onClick }: NavItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
    if (onClick) onClick();
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={active}
        onClick={handleClick}
        className={cn(
          "transition-colors",
          active ? "bg-pink-50 text-pink-700" : "hover:bg-pink-500 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default NavItem;
