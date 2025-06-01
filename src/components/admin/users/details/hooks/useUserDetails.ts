
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Speech } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserDetails = (user: User | null, open: boolean) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);
  const { toast } = useToast();

  // Function to reset all states
  const resetState = useCallback(() => {
    console.log('Resetting user details state');
    setSpeeches([]);
    setIsLoadingSpeeches(false);
    setUserJoinedDays(0);
    setTotalActivityTime(0);
  }, []);

  // Helper function to extract content from JSON structure
  const extractSpeechContent = useCallback((rawContent: any): string => {
    console.log('Processing speech content:', typeof rawContent, rawContent);
    
    if (!rawContent) {
      console.log('No content provided');
      return '';
    }

    // If it's already a string, return it
    if (typeof rawContent === 'string') {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(rawContent);
        console.log('Parsed JSON content:', parsed);
        
        // Handle nested content structure
        if (parsed && typeof parsed === 'object') {
          // Check for common content keys
          const contentValue = parsed.content || parsed.text || parsed.speech || parsed.body;
          if (contentValue && typeof contentValue === 'string') {
            console.log('Extracted content from JSON:', contentValue.substring(0, 100) + '...');
            return contentValue;
          }
          
          // If it's a nested object, try to extract from deeper levels
          if (parsed.content && typeof parsed.content === 'object') {
            const deepContent = parsed.content.content || parsed.content.text || parsed.content.speech;
            if (deepContent && typeof deepContent === 'string') {
              console.log('Extracted deep content from JSON:', deepContent.substring(0, 100) + '...');
              return deepContent;
            }
          }
          
          // If no content field found, stringify the object
          console.log('No content field found, returning stringified object');
          return JSON.stringify(parsed);
        }
        
        return rawContent;
      } catch (error) {
        console.log('Content is not valid JSON, treating as plain string:', error);
        return rawContent;
      }
    }

    // If it's an object, try to extract content
    if (typeof rawContent === 'object' && rawContent !== null) {
      console.log('Content is object, extracting...');
      const contentValue = rawContent.content || rawContent.text || rawContent.speech || rawContent.body;
      if (contentValue && typeof contentValue === 'string') {
        console.log('Extracted content from object:', contentValue.substring(0, 100) + '...');
        return contentValue;
      }
      
      // Handle nested content
      if (rawContent.content && typeof rawContent.content === 'object') {
        const deepContent = rawContent.content.content || rawContent.content.text || rawContent.content.speech;
        if (deepContent && typeof deepContent === 'string') {
          console.log('Extracted deep content from object:', deepContent.substring(0, 100) + '...');
          return deepContent;
        }
      }
      
      console.log('No recognizable content field, stringifying object');
      return JSON.stringify(rawContent);
    }

    console.log('Fallback: converting to string');
    return String(rawContent);
  }, []);

  // Function to fetch speech data
  const fetchUserSpeeches = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for speech fetching');
      return;
    }
    
    console.log('Fetching speeches for user:', userId);
    setIsLoadingSpeeches(true);
    
    try {
      const { data: speechData, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
        toast({
          title: "Error loading speeches",
          description: `Failed to load speeches: ${error.message}`,
          variant: "destructive"
        });
        setSpeeches([]);
        return;
      }

      console.log('Raw speech data from database:', speechData);
      
      if (!speechData || speechData.length === 0) {
        console.log('No speeches found for user');
        setSpeeches([]);
        calculateTotalActivityTime([]);
        return;
      }

      // Process speeches with proper content extraction
      const processedSpeeches = speechData.map((speech, index) => {
        console.log(`Processing speech ${index + 1}:`, {
          id: speech.id,
          title: speech.title,
          contentType: typeof speech.content,
          contentPreview: speech.content ? String(speech.content).substring(0, 100) : 'No content'
        });

        try {
          const extractedContent = extractSpeechContent(speech.content);
          
          const processedSpeech = {
            ...speech,
            content: extractedContent,
            created_at: speech.created_at || new Date().toISOString(),
            updated_at: speech.updated_at || speech.created_at || new Date().toISOString()
          };

          console.log(`Successfully processed speech ${index + 1}:`, {
            id: processedSpeech.id,
            title: processedSpeech.title,
            contentLength: processedSpeech.content?.length || 0,
            extractedContentPreview: processedSpeech.content?.substring(0, 100) || 'No content'
          });

          return processedSpeech;
        } catch (error) {
          console.error(`Error processing speech ${index + 1}:`, error);
          
          // Return speech with fallback content
          return {
            ...speech,
            content: speech.content ? String(speech.content) : 'Content processing failed',
            created_at: speech.created_at || new Date().toISOString(),
            updated_at: speech.updated_at || speech.created_at || new Date().toISOString()
          };
        }
      });

      console.log('Final processed speeches:', {
        count: processedSpeeches.length,
        speeches: processedSpeeches.map(s => ({
          id: s.id,
          title: s.title,
          contentLength: s.content?.length || 0,
          hasContent: !!s.content && s.content !== ''
        }))
      });

      setSpeeches(processedSpeeches);
      calculateTotalActivityTime(processedSpeeches);
      
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
      toast({
        title: "Error loading speeches",
        description: "An unexpected error occurred while loading speeches.",
        variant: "destructive"
      });
      setSpeeches([]);
    } finally {
      setIsLoadingSpeeches(false);
    }
  }, [toast, extractSpeechContent]);

  // Calculate user statistics
  const calculateUserStats = useCallback((user: User) => {
    // Calculate days since user joined
    if (!user?.created_at) return;
    
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('User joined days ago:', diffDays);
    setUserJoinedDays(diffDays);
  }, []);
  
  // Calculate activity time based on speeches
  const calculateTotalActivityTime = useCallback((speeches: Speech[]) => {
    // Simple estimate: 5 minutes base time + 1 minute per 500 characters
    const totalTime = speeches.reduce((total, speech) => {
      const baseTime = 5;
      const contentLength = speech.content?.length || 0;
      const extraTime = Math.floor(contentLength / 500);
      return total + baseTime + extraTime;
    }, 0);
    
    console.log('Calculated total activity time:', totalTime, 'minutes for', speeches.length, 'speeches');
    setTotalActivityTime(totalTime);
  }, []);

  // Reset states and fetch data when the drawer opens with a user
  useEffect(() => {
    let isMounted = true;
    
    if (user && open) {
      console.log('User details drawer opened for user:', user.id);
      
      if (isMounted) {
        // Reset state first
        resetState();
        
        // Calculate user stats immediately
        calculateUserStats(user);
        
        // Fetch speeches for this user
        fetchUserSpeeches(user.id);
      }
    } else if (!open) {
      console.log('User details drawer closed, resetting state');
      // Reset state when drawer closes
      if (isMounted) {
        resetState();
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, open, fetchUserSpeeches, calculateUserStats, resetState]);

  return {
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
    resetState
  };
};
