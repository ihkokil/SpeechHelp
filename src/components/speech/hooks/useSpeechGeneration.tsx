import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSpeechFromDetails } from '../utils/speechGenerator';
import { SpeechDetails } from './useSpeechLabState';
import { useAuth } from '@/contexts/AuthContext';

interface UseSpeechGenerationProps {
	speechTitle: string;
	speechDetails?: SpeechDetails;
	speechType: string;
	onSuccess: () => void;
}

export const useSpeechGeneration = ({
	speechTitle,
	speechDetails = {},
	speechType,
	onSuccess
}: UseSpeechGenerationProps) => {
	const { toast } = useToast();
	const { user, saveSpeech, fetchSpeeches } = useAuth();
	const [generating, setGenerating] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [generatedSpeech, setGeneratedSpeech] = useState('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showConfetti) {
			timer = setTimeout(() => {
				setShowConfetti(false);
				onSuccess();
			}, 5000); // Show confetti for 5 seconds before moving to next step
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [showConfetti, onSuccess]);

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

		try {
			// Generate the speech with OpenAI integration
			const speech = await generateSpeechFromDetails(speechTitle, speechDetails, speechType);
			setGeneratedSpeech(speech);

			// Save the generated speech to localStorage (for backup/recovery)
			localStorage.setItem('generatedSpeech', speech);

			// Automatically save the speech to the database
			try {
				const speechWithMetadata = {
					content: speech,
					details: speechDetails || {}
				};
				const contentToSave = JSON.stringify(speechWithMetadata);
				
				// Check if user is still authenticated before saving
				if (!user) {
					throw new Error('User session expired during speech generation');
				}
				
				await saveSpeech(speechTitle, contentToSave, speechType);
				
				// Refresh speeches list to include the new speech
				await fetchSpeeches();

				toast({
					title: "Speech Generated & Saved",
					description: "Your AI-powered speech has been created and automatically saved to your account",
				});

				setShowConfetti(true);

			} catch (saveError) {
				console.error('Error auto-saving speech:', saveError);
				
				// Check if it's an auth error
				if (saveError instanceof Error && saveError.message.includes('session expired')) {
					toast({
						title: "Session Expired",
						description: "Your session expired during speech generation. Please sign in again to save your speech.",
						variant: "destructive",
					});
					setError('Session expired - please sign in again');
				} else {
					// Even if save fails, still show success for generation and keep the speech in localStorage
					toast({
						title: "Speech Generated",
						description: "Your speech was generated successfully. You can manually save it in the next step.",
					});
					
					setShowConfetti(true);
				}
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
		error,
		generateSpeech
	};
};
