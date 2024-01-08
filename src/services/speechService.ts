
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const useSpeechService = () => {
	const { toast } = useToast();

	const fetchSpeeches = async (userId: string | undefined) => {
		if (!userId) return [];

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
			return [];
		}

		return data as Speech[] || [];
	};

	const saveSpeech = async (userId: string, title: string, content: string, speechType: string) => {
		if (!userId) throw new Error('User not authenticated');

		const { data: speech, error } = await supabase
			.from('speeches')
			.insert({
				user_id: userId,
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
		return speech;
	};

	const updateSpeech = async (userId: string, id: string, title: string, content: string) => {
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
	};

	const deleteSpeech = async (userId: string, id: string) => {
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
	};

	return {
		fetchSpeeches,
		saveSpeech,
		updateSpeech,
		deleteSpeech
	};
};
