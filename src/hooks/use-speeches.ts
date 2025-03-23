
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Speech } from '@/types/auth';
import { User } from '@supabase/supabase-js';

export const useSpeeches = (user: User | null) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSpeeches = useCallback(async () => {
    if (!user) {
      setSpeeches([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching speeches:', error);
        toast({
          title: "Error fetching speeches",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setSpeeches(data || []);
    } catch (err) {
      console.error('Unexpected error fetching speeches:', err);
      toast({
        title: "Error fetching speeches",
        description: "Failed to load your speeches. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) return;
    
    try {
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
        toast({
          title: "Error saving speech",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error saving speech:', err);
      throw err;
    }
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) return;
    
    try {
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
        toast({
          title: "Error updating speech",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Speech updated",
        description: "Your speech has been updated successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error updating speech:', err);
      throw err;
    }
  };

  const deleteSpeech = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting speech:', error);
        toast({
          title: "Error deleting speech",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Speech deleted",
        description: "Your speech has been deleted successfully.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Unexpected error deleting speech:', err);
      throw err;
    }
  };

  return {
    speeches,
    isLoading,
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  };
};
