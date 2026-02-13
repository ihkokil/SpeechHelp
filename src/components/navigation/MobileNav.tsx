
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
    <div className="lg:hidden">
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-700 hover:text-gray-900"
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
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 mx-4 z-50">
          <div className="flex flex-col space-y-3">
            <NavLinks isMobile onItemClick={closeMenu} />
            <div className="border-t pt-3 mt-2">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
