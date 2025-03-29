
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <UserMenu />
          <LanguageSelector />
        </div>
        <button
          onClick={toggleMenu}
          className="text-gray-700 p-2"
          aria-label="Toggle menu"
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
        <div className="mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-0 right-0 z-50">
          <div className="flex flex-col space-y-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
