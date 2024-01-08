import { supabase } from '@/integrations/supabase/client';
import WelcomeEmail from './welcome-email.tsx';
import { renderToString } from 'react-dom/server';

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
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		showToast({
			title: "Login failed",
			description: error.message,
			variant: "destructive"
		});
		throw error;
	}

	showToast({
		title: "Login successful",
		description: "Welcome back!",
	});
};

export const signUp = async (
	email: string,
	password: string,
	showToast: ShowToastFunction,
	firstName?: string,
	lastName?: string
) => {
	const res = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				first_name: firstName,
				last_name: lastName
			}
		}
	});
	console.log("RES", res)
	if (res.data.user || res.data.session) {
		// Call the Supabase Edge Function
		const { data, error } = await supabase.functions.invoke('send-email', {
			body: {
				email: email,
				subject: "Welcome to SpeechHelp!",
				emailHtml: renderToString(WelcomeEmail({ username: firstName || 'there' })),
				message: "Welcome to SpeechHelp! Please check your email to confirm your account."
			}
		});
		showToast({
			title: "Sign up successful",
			description: "Welcome to SpeechHelp! Please check your email to confirm your account.",
		});
	}

	if (res.error) {
		showToast({
			title: "Sign up failed",
			description: res.error.message,
			variant: "destructive"
		});
		throw res.error;
	}

	showToast({
		title: "Sign up successful",
		description: "Welcome to SpeechHelp! Please check your email to confirm your account.",
	});
};

export const signOut = async (showToast: ShowToastFunction) => {
	const { error } = await supabase.auth.signOut();

	if (error) {
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
};
