
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
    <div className="md:hidden">
      <div className="flex items-center">
        <UserMenu />
        <LanguageSelector />
        <button
          onClick={toggleMenu}
          className="ml-2 p-1 text-gray-700"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 mx-4">
          <div className="flex flex-col space-y-3">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
