
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";
import { Link } from "react-router-dom";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Using Supabase hosted SVG file or local file
  const logoPath = "/Speech Help - Logo-New.png";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoPath} alt="Speech Help" className="h-8" />
        </Link>
        
        <div className="flex items-center space-x-4">
          <UserMenu />
          <LanguageSelector />
          <button
            onClick={toggleMenu}
            className="text-gray-700 p-1"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
        <div className="absolute top-full left-0 right-0 z-20 bg-white shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
