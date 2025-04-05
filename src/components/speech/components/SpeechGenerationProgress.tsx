import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface SpeechGenerationProgressProps {
	showConfetti: boolean;
}

const SpeechGenerationProgress: React.FC<SpeechGenerationProgressProps> = ({ showConfetti }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(prevProgress => {
				if (prevProgress >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prevProgress + 1;
			});
		}, 50);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="space-y-4">
			<div className="text-center font-medium">
				<p className="mb-2">Crafting your AI-powered speech...</p>
				<p className="text-sm text-muted-foreground">
					{progress < 20 && "Preparing your inputs for AI processing..."}
					{progress >= 20 && progress < 40 && "Connecting to OpenAI..."}
					{progress >= 40 && progress < 60 && "AI is analyzing your requirements..."}
					{progress >= 60 && progress < 75 && "Generating speech content..."}
					{progress >= 75 && progress < 90 && "Polishing language and structure..."}
					{progress >= 90 && progress < 100 && "Finalizing your personalized speech..."}
					{progress >= 100 && "Your AI-generated speech is ready!"}
				</p>
			</div>

			<Progress value={progress} className="h-2" />

			{showConfetti && progress >= 100 && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					recycle={false}
					numberOfPieces={200}
				/>
			)}
		</div>
	);
};

export default SpeechGenerationProgress;
