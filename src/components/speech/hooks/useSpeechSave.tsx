
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseSpeechSaveProps {
	title: string;
	content: string;
	speechType: string;
	speechDetails?: Record<string, string>;
}

export const useSpeechSave = ({
	title,
	content,
	speechType,
	speechDetails = {}
}: UseSpeechSaveProps) => {
	const [isSaving, setIsSaving] = useState(false);
	const [speechId, setSpeechId] = useState<string | null>(null);
	const { toast } = useToast();
	const { user, fetchSpeeches } = useAuth();

	const validateInputs = () => {
		if (!title.trim()) {
			toast({
				title: "Title Required",
				description: "Please enter a title for your speech",
				variant: "destructive",
			});
			return false;
		}

		if (!content.trim()) {
			toast({
				title: "Content Required",
				description: "Please enter content for your speech",
				variant: "destructive",
			});
			return false;
		}

		return true;
	};

	const handleSave = async () => {
		if (!validateInputs()) {
			return;
		}

		if (!user) {
			toast({
				title: "Authentication Required",
				description: "Please sign in to save your speech.",
				variant: "destructive",
			});
			return;
		}

		setIsSaving(true);

		try {
			const speechWithMetadata = {
				content: content,
				details: speechDetails || {}
			};

			const contentToSave = JSON.stringify(speechWithMetadata);

			if (speechId) {
				// Update existing speech
				const { error: updateError } = await supabase
					.from('speeches')
					.update({
						title,
						content: contentToSave,
						updated_at: new Date().toISOString(),
					})
					.eq('id', speechId)
					.eq('user_id', user.id);

				if (updateError) {
					console.error('Error updating speech:', updateError);
					throw updateError;
				}

				toast({
					title: "Speech Updated",
					description: "Your speech has been updated successfully.",
				});
			} else {
				// Create new speech
				const { data: speechData, error: insertError } = await supabase
					.from('speeches')
					.insert({
						user_id: user.id,
						title,
						content: contentToSave,
						speech_type: speechType,
					})
					.select()
					.single();

				if (insertError) {
					console.error('Error creating speech:', insertError);
					throw insertError;
				}

				if (speechData) {
					setSpeechId(speechData.id);
				}

				toast({
					title: "Speech Saved",
					description: "Your speech has been saved successfully.",
				});
			}

			// Refresh speeches list
			await fetchSpeeches();

		} catch (error: any) {
			console.error("Error saving speech:", error);
			
			toast({
				title: "Save Failed",
				description: error.message || "Failed to save speech. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	return {
		isSaving,
		handleSave,
		speechId
	};
};
