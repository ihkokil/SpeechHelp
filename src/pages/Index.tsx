import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import SpeechGallery from '@/components/SpeechGallery';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation with hash - improved to handle direct links better
  useEffect(() => {
    const handleHashNavigation = () => {
      // Check if there's a hash in the URL
      if (window.location.hash) {
        // Remove the # character
        const id = window.location.hash.substring(1);
        
        // Find element and scroll to it with a delay to ensure page is loaded
        const scrollTimer = setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            // Scroll to the element with an offset for the navbar
            const navbarHeight = 80; // Approximate navbar height
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 600); // Increased delay to ensure everything is loaded
        
        return () => clearTimeout(scrollTimer);
      }
    };

    // Initial check when component mounts
    handleHashNavigation();

    // Also listen for hashchange events (for when user clicks navigation within the same page)
    window.addEventListener('hashchange', handleHashNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  // Handle navigation from other pages using sessionStorage
  useEffect(() => {
    const checkSessionStorageTarget = () => {
      const scrollTarget = sessionStorage.getItem('scrollTarget');
      if (scrollTarget) {
        // Clear the target immediately to prevent repeated scrolling
        sessionStorage.removeItem('scrollTarget');
        
        // Use a slightly longer timeout to ensure the page is fully rendered
        const timer = setTimeout(() => {
          const element = document.getElementById(scrollTarget);
          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;
            
            console.log(`Scrolling to ${scrollTarget} at position ${offsetPosition}`);
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 1000); // Longer delay for navigation from other pages
        
        return () => clearTimeout(timer);
      }
    };
    
    // Run this effect when component mounts and is no longer loading
    if (!isLoading) {
      checkSessionStorageTarget();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading SpeechHelp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <SpeechGallery />
        <div id="contact">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
