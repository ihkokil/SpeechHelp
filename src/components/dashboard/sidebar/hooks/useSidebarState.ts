
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const useSidebarState = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return {
    isOpen,
    setIsOpen,
    toggleSidebar,
    isMobile
  };
};
