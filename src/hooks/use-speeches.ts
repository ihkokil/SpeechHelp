
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Speech } from '@/types/auth';
import { User } from '@supabase/supabase-js';
import { useSpeechOperations } from './use-speech-operations';

export const useSpeeches = (user: User | null) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const { 
    fetchUserSpeeches, 
    saveSpeech: saveUserSpeech, 
    updateSpeech: updateUserSpeech, 
    deleteSpeech: deleteUserSpeech 
  } = useSpeechOperations(user);

  const fetchSpeeches = useCallback(async () => {
    if (!user) {
      console.log("No user detected in useSpeeches, clearing speeches");
      setSpeeches([]);
      setIsInitialized(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedSpeeches = await fetchUserSpeeches();
      setSpeeches(fetchedSpeeches);
    } catch (err: any) {
      console.error('Error in fetchSpeeches:', err);
      setError(err?.message || "An unexpected error occurred");
      toast({
        title: "Error fetching speeches",
        description: err?.message || "Failed to load your speeches. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user, fetchUserSpeeches, toast]);

  // Fetch speeches when user changes
  useEffect(() => {
    let mounted = true;
    
    const initializeSpeeches = async () => {
      if (!mounted) return;
      
      if (user) {
        console.log("User detected in useSpeeches, triggering fetch");
        try {
          await fetchSpeeches();
        } catch (err) {
          console.error("Failed to fetch speeches on initialization:", err);
          if (mounted) {
            setIsInitialized(true);
          }
        }
      } else if (user === null) {
        // Clear speeches when user is explicitly null (logged out)
        console.log("User is null in useSpeeches, clearing speeches");
        if (mounted) {
          setSpeeches([]);
          setIsInitialized(true);
        }
      }
    };

    initializeSpeeches();

    return () => {
      mounted = false;
    };
  }, [user, fetchSpeeches]);

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    setIsLoading(true);
    
    try {
      const result = await saveUserSpeech(title, content, speechType);
      
      if (!result.success) {
        toast({
          title: "Error saving speech",
          description: result.error || "Failed to save your speech. Please try again.",
          variant: "destructive"
        });
        throw new Error(result.error);
      }
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Error in saveSpeech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    setIsLoading(true);
    
    try {
      const result = await updateUserSpeech(id, title, content);
      
      if (!result.success) {
        toast({
          title: "Error updating speech",
          description: result.error || "Failed to update your speech. Please try again.",
          variant: "destructive"
        });
        throw new Error(result.error);
      }
      
      toast({
        title: "Speech updated",
        description: "Your speech has been updated successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Error in updateSpeech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpeech = async (id: string) => {
    setIsLoading(true);
    
    try {
      const result = await deleteUserSpeech(id);
      
      if (!result.success) {
        toast({
          title: "Error deleting speech",
          description: result.error || "Failed to delete your speech. Please try again.",
          variant: "destructive"
        });
        throw new Error(result.error);
      }
      
      toast({
        title: "Speech deleted",
        description: "Your speech has been deleted successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Error in deleteSpeech:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    speeches,
    isLoading,
    error,
    isInitialized,
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  };
};
