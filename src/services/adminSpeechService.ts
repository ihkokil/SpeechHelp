
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';

interface SpeechWithUser extends Speech {
  user_email?: string;
  user_name?: string;
}

export const adminSpeechService = {
  // Simple direct fetch of speeches by user ID using admin edge function
  fetchSpeechesByUserId: async (userId: string): Promise<Speech[]> => {
    try {
      console.log('Fetching speeches for user ID via admin function:', userId);
      
      const { data, error } = await supabase.functions.invoke('admin-speeches', {
        body: { userId }
      });

      if (error) {
        console.error('Error calling admin-speeches function:', error);
        return [];
      }

      if (!data.success) {
        console.error('Admin-speeches function returned error:', data.error);
        return [];
      }

      console.log('Successfully fetched speeches via admin function:', data.speeches?.length || 0);
      return data.speeches || [];
    } catch (error) {
      console.error('Exception in fetchSpeechesByUserId:', error);
      return [];
    }
  },

  // Fetch all speeches for admin view
  fetchAllSpeeches: async (): Promise<SpeechWithUser[]> => {
    try {
      console.log('Fetching all speeches via admin function');
      
      const { data, error } = await supabase.functions.invoke('admin-speeches', {
        body: { getAllSpeeches: true }
      });

      if (error) {
        console.error('Error calling admin-speeches function for all speeches:', error);
        return [];
      }

      if (!data.success) {
        console.error('Admin-speeches function returned error:', data.error);
        return [];
      }

      console.log('Successfully fetched all speeches via admin function:', data.speeches?.length || 0);
      return data.speeches || [];
    } catch (error) {
      console.error('Exception in fetchAllSpeeches:', error);
      return [];
    }
  }
};
