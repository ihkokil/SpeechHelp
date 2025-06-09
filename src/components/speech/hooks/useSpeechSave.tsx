
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
	const { user, session, refreshUser } = useAuth();

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

		if (!user || !session) {
			toast({
				title: "Authentication Required",
				description: "Please sign in to save your speech.",
				variant: "destructive",
			});
			return;
		}

		setIsSaving(true);

		try {
			// Check if session is still valid before proceeding
			const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
			
			if (sessionError || !currentSession) {
				console.error('Session validation failed:', sessionError);
				await refreshUser();
				toast({
					title: "Session Expired",
					description: "Please try saving again.",
					variant: "destructive",
				});
				return;
			}

			const speechWithMetadata = {
				content: content,
				details: speechDetails || {}
			};

			const contentToSave = JSON.stringify(speechWithMetadata);

			// Check if there's already a speech with the same title (auto-saved version)
			const { data: existingSpeeches, error: fetchError } = await supabase
				.from('speeches')
				.select('id')
				.eq('user_id', user.id)
				.eq('title', title)
				.eq('speech_type', speechType);

			if (fetchError) {
				console.error('Error checking for existing speech:', fetchError);
				// Continue with insert if we can't check
			}

			if (existingSpeeches && existingSpeeches.length > 0) {
				// Update existing speech (overwrite auto-saved version)
				const existingSpeechId = existingSpeeches[0].id;
				const { error: updateError } = await supabase
					.from('speeches')
					.update({
						title,
						content: contentToSave,
						updated_at: new Date().toISOString(),
					})
					.eq('id', existingSpeechId)
					.eq('user_id', user.id);

				if (updateError) {
					console.error('Error updating speech:', updateError);
					if (updateError.code === 'PGRST301') {
						await refreshUser();
						throw new Error('Session expired. Please try again.');
					}
					throw updateError;
				}

				setSpeechId(existingSpeechId);
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
					if (insertError.code === 'PGRST301') {
						await refreshUser();
						throw new Error('Session expired. Please try again.');
					}
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

			// Clear localStorage backup after successful save
			localStorage.removeItem('generatedSpeech');
			localStorage.removeItem('speechBackup');
			localStorage.removeItem('tempGeneratedSpeech');

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
