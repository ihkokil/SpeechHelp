
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';

export const adminSpeechService = {
  // Simple direct fetch of speeches by user ID
  fetchSpeechesByUserId: async (userId: string): Promise<Speech[]> => {
    try {
      console.log('Fetching speeches for user ID:', userId);
      
      const { data: speeches, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching speeches:', error);
        return [];
      }

      console.log('Successfully fetched speeches:', speeches?.length || 0);
      return speeches || [];
    } catch (error) {
      console.error('Exception in fetchSpeechesByUserId:', error);
      return [];
    }
  }
};
