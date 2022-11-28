
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Speech } from '@/types/auth';
import { User } from '@supabase/supabase-js';

export const useSpeeches = (user: User | null) => {
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
    if (!user) return;
    
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
