
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useSpeechOperations = (user: User | null) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const { toast } = useToast();

  const fetchSpeeches = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('speeches')
      .select('*')
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
  };

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) {
      throw new Error("You must be logged in to save speeches");
    }
    
    // Form validation
    if (!title.trim()) {
      throw new Error("Speech title is required");
    }
    
    if (!content.trim()) {
      throw new Error("Speech content is required");
    }
    
    if (!speechType.trim()) {
      speechType = "other"; // Default fallback
    }
    
    console.log("Inserting speech with data:", {
      user_id: user.id,
      title: title,
      content: content,
      speech_type: speechType
    });
    
    try {
      const { error } = await supabase
        .from('speeches')
        .insert({
          user_id: user.id,
          title: title,
          content: content,
          speech_type: speechType
        });
      
      if (error) {
        console.error('Error details from Supabase:', error);
        throw error;
      }
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Exception in saveSpeech:', err);
      throw err;
    }
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) return;
    
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
  };

  const deleteSpeech = async (id: string) => {
    if (!user) return;
    
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
  };

  return {
    speeches,
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  };
};
