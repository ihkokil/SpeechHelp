
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
	const { user, saveSpeech } = useAuth();
	const [generating, setGenerating] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [generatedSpeech, setGeneratedSpeech] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [autoSavedSpeechId, setAutoSavedSpeechId] = useState<string | null>(null);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showConfetti) {
			timer = setTimeout(() => {
				setShowConfetti(false);
				onSuccess();
			}, 5000);
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

	const autoSaveSpeech = async (speech: string) => {
		if (!user) return;

		try {
			console.log('Auto-saving generated speech...');
			await saveSpeech(speechTitle, speech, speechType);
			
			toast({
				title: "Speech Auto-Saved",
				description: "Your generated speech has been automatically saved to your account.",
			});
		} catch (error) {
			console.error('Error auto-saving speech:', error);
			// Don't show error toast for auto-save failures - user can still manually save
		}
	};

	const generateSpeech = async () => {
		if (!validateTitle()) {
			return;
		}

		if (!user) {
			toast({
				title: "Authentication Required",
				description: "Please sign in to generate speeches",
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

			// Save the generated speech to localStorage for recovery
			localStorage.setItem('generatedSpeech', speech);
			localStorage.setItem('speechBackup', speech);
			localStorage.setItem('tempGeneratedSpeech', speech);

			// Auto-save the speech to database
			await autoSaveSpeech(speech);

			toast({
				title: "Speech Generated Successfully",
				description: "Your AI-powered speech has been created and automatically saved.",
			});

			setShowConfetti(true);

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
		autoSavedSpeechId,
		generateSpeech
	};
};
