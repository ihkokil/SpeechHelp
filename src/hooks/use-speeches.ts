
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Speech } from '@/types/auth';
import { User } from '@supabase/supabase-js';

export const useSpeeches = (user: User | null) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

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
      console.log("Fetching speeches for user ID:", user.id);
      
      const { data, error: fetchError } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching speeches:', fetchError);
        setError(fetchError.message);
        toast({
          title: "Error fetching speeches",
          description: fetchError.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Speeches fetched successfully:", data?.length || 0, "speeches found");
      setSpeeches(data || []);
    } catch (err: any) {
      console.error('Unexpected error fetching speeches:', err);
      setError(err?.message || "An unexpected error occurred");
      toast({
        title: "Error fetching speeches",
        description: "Failed to load your speeches. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user, toast]);

  // Fetch speeches when user changes
  useEffect(() => {
    let mounted = true;
    
    const initializeSpeeches = async () => {
      // Add small delay to ensure auth is fully processed
      if (!mounted) return;
      
      if (user) {
        console.log("User detected in useSpeeches, triggering fetch");
        try {
          await fetchSpeeches();
        } catch (err) {
          console.error("Failed to fetch speeches on initialization:", err);
          // Don't show toast here as fetchSpeeches already handles that
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
    if (!user) {
      console.error("Cannot save speech: No user is logged in");
      toast({
        title: "Cannot save speech",
        description: "You must be logged in to save speeches",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Saving speech for user ID:", user.id);
      
      const { error: saveError } = await supabase
        .from('speeches')
        .insert({
          user_id: user.id,
          title,
          content,
          speech_type: speechType
        });
      
      if (saveError) {
        console.error('Error saving speech:', saveError);
        toast({
          title: "Error saving speech",
          description: saveError.message,
          variant: "destructive"
        });
        throw saveError;
      }
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error saving speech:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) {
      console.error("Cannot update speech: No user is logged in");
      toast({
        title: "Cannot update speech",
        description: "You must be logged in to update speeches",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Updating speech:", id);
      
      const { error: updateError } = await supabase
        .from('speeches')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating speech:', updateError);
        toast({
          title: "Error updating speech",
          description: updateError.message,
          variant: "destructive"
        });
        throw updateError;
      }
      
      toast({
        title: "Speech updated",
        description: "Your speech has been updated successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error updating speech:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpeech = async (id: string) => {
    if (!user) {
      console.error("Cannot delete speech: No user is logged in");
      toast({
        title: "Cannot delete speech",
        description: "You must be logged in to delete speeches",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Deleting speech:", id);
      
      const { error: deleteError } = await supabase
        .from('speeches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.error('Error deleting speech:', deleteError);
        toast({
          title: "Error deleting speech",
          description: deleteError.message,
          variant: "destructive"
        });
        throw deleteError;
      }
      
      toast({
        title: "Speech deleted",
        description: "Your speech has been deleted successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error deleting speech:', err);
      throw err;
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
