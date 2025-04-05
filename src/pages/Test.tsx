import { supabase } from '@/integrations/supabase/client';
import WelcomeEmail from '@/services/welcome-email';
import { FC, useEffect } from 'react';
import { renderToString } from 'react-dom/server';

const Test: FC = () => {
	useEffect(() => {
		const sendEmail = async () => {
			const { data, error } = await supabase.functions.invoke('send-email', {
				method: 'POST',
				body: {
					email: 'matt@strukt.io',
					subject: "Welcome to SpeechHelp!",
					emailHtml: renderToString(WelcomeEmail({ username: 'there' })),
					message: "Welcome to SpeechHelp! Please check your email to confirm your account."
				}
			});
			console.log(data, error)
		}
		sendEmail();
	}, [])
	return (
		<div className="min-h-screen flex items-center justify-center">
			<h1 className="text-3xl font-bold">Hello World!</h1>
		</div>
	);
};

export default Test;
