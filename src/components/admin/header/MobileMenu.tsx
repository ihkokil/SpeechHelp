
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NavItem from '../navigation/NavItem';
import { getLogoPath } from '@/config/logo';

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    href: string;
  }>;
}

const MobileMenu = ({ open, setOpen, navItems }: MobileMenuProps) => {
  const logoPath = getLogoPath();
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            <Link to="/admin/dashboard">
              <img
                src={logoPath}
                alt="Speech Help Logo"
                className="h-8 w-auto"
              />
            </Link>
            <span className="text-lg font-bold text-pink-600">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
