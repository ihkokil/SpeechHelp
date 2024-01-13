import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { LimitType } from '@/lib/plan_rules';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface ProfileProps {
	/** Optional callback to run after successful profile update */
	onSuccess?: (profileId: string) => void;
	/** Optional callback to handle upgrade redirect */
	onUpgradeNeeded?: () => void;
}

/**
 * Hook for creating speeches with plan limit enforcement
 */
export function useProfile({ onSuccess, onUpgradeNeeded }: ProfileProps = {}) {
	const { user, fetchSpeeches } = useAuth();
	const { toast } = useToast();
	const planLimits = usePlanLimits();

	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);

	/**
	 * Attempt to create a new speech
	 */
	type Profile = Database['public']['Tables']['profiles']['Row'];
	const updateProfile = async (profileData: Partial<Profile>) => {
		if (!user) {
			toast({
				title: "Authentication error",
				description: "You must be logged in to update your profile.",
				variant: "destructive",
			});
			return null;
		}

		// Clear any previous errors
		setUpdateError(null);

		// Check if user can create a new speech based on their plan
		if (!planLimits.canCreateSpeech) {
			setUpdateError(planLimits.reasonCannotCreate || "You've reached your plan's limit for speeches.");

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
		setIsUpdating(true);

		try {
			// Create the speech in the database
			const { data, error } = await supabase
				.from('profiles')
				.update(profileData)
				.eq('id', user.id)
				.select()
				.single();

			if (error) {
				throw error;
			}

			// Show success message
			toast({
				title: "Profile updated",
				description: "Your profile has been updated successfully.",
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

			const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
			setUpdateError(errorMessage);

			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});

			return null;
		} finally {
			setIsUpdating(false);
		}
	};

	// Return everything needed for speech creation
	return {
		updateProfile,
		isUpdating,
		updateError,
	};
} 