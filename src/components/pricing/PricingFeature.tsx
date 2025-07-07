
import React from 'react';

interface PricingFeatureProps {
	text: string;
	description?: string;
	icon?: React.ReactNode;
	disabled?: boolean;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({
	text,
	description,
	icon,
	disabled = false,
}) => {
	return (
		<li className="flex space-x-3">
			{icon ? (
				<div className={`flex-shrink-0 ${disabled ? 'opacity-50' : ''}`}>
					{icon}
				</div>
			) : (
				<svg
					className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
						disabled ? 'text-gray-400' : 'text-green-500'
					}`}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
			)}
			<div className="flex-1">
				<span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
					{text}
				</span>
				{description && (
					<p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
						{description}
					</p>
				)}
			</div>
		</li>
	);
};

export default PricingFeature;
