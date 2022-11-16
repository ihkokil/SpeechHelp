
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-md shadow-md py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <img 
              src="/lovable-uploads/b6ea4638-2c5b-4af2-8d8a-69096499067b.png" 
              alt="SpeechHelp Logo" 
              className="h-11" 
              style={{ display: 'block' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="#features"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="#how-it-works"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="#testimonials"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Testimonials
            </Link>
            <Link
              to="#contact"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Contact
            </Link>

            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <UserMenu />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="#features"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#how-it-works"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="#testimonials"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                to="#contact"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
