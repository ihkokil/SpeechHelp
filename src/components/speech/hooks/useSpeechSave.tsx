
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechService } from '@/services/speechService';

interface UseSpeechSaveProps {
	title: string;
	content: string;
	speechType: string;
	speechDetails?: Record<string, string>;
	initialSpeechId?: string;
}

export const useSpeechSave = ({
	title,
	content,
	speechType,
	speechDetails = {},
	initialSpeechId
}: UseSpeechSaveProps) => {
	const [isSaving, setIsSaving] = useState(false);
	const [speechId, setSpeechId] = useState<string | null>(initialSpeechId || null);
	const [showSaveEffects, setShowSaveEffects] = useState(false);
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

			// Always check if we have an existing speech ID (either from auto-save or previous saves)
			const currentSpeechId = speechId || initialSpeechId;

			if (currentSpeechId) {
				// Update existing speech
				await speechService.updateSpeech(user.id, currentSpeechId, title, contentToSave);
				
				// Trigger celebration effects for successful edit
				setShowSaveEffects(true);
				setTimeout(() => setShowSaveEffects(false), 5000);
				
				toast({
					title: "Speech Updated! 🎉",
					description: "Your speech has been updated successfully.",
				});
			} else {
				// Create new speech only if no existing ID
				const speechResponse = await speechService.saveSpeech(user.id, title, contentToSave, speechType);
				
				// Extract the speech ID correctly from the response
				if (Array.isArray(speechResponse) && speechResponse.length > 0) {
					const firstItem = speechResponse[0];
					if (firstItem && typeof firstItem === 'object' && 'id' in firstItem) {
						setSpeechId(firstItem.id as string);
					}
				} else if (speechResponse && typeof speechResponse === 'object' && 'id' in speechResponse) {
					setSpeechId(speechResponse.id as string);
				}
				
				// Trigger celebration effects for successful save
				setShowSaveEffects(true);
				setTimeout(() => setShowSaveEffects(false), 5000);
				
				toast({
					title: "Speech Saved! 🎉",
					description: "Your speech has been saved successfully.",
				});
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
		speechId: speechId || initialSpeechId,
		showSaveEffects
	};
};
