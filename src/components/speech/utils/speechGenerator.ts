
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { parseDurationToMinutes } from './durationUtils';
import { enhanceSpeechForDuration } from './speechEnhancer';
import { createQuestionsAnswersSection } from './speechFormattingUtils';
import { createFormattedSpeech } from './speechContentCreator';
import { generateAIPrompt } from './aiPromptGenerator';
import { supabase } from '@/integrations/supabase/client';

/**
 * Call the Supabase Edge Function to generate a speech
 */
const generateSpeechWithSupabaseFunction = async (
	speechTitle: string,
	speechType: string,
	speechDetails: SpeechDetails
): Promise<string> => {
	try {
		// Prepare the request body
		const payload = {
			speechTitle,
			speechType,
			speechDetails
		};

		// Call the Supabase Edge Function
		const { data, error } = await supabase.functions.invoke('openai-gen', {
			body: payload
		});

		if (error) {
			console.error('Supabase function error:', error);
			throw new Error(`Failed to generate speech: ${error.message}`);
		}

		if (!data || !data.speech) {
			console.error('Invalid response from Supabase function:', data);
			throw new Error('Invalid response format from AI service');
		}

		return data.speech;
	} catch (error) {
		console.error('Error calling Supabase function:', error);
		throw error;
	}
};

/**
 * Generates a speech based on questionnaire answers using the Supabase Edge Function
 */
export const generateSpeechFromDetails = async (
	speechTitle: string,
	speechDetails: SpeechDetails = {},
	speechType: string = ''
): Promise<string> => {
	const detailsArray = Object.entries(speechDetails || {});

	if (detailsArray.length === 0) {
		return "This is your generated speech. Unfortunately, we couldn't find your questionnaire details. You can edit this placeholder text to create your own speech.";
	}

	try {
		// Store the original request for recovery purposes
		const requestData = {
			speechTitle,
			speechType,
			speechDetails,
			timestamp: new Date().toISOString()
		};
		localStorage.setItem('lastSpeechRequest', JSON.stringify(requestData));

		// Generate the speech using Supabase Edge Function
		const generatedSpeech = await generateSpeechWithSupabaseFunction(
			speechTitle,
			speechType,
			speechDetails
		);

		// Create multiple backup copies for recovery
		localStorage.setItem('generatedSpeech', generatedSpeech);
		localStorage.setItem('speechBackup', generatedSpeech);
		localStorage.setItem('tempGeneratedSpeech', generatedSpeech);

		// Process duration if specified to ensure appropriate length
		const durationInfo = detailsArray.find(([question]) =>
			question.toLowerCase().includes('length') ||
			question.toLowerCase().includes('duration') ||
			question.toLowerCase().includes('time') ||
			question.toLowerCase().includes('how long')
		);

		let finalSpeech = generatedSpeech;

		if (durationInfo && durationInfo[1]) {
			const targetDuration = parseDurationToMinutes(durationInfo[1]);
			console.log(`Target duration identified: ${targetDuration} minutes for speech of ${durationInfo[1]}`);
			finalSpeech = enhanceSpeechForDuration(finalSpeech, targetDuration);
			
			// Update all storage with the enhanced speech
			localStorage.setItem('generatedSpeech', finalSpeech);
			localStorage.setItem('speechBackup', finalSpeech);
			localStorage.setItem('tempGeneratedSpeech', finalSpeech);
		}

		return finalSpeech;
	} catch (error) {
		console.error('Error generating speech with AI:', error);

		// Fallback to the original method if function call fails
		console.log('Falling back to local speech generation method');

		// Generate the optimized AI prompt that would be sent to the third-party AI
		const aiPrompt = generateAIPrompt(speechTitle, speechType, speechDetails);
		console.log('Generated AI Prompt for third-party service:', aiPrompt);

		// Create the questions and answers section as a fallback
		const questionsAnswersSection = createQuestionsAnswersSection(speechDetails);

		// Create the formatted speech
		const formattedSpeech = createFormattedSpeech(speechTitle, speechDetails);

		// Combine the questions/answers section with the formatted speech
		let completeSpeech = questionsAnswersSection + formattedSpeech;

		// Process duration if specified
		const durationInfo = detailsArray.find(([question]) =>
			question.toLowerCase().includes('length') ||
			question.toLowerCase().includes('duration') ||
			question.toLowerCase().includes('time') ||
			question.toLowerCase().includes('how long')
		);

		if (durationInfo && durationInfo[1]) {
			const targetDuration = parseDurationToMinutes(durationInfo[1]);
			completeSpeech = enhanceSpeechForDuration(completeSpeech, targetDuration);
		} else {
			// Even if no specific duration is mentioned, apply some enhancement for consistency
			completeSpeech = enhanceSpeechForDuration(completeSpeech, 5); // Default to a 5-minute speech enhancement
		}

		// Store fallback speech for recovery
		localStorage.setItem('generatedSpeech', completeSpeech);
		localStorage.setItem('speechBackup', completeSpeech);

		return completeSpeech;
	}
};
