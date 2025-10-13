
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useSpeechService = () => {
	const { toast } = useToast();

	const fetchAllSpeeches = useCallback(async () => {
		console.log('Fetching all speeches from database');

		try {
			const { data, error } = await supabase
				.from('speeches')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching all speeches:', error);
				toast({
					title: "Error fetching speeches",
					description: error.message,
					variant: "destructive"
				});
				return [];
			}

			console.log('Fetched speeches:', data);
			return (data || []) as Speech[];
		} catch (fetchError) {
			console.error('Exception in fetchAllSpeeches:', fetchError);
			toast({
				title: "Error fetching speeches",
				description: "There was a problem retrieving speeches",
				variant: "destructive"
			});
			return [];
		}
	}, [toast]);

	const fetchSpeeches = useCallback(async (userId: string | undefined) => {
		if (!userId) {
			console.log('No userId provided, returning empty speeches array');
			return [];
		}

		console.log('Fetching speeches for user:', userId);

		try {
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

			console.log('Fetched user speeches:', data);
			return (data || []) as Speech[];
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
		
		console.log('updateSpeech called with:', { userId, id, title: title?.substring(0, 50), idType: typeof id });
		
		// Validate the ID is a proper string
		if (!id || typeof id !== 'string' || id === '[object Object]') {
			console.error('Invalid speech ID provided:', id, typeof id);
			throw new Error('Invalid speech ID provided');
		}

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
		fetchAllSpeeches,
		fetchSpeeches,
		saveSpeech,
		updateSpeech,
		deleteSpeech
	};
};
