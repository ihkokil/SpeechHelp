
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { LimitType } from '@/lib/plan_rules';
import { supabase } from '@/integrations/supabase/client';

interface SpeechCreationProps {
	/** Optional callback to run after successful speech creation */
	onSuccess?: (speechId: string) => void;
	/** Optional callback to handle upgrade redirect */
	onUpgradeNeeded?: () => void;
}

/**
 * Hook for creating speeches with plan limit enforcement
 */
export function useSpeechCreation({ onSuccess, onUpgradeNeeded }: SpeechCreationProps = {}) {
	const { user, fetchSpeeches } = useAuth();
	const { toast } = useToast();
	const planLimits = usePlanLimits();

	const [isCreating, setIsCreating] = useState(false);
	const [speechError, setSpeechError] = useState<string | null>(null);

	/**
	 * Attempt to create a new speech
	 */
	const createSpeech = async (title: string, content: string, speechType: string) => {
		if (!user) {
			toast({
				title: "Authentication error",
				description: "You must be logged in to create a speech.",
				variant: "destructive",
			});
			return null;
		}

		// Clear any previous errors
		setSpeechError(null);

		// Check if user can create a new speech based on their plan
		if (!planLimits.canCreateSpeech) {
			setSpeechError(planLimits.reasonCannotCreate || "You've reached your plan's limit for speeches.");

			// Notify the user
			toast({
				title: "Plan limit reached",
				description: planLimits.reasonCannotCreate || "You've reached your plan's limit for speeches.",
				variant: "destructive",
			});

			// Trigger upgrade redirect if provided
			if (onUpgradeNeeded) {
				onUpgradeNeeded();
			}

			return null;
		}

		// If we're good to go, create the speech
		setIsCreating(true);

		try {
			// Check permissions again and get the period ID
			const { data: permissionCheck, error: permissionError } = await supabase
				.rpc('can_create_speech_with_credits', { user_id_param: user.id });

			const permissions = permissionCheck as {
				allowed: boolean;
				reason?: string;
				period_id?: string;
			} | null;

			if (permissionError || !permissions?.allowed) {
				throw new Error(permissions?.reason || 'Unable to create speech');
			}

			// Create the speech in the database with the current credit period
			const { data, error } = await supabase
				.from('speeches')
				.insert([
					{
						title,
						content,
						speech_type: speechType,
						user_id: user.id,
						plan_period_id: permissions.period_id
					}
				])
				.select()
				.single();

			if (error) {
				throw error;
			}

			// Show success message
			toast({
				title: "Speech created",
				description: "Your speech has been created successfully.",
			});

			// Execute success callback if provided
			if (onSuccess && data.id) {
				onSuccess(data.id);
			}

			// Fetch speeches again to update the count
			await fetchSpeeches();

			return data.id;
		} catch (error) {
			console.error('Error creating speech:', error);

			const errorMessage = error instanceof Error ? error.message : "Failed to create speech";
			setSpeechError(errorMessage);

			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});

			return null;
		} finally {
			setIsCreating(false);
		}
	};

	// Return everything needed for speech creation
	return {
		createSpeech,
		isCreating,
		speechError,
		// Plan limit info
		canCreateSpeech: planLimits.canCreateSpeech,
		speechesRemaining: planLimits.speechesRemaining,
		reasonCannotCreate: planLimits.reasonCannotCreate
	};
}
