
import { useState, useEffect } from 'react';
import { Menu, X } from "lucide-react";
import { ButtonCustom } from "./ui/button-custom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-lg bg-gradient-to-r from-pink-600/95 to-purple-600/95 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-white">SPEECH</span>
              <span className="text-white">HELP</span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-sm font-medium text-white hover:text-pink-200 transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#about-us"
              className="text-sm font-medium text-white hover:text-pink-200 transition-colors duration-200"
            >
              About Us
            </a>
            <a
              href="#help"
              className="text-sm font-medium text-white hover:text-pink-200 transition-colors duration-200"
            >
              Help
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-white hover:text-pink-200 transition-colors duration-200"
            >
              Pricing
            </a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ButtonCustom variant="outline" size="default" className="border-white text-white hover:bg-white hover:text-pink-600">
              Log in
            </ButtonCustom>
            <ButtonCustom variant="minimal" size="default">
              Sign Up Free
            </ButtonCustom>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-gradient-to-r from-pink-600/95 to-purple-600/95 absolute top-[72px] left-0 right-0 z-50 px-6 py-6 shadow-md animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-sm font-medium text-white hover:text-pink-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#about-us"
                className="text-sm font-medium text-white hover:text-pink-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </a>
              <a
                href="#help"
                className="text-sm font-medium text-white hover:text-pink-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Help
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-white hover:text-pink-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-2 flex flex-col space-y-2">
                <ButtonCustom variant="outline" size="default" className="border-white text-white hover:bg-white hover:text-pink-600 w-full">
                  Log in
                </ButtonCustom>
                <ButtonCustom variant="minimal" size="default" className="w-full">
                  Sign Up Free
                </ButtonCustom>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
