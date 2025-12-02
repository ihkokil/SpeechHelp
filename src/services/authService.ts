import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/lib/plan_rules.ts';

// Define the ToastProps type directly here to avoid the import error
type ToastProps = {
	title?: string;
	description?: string;
	variant?: 'default' | 'destructive';
};

// Create a type for the showToast function that will be passed in
type ShowToastFunction = (props: ToastProps) => void;

export const verifyEmail = async (email: string, showToast: ShowToastFunction) => {
	try {
		// Check if user exists with this email
		const { data, error } = await supabase.functions.invoke('verify-email', {
			body: { email }
		});

		if (error) {
			console.error('Email verification error:', error);
			showToast({
				title: "Verification failed",
				description: "Unable to verify email. Please try again.",
				variant: "destructive"
			});
			return { success: false };
		}

		if (data.userExists) {
			return { 
				success: true, 
				userExists: true, 
				has2FA: data.has2FA,
				userId: data.userId 
			};
		} else {
			showToast({
				title: "Email not found",
				description: "No account found with this email address.",
				variant: "destructive"
			});
			return { success: false, userExists: false };
		}
	} catch (error: any) {
		console.error('Email verification error:', error);
		showToast({
			title: "Verification failed",
			description: "Unable to verify email. Please try again.",
			variant: "destructive"
		});
		return { success: false };
	}
};

export const verifyPassword = async (
	email: string, 
	password: string, 
	showToast: ShowToastFunction
) => {
	try {
		// Use the verify-password edge function instead of signing in directly
		const { data, error } = await supabase.functions.invoke('verify-password', {
			body: { email, password }
		});

		if (error) {
			console.error('Password verification error:', error);
			showToast({
				title: "Invalid password",
				description: "The password you entered is incorrect.",
				variant: "destructive"
			});
			return { success: false };
		}

		if (data.success) {
			return { 
				success: true, 
				userId: data.userId 
			};
		} else {
			// Check if the error is due to email not confirmed
			if (data.error === "email_not_confirmed") {
				return { 
					success: false, 
					error: "email_not_confirmed",
					message: data.message 
				};
			}
			
			showToast({
				title: "Invalid password",
				description: "The password you entered is incorrect.",
				variant: "destructive"
			});
			return { success: false };
		}
	} catch (error: any) {
		console.error('Password verification error:', error);
		showToast({
			title: "Verification failed",
			description: "Unable to verify password. Please try again.",
			variant: "destructive"
		});
		return { success: false };
	}
};

export const verify2FA = async (
	userId: string,
	code: string,
	showToast: ShowToastFunction
) => {
	try {
		const { data, error } = await supabase.functions.invoke('verify-2fa-login', {
			body: { userId, code }
		});

		if (error) {
			console.error('2FA verification error:', error);
			showToast({
				title: "Verification failed",
				description: "Unable to verify 2FA code. Please try again.",
				variant: "destructive"
			});
			return { success: false };
		}

		if (data.success) {
			return { success: true };
		} else {
			showToast({
				title: "Invalid code",
				description: "The 2FA code you entered is incorrect.",
				variant: "destructive"
			});
			return { success: false };
		}
	} catch (error: any) {
		console.error('2FA verification error:', error);
		showToast({
			title: "Verification failed",
			description: "Unable to verify 2FA code. Please try again.",
			variant: "destructive"
		});
		return { success: false };
	}
};

// New function to complete the login after 2FA or for users without 2FA
export const completeLogin = async (
	email: string,
	password: string,
	showToast: ShowToastFunction
) => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error('Login completion error:', error);
			showToast({
				title: "Login failed",
				description: "Unable to complete login. Please try again.",
				variant: "destructive"
			});
			return { success: false };
		}

		if (data.user) {
			return { 
				success: true, 
				user: data.user,
				session: data.session 
			};
		}

		return { success: false };
	} catch (error: any) {
		console.error('Login completion error:', error);
		showToast({
			title: "Login failed",
			description: "Unable to complete login. Please try again.",
			variant: "destructive"
		});
		return { success: false };
	}
};

// Helper function to check if user has used free trial
const checkFreeTrialUsage = async (email: string) => {
	try {
		// Check if any user with this email has ever had a free trial
		const { data, error } = await supabase
			.from('profiles')
			.select('subscription_plan, subscription_start_date')
			.eq('id', (await supabase.auth.getUser()).data.user?.id);

		if (error) {
			console.error('Error checking free trial usage:', error);
			return { hasUsedTrial: false };
		}

		// Also check if there's any auth user with this email that might have used free trial
		const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
		
		if (!authError && authUsersData && authUsersData.users) {
			const existingUser = authUsersData.users.find((user: any) => user.email === email);
			if (existingUser) {
				// Check if this user's profile shows they've used free trial
				const { data: profile } = await supabase
					.from('profiles')
					.select('subscription_plan, subscription_start_date')
					.eq('id', existingUser.id)
					.single();

				if (profile && profile.subscription_plan) {
					return { hasUsedTrial: true };
				}
			}
		}

		return { hasUsedTrial: false };
	} catch (error) {
		console.error('Error in checkFreeTrialUsage:', error);
		return { hasUsedTrial: false };
	}
};

export const signUp = async (
	email: string,
	password: string,
	showToast: ShowToastFunction,
	firstName?: string,
	lastName?: string
) => {
	try {
		console.log('SignUp: Starting signup process for:', email);
		
		// First, check if user already exists
		console.log('SignUp: Checking if user already exists...');
		const { data: emailCheckData, error: emailCheckError } = await supabase.functions.invoke('verify-email', {
			body: { email }
		});

		if (emailCheckError) {
			console.error('SignUp: Error checking email existence:', emailCheckError);
			// Continue with signup if check fails - don't block the process
		} else if (emailCheckData && emailCheckData.userExists) {
			console.log('SignUp: User already exists with this email');
			const error = new Error('User already registered');
			error.message = 'User already registered';
			throw error;
		}

		// Check if this email has been used for free trial before
		const { hasUsedTrial } = await checkFreeTrialUsage(email);
		
		let subscriptionPlan = SubscriptionPlan.FREE_TRIAL;
		let subscriptionStatus = 'active';
		let subscriptionStartDate = new Date().toISOString();
		let subscriptionEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

		// If user has used free trial before, they don't get another one
		if (hasUsedTrial) {
			console.log('SignUp: User has already used free trial, no trial will be granted');
			subscriptionPlan = SubscriptionPlan.FREE_TRIAL;
			subscriptionStatus = 'expired';
			subscriptionEndDate = new Date().toISOString(); // Set to now (expired)
			
			showToast({
				title: "Account created",
				description: "Your free trial has already been used. Please choose a paid plan to continue using SpeechHelp.",
				variant: "default"
			});
		}

		console.log('SignUp: User does not exist, proceeding with signup...');
		
		// Clean up any existing auth state first
		await supabase.auth.signOut({ scope: 'global' });
		
		const res = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					is_active: true,
					subscription_plan: subscriptionPlan,
					subscription_status: subscriptionStatus,
					subscription_start_date: subscriptionStartDate,
					subscription_end_date: subscriptionEndDate,
				}
			}
		});
		
		console.log("Sign up response:", res);

		if (res.error) {
			console.error('Sign up error:', res.error);
			
			// Handle specific error types with more detailed error messages
			if (res.error.message.includes('User already registered')) {
				const error = new Error('User already registered');
				error.message = 'User already registered';
				throw error;
			} else if (res.error.message.includes('Password should be at least')) {
				const error = new Error('Password should be at least 6 characters long');
				error.message = 'Password should be at least 6 characters long';
				throw error;
			} else if (res.error.message.includes('Invalid email')) {
				const error = new Error('Invalid email address');
				error.message = 'Invalid email address';
				throw error;
			} else {
				// For any other error, throw the original error
				throw res.error;
			}
		}

		// If user was created successfully, send confirmation email
		if (res.data.user && !res.error) {
			console.log('SignUp: User created successfully, sending confirmation email...');
			
			// Show appropriate success message based on trial status
			if (hasUsedTrial) {
				showToast({
					title: "Account created",
					description: "Please check your email to confirm your account. Note: Your free trial has already been used.",
				});
			} else {
				showToast({
					title: "Account created successfully",
					description: "Please check your email to confirm your account and start your 7-day free trial.",
				});
			}

			try {
				// Call the send-confirmation edge function
				const { data: emailData, error: emailError } = await supabase.functions.invoke('send-confirmation', {
					body: {
						email: email,
						confirmationUrl: `${window.location.origin}/auth?type=signup&email=${encodeURIComponent(email)}`,
						firstName: firstName,
						lastName: lastName
					}
				});

				if (emailError) {
					console.error('Error sending confirmation email:', emailError);
					// Don't show error to user since account was created successfully
					// Just log for debugging
				} else {
					console.log('Confirmation email sent successfully:', emailData);
				}
			} catch (emailErr) {
				console.error('Exception sending confirmation email:', emailErr);
				// Don't show error to user since account was created successfully
				// Just log for debugging
			}
		}
	} catch (error: any) {
		console.error('Sign up error:', error);
		throw error;
	}
};

export const resendConfirmationEmail = async (
	email: string, 
	showToast: ShowToastFunction
) => {
	try {
		console.log('Attempting to resend confirmation email for:', email);
		const { data, error } = await supabase.functions.invoke('resend-confirmation', {
			body: { email }
		});

		console.log('Resend confirmation response:', { data, error });

		if (error) {
			console.error('Resend confirmation error:', error);
			showToast({
				title: "Failed to resend",
				description: "Unable to resend confirmation email. Please try again.",
				variant: "destructive"
			});
			return { success: false };
		}

		if (data.success) {
			showToast({
				title: "Email sent",
				description: "A new confirmation email has been sent to your inbox.",
			});
			return { success: true };
		} else {
			showToast({
				title: "Failed to resend",
				description: "Unable to resend confirmation email. Please try again.",
				variant: "destructive"
			});
			return { success: false };
		}
	} catch (error: any) {
		console.error('Resend confirmation error:', error);
		showToast({
			title: "Failed to resend",
			description: "Unable to resend confirmation email. Please try again.",
			variant: "destructive"
		});
		return { success: false };
	}
};

export const signOut = async (showToast: ShowToastFunction) => {
	try {
		// Clean up local storage first
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
				localStorage.removeItem(key);
			}
		});

		const { error } = await supabase.auth.signOut({ scope: 'global' });

		if (error) {
			console.error('Sign out error:', error);
			showToast({
				title: "Sign out failed",
				description: error.message,
				variant: "destructive"
			});
			throw error;
		}

		showToast({
			title: "Signed out",
			description: "You have been signed out successfully.",
		});

		// Force page reload to ensure clean state
		setTimeout(() => {
			window.location.href = '/auth';
		}, 500);
	} catch (error) {
		console.error('Sign out error:', error);
		// Even if there's an error, try to redirect to clear state
		setTimeout(() => {
			window.location.href = '/auth';
		}, 500);
		throw error;
	}
};
