
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';

export const adminSpeechService = {
  // Fetch speeches for a user by email (for admin use)
  fetchUserSpeeches: async (userEmail: string): Promise<Speech[]> => {
    try {
      console.log('Fetching speeches for user email:', userEmail);
      
      // First, get the user ID from auth.users table using the email
      const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw new Error('Failed to fetch user data');
      }

      const user = authUser.users.find((u: any) => u.email === userEmail);
      if (!user) {
        console.log('User not found with email:', userEmail);
        return [];
      }

      console.log('Found user with ID:', user.id);

      // Now fetch speeches using the correct user ID
      const { data: speeches, error: speechesError } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (speechesError) {
        console.error('Error fetching speeches:', speechesError);
        throw new Error('Failed to fetch user speeches');
      }

      console.log('Found speeches:', speeches?.length || 0);
      return speeches || [];
    } catch (error) {
      console.error('Exception in fetchUserSpeeches:', error);
      throw error;
    }
  },

  // Fetch speeches by user ID directly (if we already have the UUID)
  fetchSpeechesByUserId: async (userId: string): Promise<Speech[]> => {
    try {
      console.log('Fetching speeches for user ID:', userId);
      
      const { data: speeches, error: speechesError } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (speechesError) {
        console.error('Error fetching speeches:', speechesError);
        throw new Error('Failed to fetch user speeches');
      }

      console.log('Found speeches:', speeches?.length || 0);
      return speeches || [];
    } catch (error) {
      console.error('Exception in fetchSpeechesByUserId:', error);
      throw error;
    }
  }
};
