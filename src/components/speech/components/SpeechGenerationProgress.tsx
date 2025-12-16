import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Loader2 } from 'lucide-react';

interface SpeechGenerationProgressProps {
	showConfetti: boolean;
}

const SpeechGenerationProgress: React.FC<SpeechGenerationProgressProps> = ({ showConfetti }) => {
	const [progress, setProgress] = useState(0);
	const [showDeliveryMessage, setShowDeliveryMessage] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(prevProgress => {
				// Show delivery message at around 80% (approximately 10 seconds)
				if (prevProgress >= 80 && !showDeliveryMessage) {
					setShowDeliveryMessage(true);
				}
				
				if (prevProgress >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prevProgress + 1;
			});
		}, 125); // Slower progression: 125ms per 1% = ~12.5 seconds total

		return () => clearInterval(interval);
	}, [showDeliveryMessage]);

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
			{/* Loading Indicator */}
			<div className="flex justify-center">
				<div className="flex flex-col items-center space-y-4">
					<Loader2 className="h-12 w-12 animate-spin text-primary" />
				</div>
			</div>

			<div className="text-center font-medium">
				<p className="mb-2 text-lg">Generating your speech...</p>
				<p className="text-sm text-muted-foreground min-h-[1.25rem]">
					{getProgressMessage()}
				</p>
			</div>

			<Progress value={progress} className="h-3" />

			{/* Delivery Message - Shows at ~10 seconds */}
			{showDeliveryMessage && (
				<div className="text-center animate-scale-in">
					<div className="text-2xl font-bold text-primary mb-2 animate-pulse">
						🎁 DELIVERY! 🎁
					</div>
					<p className="text-lg text-muted-foreground">
						Your personalized speech is ready for review!
					</p>
				</div>
			)}

			{/* Spectacular Fireworks and Confetti */}
			{showConfetti && progress >= 100 && (
				<>
					{/* Main Confetti Burst */}
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						recycle={false}
						numberOfPieces={500}
						gravity={0.1}
						initialVelocityX={{ min: -15, max: 15 }}
						initialVelocityY={{ min: -20, max: -5 }}
						colors={['#ec4899', '#8b5cf6', '#f97316', '#3b82f6', '#10b981', '#fbbf24', '#f472b6']}
						confettiSource={{
							x: window.innerWidth / 2,
							y: window.innerHeight / 4,
							w: 200,
							h: 50
						}}
					/>
					
					{/* Left Side Firework */}
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						recycle={false}
						numberOfPieces={150}
						gravity={0.05}
						initialVelocityX={{ min: -10, max: 5 }}
						initialVelocityY={{ min: -15, max: -8 }}
						colors={['#ec4899', '#f472b6', '#fbbf24']}
						confettiSource={{
							x: window.innerWidth * 0.25,
							y: window.innerHeight * 0.4,
							w: 50,
							h: 50
						}}
					/>
					
					{/* Right Side Firework */}
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						recycle={false}
						numberOfPieces={150}
						gravity={0.05}
						initialVelocityX={{ min: -5, max: 10 }}
						initialVelocityY={{ min: -15, max: -8 }}
						colors={['#8b5cf6', '#3b82f6', '#10b981']}
						confettiSource={{
							x: window.innerWidth * 0.75,
							y: window.innerHeight * 0.4,
							w: 50,
							h: 50
						}}
					/>
					
					{/* Bottom Sparkle Burst */}
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						recycle={false}
						numberOfPieces={100}
						gravity={0.02}
						initialVelocityX={{ min: -8, max: 8 }}
						initialVelocityY={{ min: -12, max: -3 }}
						colors={['#fbbf24', '#f472b6', '#a855f7']}
						confettiSource={{
							x: window.innerWidth / 2,
							y: window.innerHeight * 0.7,
							w: 150,
							h: 30
						}}
					/>
					
					{/* Background Animation */}
					<div className="fixed inset-0 pointer-events-none z-0">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 animate-pulse"></div>
						{/* Floating sparkles across the screen */}
						{Array.from({ length: 20 }).map((_, i) => (
							<div
								key={i}
								className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 2}s`,
									animationDuration: `${1 + Math.random() * 2}s`
								}}
							/>
						))}
						{Array.from({ length: 15 }).map((_, i) => (
							<div
								key={`star-${i}`}
								className="absolute w-1 h-1 bg-pink-300 rounded-full animate-bounce"
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 3}s`,
									animationDuration: `${0.5 + Math.random() * 1.5}s`
								}}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default SpeechGenerationProgress;
