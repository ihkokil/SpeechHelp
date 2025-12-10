import React from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface SimpleSaveProgressProps {
	isVisible: boolean;
}

const SimpleSaveProgress: React.FC<SimpleSaveProgressProps> = ({ isVisible }) => {
	if (!isVisible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<motion.div 
				initial={{ y: 20 }}
				animate={{ y: 0 }}
				className="bg-background border shadow-lg rounded-lg p-6 max-w-sm mx-4"
			>
				<div className="flex items-center justify-center mb-4">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
					>
						<CheckCircle className="w-8 h-8 text-green-600" />
					</motion.div>
				</div>
				
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="text-center"
				>
					<h3 className="font-semibold text-lg mb-2">Speech Saved!</h3>
					<p className="text-muted-foreground text-sm">
						Your speech has been successfully saved to your account.
					</p>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default SimpleSaveProgress;