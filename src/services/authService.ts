
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

// Service functions now accept toast function as a parameter
export const signIn = async (email: string, password: string, showToast: ShowToastFunction) => {
	try {
		// Clean up any existing auth state first
		await supabase.auth.signOut({ scope: 'global' });
		
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			console.error('Sign in error:', error);
			
			// Handle specific error types
			if (error.message.includes('Invalid login credentials')) {
				showToast({
					title: "Login failed",
					description: "Invalid email or password. Please check your credentials and try again.",
					variant: "destructive"
				});
			} else if (error.message.includes('Email not confirmed')) {
				showToast({
					title: "Email not confirmed",
					description: "Please check your email and click the confirmation link before signing in.",
					variant: "destructive"
				});
			} else {
				showToast({
					title: "Login failed",
					description: error.message,
					variant: "destructive"
				});
			}
			throw error;
		}

		showToast({
			title: "Login successful",
			description: "Welcome back!",
		});
	} catch (error) {
		console.error('Sign in error:', error);
		throw error;
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
		// Clean up any existing auth state first
		await supabase.auth.signOut({ scope: 'global' });
		
		const res = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
					is_active: false,
					subscription_plan: SubscriptionPlan.FREE_TRIAL,
					subscription_start_date: new Date().toISOString(),
					subscription_end_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
				}
			}
		});
		
		console.log("Sign up response:", res);

		if (res.error) {
			console.error('Sign up error:', res.error);
			
			// Handle specific error types
			if (res.error.message.includes('User already registered')) {
				showToast({
					title: "Account already exists",
					description: "An account with this email already exists. Please sign in instead.",
					variant: "destructive"
				});
			} else if (res.error.message.includes('Password should be at least')) {
				showToast({
					title: "Password too weak",
					description: "Password should be at least 6 characters long.",
					variant: "destructive"
				});
			} else {
				showToast({
					title: "Sign up failed",
					description: res.error.message,
					variant: "destructive"
				});
			}
			throw res.error;
		}

		// If user was created successfully, send confirmation email
		if (res.data.user && !res.error) {
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
					// Don't throw here, just log the error as signup was successful
					showToast({
						title: "Account created",
						description: "Your account was created but we couldn't send the confirmation email. Please contact support.",
						variant: "destructive"
					});
				} else {
					console.log('Confirmation email sent successfully:', emailData);
					showToast({
						title: "Account created successfully",
						description: "Please check your email to confirm your account and complete the setup.",
					});
				}
			} catch (emailErr) {
				console.error('Exception sending confirmation email:', emailErr);
				// Don't throw here, just log the error as signup was successful
				showToast({
					title: "Account created",
					description: "Your account was created but we couldn't send the confirmation email. Please contact support.",
					variant: "destructive"
				});
			}
		}
	} catch (error: any) {
		console.error('Sign up error:', error);
		throw error;
	}
};

export const resetPassword = async (email: string, showToast: ShowToastFunction) => {
	try {
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showToast({
				title: "Invalid email",
				description: "Please enter a valid email address.",
				variant: "destructive"
			});
			return;
		}

		console.log('Starting password reset for:', email);
		
		// Call our custom password reset function
		const { data, error } = await supabase.functions.invoke('send-password-reset', {
			body: {
				email: email,
				resetUrl: `${window.location.origin}/auth?type=recovery`
			}
		});

		console.log('Password reset response:', { data, error });

		if (error) {
			console.error('Password reset error:', error);
			showToast({
				title: "Error sending reset email",
				description: "Failed to send password reset email. Please try again or contact support.",
				variant: "destructive"
			});
			throw error;
		}

		if (data?.success) {
			// Log the reset link for development/testing
			if (data.resetLink) {
				console.log('Password reset link (for testing):', data.resetLink);
			}
			
			// Show appropriate message based on email service configuration
			if (data.emailSent) {
				showToast({
					title: "Password reset sent",
					description: "Check your email for password reset instructions.",
				});
			} else {
				showToast({
					title: "Password reset link generated",
					description: data.note || "Check your email for password reset instructions. If you don't receive it, please contact support.",
				});
			}
		} else {
			throw new Error(data?.error || 'Unknown error occurred');
		}
	} catch (error: any) {
		console.error('Password reset error:', error);
		showToast({
			title: "Error sending reset email",
			description: error.message || "Failed to send password reset email. Please try again.",
			variant: "destructive"
		});
		throw error;
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
