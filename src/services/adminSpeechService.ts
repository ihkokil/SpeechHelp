
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';

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
  }
};
