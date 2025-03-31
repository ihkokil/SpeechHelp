
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const useSpeechService = () => {
  const { toast } = useToast();

  const fetchSpeeches = async (userId: string | undefined) => {
    if (!userId) {
      console.error('fetchSpeeches: No user ID provided');
      return [];
    }
    
    console.log('Fetching speeches for user ID:', userId);
    
    const { data, error } = await supabase
      .from('speeches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching speeches:', error);
      toast({
        title: "Error fetching speeches",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} speeches`);
    return data as Speech[] || [];
  };

  const saveSpeech = async (userId: string, title: string, content: string, speechType: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    console.log('Saving speech for user:', userId);
    console.log('Speech details:', { title, contentLength: content.length, speechType });
    
    const { data, error } = await supabase
      .from('speeches')
      .insert({
        user_id: userId,
        title,
        content,
        speech_type: speechType
      })
      .select();
    
    if (error) {
      console.error('Error saving speech:', error);
      toast({
        title: "Error saving speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log('Speech saved successfully:', data);
    
    toast({
      title: "Speech Saved",
      description: "Your speech has been saved to your account.",
    });
    
    return data[0] as Speech;
  };

  const updateSpeech = async (userId: string, id: string, title: string, content: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    console.log('Updating speech:', { id, title, contentLength: content.length });
    
    // Explicitly set the updated_at to ensure it's refreshed
    const { data, error } = await supabase
      .from('speeches')
      .update({
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Error updating speech:', error);
      toast({
        title: "Error updating speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log('Speech updated successfully:', data);
    
    toast({
      title: "Speech updated",
      description: "Your speech has been updated successfully.",
    });
    
    return data[0] as Speech;
  };

  const deleteSpeech = async (userId: string, id: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    console.log('Deleting speech:', id);
    
    const { error } = await supabase
      .from('speeches')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Error deleting speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log('Speech deleted successfully');
    
    toast({
      title: "Speech deleted",
      description: "Your speech has been deleted successfully.",
    });
  };

  return {
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  };
};
