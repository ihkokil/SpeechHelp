
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";
import { SidebarTrigger } from '@/components/ui/sidebar';

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center space-x-4">
        <UserMenu />
        <LanguageSelector />
        <button
          onClick={toggleMenu}
          className="text-gray-700"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
