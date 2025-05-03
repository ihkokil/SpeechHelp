
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useSpeechService = () => {
	const { toast } = useToast();

	const fetchSpeeches = useCallback(async (userId: string | undefined) => {
		if (!userId) {
			console.log('No userId provided, returning empty speeches array');
			return [];
		}

		console.log('Fetching speeches for user:', userId);

		try {
			// First, let's check if the speeches table exists and has any data at all
			const { data: allSpeeches, error: countError } = await supabase
				.from('speeches')
				.select('id, user_id')
				.limit(5);

			console.log('Sample speeches in database:', allSpeeches);
			console.log('Count query error:', countError);

			// Now fetch speeches for the specific user
			const { data, error } = await supabase
				.from('speeches')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching speeches:', error);
				console.error('Error details:', {
					message: error.message,
					details: error.details,
					hint: error.hint,
					code: error.code
				});
				toast({
					title: "Error fetching speeches",
					description: error.message,
					variant: "destructive"
				});
				return [];
			}

			// Debug: log the raw data from the database
			console.log('Raw speech data from database:', data);
			console.log('Number of speeches found:', data?.length || 0);

			// Ensure timestamps are properly formatted and never null or empty
			const processedSpeeches = data?.map(speech => {
				console.log('Processing speech:', speech.id, 'for user:', speech.user_id);
				const now = new Date().toISOString();
				const created = typeof speech.created_at === 'string' && speech.created_at.trim() !== '' 
					? speech.created_at 
					: now;
				const updated = typeof speech.updated_at === 'string' && speech.updated_at.trim() !== '' 
					? speech.updated_at 
					: created;

				return {
					...speech,
					created_at: created,
					updated_at: updated
				};
			}) || [];

			console.log('Processed speeches with timestamps:', processedSpeeches);
			return processedSpeeches as Speech[];
		} catch (fetchError) {
			console.error('Exception in fetchSpeeches:', fetchError);
			toast({
				title: "Error fetching speeches",
				description: "There was a problem retrieving speeches",
				variant: "destructive"
			});
			return [];
		}
	}, [toast]);

	const saveSpeech = useCallback(async (userId: string, title: string, content: string, speechType: string) => {
		if (!userId) throw new Error('User not authenticated');

		const timestamp = new Date().toISOString();

		const { data: speech, error } = await supabase
			.from('speeches')
			.insert({
				user_id: userId,
				title,
				content,
				speech_type: speechType,
				created_at: timestamp,
				updated_at: timestamp
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

		toast({
			title: "Speech Saved",
			description: "Your speech has been saved to your account.",
		});
		return speech;
	}, [toast]);

	const updateSpeech = useCallback(async (userId: string, id: string, title: string, content: string) => {
		if (!userId) throw new Error('User not authenticated');

		// Explicitly set the updated_at to ensure it's refreshed
		const { error } = await supabase
			.from('speeches')
			.update({
				title,
				content,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('user_id', userId);

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
	}, [toast]);

	const deleteSpeech = useCallback(async (userId: string, id: string) => {
		if (!userId) throw new Error('User not authenticated');

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

		toast({
			title: "Speech deleted",
			description: "Your speech has been deleted successfully.",
		});
	}, [toast]);

	return {
		fetchSpeeches,
		saveSpeech,
		updateSpeech,
		deleteSpeech
	};
};
