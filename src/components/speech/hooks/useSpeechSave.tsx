
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechService } from '@/services/speechService';

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
	const { user } = useAuth();
	const speechService = useSpeechService();

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

		setIsSaving(true);

		try {
			const speechWithMetadata = {
				content: content,
				details: speechDetails || {}
			};

			const contentToSave = JSON.stringify(speechWithMetadata);

			if (speechId) {
				await speechService.updateSpeech(user.id, speechId, title, contentToSave);
				toast({
					title: "Speech Updated",
					description: "Your speech has been updated successfully.",
				});
			} else {
				if (user) {
					let speech = await speechService.saveSpeech(user.id, title, contentToSave, speechType);
					setSpeechId(speech);
					toast({
						title: "Speech Saved",
						description: "Your speech has been saved successfully.",
					});
				} else {
					toast({
						title: "Authentication Required",
						description: "Please sign in to save your speech.",
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save speech. Please try again.",
				variant: "destructive",
			});
			console.error("Error saving speech:", error);
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
