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
	const [generationLocked, setGenerationLocked] = useState(false);
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
		if (showConfetti) {
			// Immediately proceed to next step - no delay
			setShowConfetti(false);
			clearSavedWork(); // Clear saved work after successful completion
			onSuccess(autoSavedSpeechId || undefined);
		}
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

		// Prevent multiple simultaneous generations
		if (generating || generationLocked) {
			console.log('Generation already in progress, ignoring request');
			return;
		}

		// Clear all previous states and lock generation
		setGenerating(true);
		setGenerationLocked(true);
		setError(null);
		setAutoSavedSpeechId(null);
		setGeneratedSpeech('');
		setShowConfetti(false);

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
				
				// Call saveSpeech and get the returned speech data
				const savedSpeechData = await saveSpeech(speechTitle, contentToSave, speechType);
				
				console.log('Speech saved successfully, received data:', savedSpeechData);
				
				// Extract the ID from the returned speech data
				let savedSpeechId: string | null = null;
				if (savedSpeechData && savedSpeechData.id && typeof savedSpeechData.id === 'string') {
					savedSpeechId = savedSpeechData.id;
					console.log('Successfully extracted speech ID:', savedSpeechId);
				} else {
					console.log('No valid ID in saved speech data:', savedSpeechData);
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
			setGenerationLocked(false);
		}
	};

	return {
		generating: generating || generationLocked,
		showConfetti,
		generatedSpeech,
		autoSavedSpeechId,
		error,
		generateSpeech
	};
};
