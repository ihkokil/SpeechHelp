import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import AnimatedGenie from './AnimatedGenie';

interface SpeechGenerationProgressProps {
	showConfetti: boolean;
}

const SpeechGenerationProgress: React.FC<SpeechGenerationProgressProps> = ({ showConfetti }) => {
	const [progress, setProgress] = useState(0);
	const [showDeliveryMessage, setShowDeliveryMessage] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(prevProgress => {
				if (prevProgress >= 100) {
					clearInterval(interval);
					// Trigger delivery message before confetti
					setTimeout(() => setShowDeliveryMessage(true), 500);
					return 100;
				}
				return prevProgress + 1;
			});
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const getProgressMessage = () => {
		if (progress < 20) return "Hmm, let me think about this...";
		if (progress < 40) return "Gathering inspiration from the speech gods...";
		if (progress < 60) return "Writing... no wait, that's not quite right...";
		if (progress < 80) return "Ah yes! This is much better!";
		if (progress < 95) return "Adding the perfect finishing touches...";
		if (progress < 100) return "Almost there... just straightening my tie...";
		return "DELIVERY! Your speech is ready! 🎉";
	};

	return (
		<div className="space-y-6">
			{/* Animated Genie */}
			<div className="flex justify-center">
				<AnimatedGenie progress={progress} />
			</div>

			<div className="text-center font-medium">
				<p className="mb-2 text-lg">Your AI Speech Genie is at work!</p>
				<p className="text-sm text-muted-foreground min-h-[1.25rem]">
					{getProgressMessage()}
				</p>
			</div>

			<Progress value={progress} className="h-3" />

			{/* Delivery Message */}
			{showDeliveryMessage && progress >= 100 && (
				<div className="text-center animate-scale-in">
					<div className="text-2xl font-bold text-primary mb-2">
						🎁 DELIVERY! 🎁
					</div>
					<p className="text-lg text-muted-foreground">
						Your personalized speech is ready for review!
					</p>
				</div>
			)}

			{/* Enhanced Confetti with custom colors */}
			{showConfetti && progress >= 100 && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					recycle={false}
					numberOfPieces={300}
					colors={['#ec4899', '#8b5cf6', '#f97316', '#3b82f6', '#10b981']}
					confettiSource={{
						x: window.innerWidth / 2,
						y: window.innerHeight / 3,
						w: 100,
						h: 100
					}}
				/>
			)}
		</div>
	);
};

export default SpeechGenerationProgress;
