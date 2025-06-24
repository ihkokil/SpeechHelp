
import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UsePageReloadPreventionOptions {
  hasUnsavedChanges?: boolean;
  autoSaveData?: () => void;
  customMessage?: string;
}

export const usePageReloadPrevention = ({
  hasUnsavedChanges = false,
  autoSaveData,
  customMessage = "You have unsaved changes. Are you sure you want to leave?"
}: UsePageReloadPreventionOptions = {}) => {
  const { toast } = useToast();
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(Date.now());

  // Prevent page reload/navigation when there are unsaved changes
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      // Auto-save before potential unload
      if (autoSaveData) {
        autoSaveData();
      }
      
      // Show browser confirmation dialog
      event.preventDefault();
      event.returnValue = customMessage;
      return customMessage;
    }
  }, [hasUnsavedChanges, autoSaveData, customMessage]);

  // Prevent back/forward navigation during critical operations
  const handlePopState = useCallback((event: PopStateEvent) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(customMessage);
      if (!confirmLeave) {
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
        event.preventDefault();
        return false;
      } else if (autoSaveData) {
        autoSaveData();
      }
    }
  }, [hasUnsavedChanges, autoSaveData, customMessage]);

  // Auto-save functionality
  const startAutoSave = useCallback(() => {
    if (autoSaveData && !autoSaveIntervalRef.current) {
      autoSaveIntervalRef.current = setInterval(() => {
        const timeSinceLastSave = Date.now() - lastSaveTimeRef.current;
        // Auto-save every 30 seconds if there are changes
        if (timeSinceLastSave > 30000 && hasUnsavedChanges) {
          autoSaveData();
          lastSaveTimeRef.current = Date.now();
          toast({
            title: "Auto-saved",
            description: "Your work has been automatically saved.",
            duration: 2000,
          });
        }
      }, 10000); // Check every 10 seconds
    }
  }, [autoSaveData, hasUnsavedChanges, toast]);

  const stopAutoSave = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = undefined;
    }
  }, []);

  // Prevent focus-related reloads
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && hasUnsavedChanges && autoSaveData) {
      // Auto-save when tab becomes hidden
      autoSaveData();
      lastSaveTimeRef.current = Date.now();
    }
  }, [hasUnsavedChanges, autoSaveData]);

  // Prevent accidental refresh with Ctrl+R or F5
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (hasUnsavedChanges) {
      // Prevent F5 refresh
      if (event.key === 'F5') {
        event.preventDefault();
        toast({
          title: "Refresh Prevented",
          description: "Page refresh is disabled while you have unsaved changes.",
          variant: "destructive",
        });
        return false;
      }
      
      // Prevent Ctrl+R refresh
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        toast({
          title: "Refresh Prevented", 
          description: "Page refresh is disabled while you have unsaved changes.",
          variant: "destructive",
        });
        return false;
      }
    }
  }, [hasUnsavedChanges, toast]);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    
    // Start auto-save if data function is provided
    if (autoSaveData) {
      startAutoSave();
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      stopAutoSave();
    };
  }, [handleBeforeUnload, handlePopState, handleVisibilityChange, handleKeyDown, startAutoSave, stopAutoSave, autoSaveData]);

  return {
    startAutoSave,
    stopAutoSave,
    updateLastSaveTime: () => {
      lastSaveTimeRef.current = Date.now();
    }
  };
};
