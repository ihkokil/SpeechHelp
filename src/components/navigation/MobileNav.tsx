
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
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg";

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
        <Link to="/" className="flex-shrink-0">
          <img src={logoPath} alt="Speech Help" className="h-10" />
        </Link>
        
        <div className="flex items-center space-x-3">
          <UserMenu />
          <LanguageSelector />
          <button
            onClick={toggleMenu}
            className="text-gray-700 p-2 focus:outline-none"
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
        <div className="bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
