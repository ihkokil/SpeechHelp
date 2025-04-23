
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const useSidebarState = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  // Ensure sidebar state is properly synced with device size
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState);
  };

  return {
    isOpen,
    setIsOpen,
    toggleSidebar,
    isMobile
  };
};
