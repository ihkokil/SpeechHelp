
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Speech } from '@/types/auth';
import { User } from '@supabase/supabase-js';

type SpeechOperationResponse = {
  success: boolean;
  error?: string;
};

export const useSpeechOperations = (user: User | null) => {
  const { toast } = useToast();

  const fetchUserSpeeches = useCallback(async (): Promise<Speech[]> => {
    if (!user) {
      console.log("No user detected in fetchUserSpeeches");
      return [];
    }
    
    console.log("Fetching speeches for user ID:", user.id);
    
    const { data, error } = await supabase
      .from('speeches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching speeches:', error);
      throw new Error(error.message);
    }
    
    console.log("Speeches fetched successfully:", data?.length || 0, "speeches found");
    return data || [];
  }, [user]);

  const saveSpeech = useCallback(async (
    title: string, 
    content: string, 
    speechType: string
  ): Promise<SpeechOperationResponse> => {
    if (!user) {
      console.error("Cannot save speech: No user is logged in");
      return { 
        success: false, 
        error: "You must be logged in to save speeches" 
      };
    }
    
    try {
      console.log("Saving speech for user ID:", user.id);
      
      const { error } = await supabase
        .from('speeches')
        .insert({
          user_id: user.id,
          title,
          content,
          speech_type: speechType
        });
      
      if (error) {
        console.error('Error saving speech:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Unexpected error saving speech:', err);
      return { 
        success: false, 
        error: err?.message || "An unexpected error occurred while saving your speech" 
      };
    }
  }, [user]);

  const updateSpeech = useCallback(async (
    id: string, 
    title: string, 
    content: string
  ): Promise<SpeechOperationResponse> => {
    if (!user) {
      console.error("Cannot update speech: No user is logged in");
      return { 
        success: false, 
        error: "You must be logged in to update speeches" 
      };
    }
    
    try {
      console.log("Updating speech:", id);
      
      const { error } = await supabase
        .from('speeches')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating speech:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Unexpected error updating speech:', err);
      return { 
        success: false, 
        error: err?.message || "An unexpected error occurred while updating your speech" 
      };
    }
  }, [user]);

  const deleteSpeech = useCallback(async (id: string): Promise<SpeechOperationResponse> => {
    if (!user) {
      console.error("Cannot delete speech: No user is logged in");
      return { 
        success: false, 
        error: "You must be logged in to delete speeches" 
      };
    }
    
    try {
      console.log("Deleting speech:", id);
      
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting speech:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Unexpected error deleting speech:', err);
      return { 
        success: false, 
        error: err?.message || "An unexpected error occurred while deleting your speech" 
      };
    }
  }, [user]);

  return {
    fetchUserSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  };
};
