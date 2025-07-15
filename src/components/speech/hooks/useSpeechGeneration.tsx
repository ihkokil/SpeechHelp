import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSpeechFromDetails } from '../utils/speechGenerator';
import { SpeechDetails } from './useSpeechLabState';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechWorkPreservation } from '@/hooks/useSpeechWorkPreservation';

interface UseSpeechGenerationProps {
	speechTitle: string;
	speechDetails?: SpeechDetails;
	speechType: string;
	onSuccess: (speechId?: string) => void;
}

export const useSpeechGeneration = ({
	speechTitle,
	speechDetails = {},
	speechType,
	onSuccess
}: UseSpeechGenerationProps) => {
	const { toast } = useToast();
	const { user, saveSpeech, speeches } = useAuth();
	const [generating, setGenerating] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [generatedSpeech, setGeneratedSpeech] = useState('');
	const [autoSavedSpeechId, setAutoSavedSpeechId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Initialize work preservation
	const { 
		autoSaveToLocalStorage, 
		clearSavedWork,
		recoverWorkFromLocalStorage 
	} = useSpeechWorkPreservation({
		speechData: {
			title: speechTitle,
			content: generatedSpeech,
			speechType,
			speechDetails
		},
		isGenerating: generating,
		hasUnsavedChanges: Boolean(generatedSpeech && !showConfetti)
	});

	// Recovery on component mount
	useEffect(() => {
		const recoveredWork = recoverWorkFromLocalStorage();
		if (recoveredWork && recoveredWork.content && !generatedSpeech) {
			setGeneratedSpeech(recoveredWork.content);
			toast({
				title: "Work Recovered",
				description: "We recovered your previous speech generation session.",
			});
		}
	}, [recoverWorkFromLocalStorage, generatedSpeech, toast]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showConfetti) {
			timer = setTimeout(() => {
				setShowConfetti(false);
				clearSavedWork(); // Clear saved work after successful completion
				onSuccess(autoSavedSpeechId || undefined);
			}, 5000); // Show confetti for 5 seconds before moving to next step
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [showConfetti, onSuccess, clearSavedWork, autoSavedSpeechId]);

	const validateTitle = () => {
		if (!speechTitle.trim()) {
			toast({
				title: "Title Required",
				description: "Please enter a title for your speech",
				variant: "destructive",
			});
			return false;
		}
		return true;
	};

	const generateSpeech = async () => {
		if (!validateTitle()) {
			return;
		}

		if (!user) {
			toast({
				title: "Authentication Required",
				description: "Please sign in to generate and save your speech",
				variant: "destructive",
			});
			return;
		}

		setGenerating(true);
		setError(null);
		setAutoSavedSpeechId(null);

		// Immediately save work state before starting generation
		autoSaveToLocalStorage();

		try {
			// Generate the speech with OpenAI integration
			const speech = await generateSpeechFromDetails(speechTitle, speechDetails, speechType);
			setGeneratedSpeech(speech);

			// Save the generated speech to localStorage (for backup/recovery)
			localStorage.setItem('generatedSpeech', speech);

			// Auto-save the current state
			autoSaveToLocalStorage();

			// Automatically save the speech to the database
			try {
				const speechWithMetadata = {
					content: speech,
					details: speechDetails || {}
				};
				const contentToSave = JSON.stringify(speechWithMetadata);
				
				// Call saveSpeech and handle the response properly
				await saveSpeech(speechTitle, contentToSave, speechType);
				
				// Find the most recently created speech that matches our title from existing speeches
				let savedSpeechId: string | null = null;
				if (speeches && Array.isArray(speeches) && speeches.length > 0) {
					// Sort by creation date and find the most recent speech with matching title
					const sortedSpeeches = [...speeches].sort((a: any, b: any) => 
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
					
					const recentSpeech = sortedSpeeches.find((speech: any) => 
						speech.title === speechTitle
					);
					
					if (recentSpeech && recentSpeech.id) {
						savedSpeechId = recentSpeech.id;
					}
				}
				
				setAutoSavedSpeechId(savedSpeechId);

				toast({
					title: "Speech Generated & Saved",
					description: "Your AI-powered speech has been created and automatically saved to your account",
				});

				setShowConfetti(true);

			} catch (saveError) {
				console.error('Error auto-saving speech:', saveError);
				
				// Even if save fails, still show success for generation and keep the speech in localStorage
				toast({
					title: "Speech Generated",
					description: "Your speech was generated successfully. You can manually save it in the next step.",
				});
				
				setShowConfetti(true);
			}

		} catch (error) {
			console.error('Error generating speech:', error);
			setError(error instanceof Error ? error.message : 'Unknown error occurred');
			toast({
				title: "Generation Failed",
				description: error instanceof Error ? error.message : "Failed to generate speech. Please try again.",
				variant: "destructive",
			});
		} finally {
			setGenerating(false);
		}
	};

	return {
		generating,
		showConfetti,
		generatedSpeech,
		autoSavedSpeechId,
		error,
		generateSpeech
	};
};
