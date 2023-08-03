
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Logo path
  const logoPath = "/Speech Help - Logo.svg";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200 bg-white">
        <Link to="/" className="flex-shrink-0">
          <img src={logoPath} alt="Speech Help" className="h-8" />
        </Link>
        
        <div className="flex items-center space-x-2">
          <UserMenu />
          <LanguageSelector />
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="p-2 text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute z-50 w-full bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
