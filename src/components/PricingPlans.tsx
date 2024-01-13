import { useState } from 'react';
import { products, prices } from '../lib/products';

interface PricingToggleProps {
	isYearly: boolean;
	onToggle: () => void;
}

const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
	return (
		<div className="flex items-center justify-center mt-8 mb-12">
			<span className={`text-sm font-medium ${!isYearly ? 'text-primary' : 'text-gray-500'}`}>
				Monthly
			</span>
			<button
				type="button"
				className="relative inline-flex h-6 w-12 mx-4 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
				role="switch"
				aria-checked={isYearly}
				onClick={onToggle}
			>
				<span
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-6' : 'translate-x-0'
						}`}
				/>
			</button>
			<span className={`text-sm font-medium ${isYearly ? 'text-primary' : 'text-gray-500'}`}>
				Yearly <span className="text-green-500 ml-1">(Save 17%)</span>
			</span>
		</div>
	);
};

export default function PricingPlans() {
	const [isYearly, setIsYearly] = useState(false);

	const toggleBilling = () => {
		setIsYearly(!isYearly);
	};

	const getPriceForProduct = (productId: string) => {
		const productPrices = prices.filter(price => price.productId === productId);

		if (productId === 'prod_basic') {
			return {
				amount: 0,
				formattedPrice: 'Free',
				period: ''
			};
		}

		const price = productPrices.find(p =>
			isYearly ? p.interval === 'year' : p.interval === 'month'
		);

		if (!price) return { amount: 0, formattedPrice: 'N/A', period: '' };

		const dollars = (price.amount / 100).toFixed(2);
		const period = isYearly ? '/year' : '/month';

		return {
			amount: price.amount,
			formattedPrice: `$${dollars}`,
			period
		};
	};

	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Pricing Plans
					</h2>
					<p className="mt-4 text-xl text-gray-600">
						Choose the perfect plan for your speaking needs
					</p>
				</div>

				<PricingToggle isYearly={isYearly} onToggle={toggleBilling} />

				<div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:gap-8">
					{products.map((product) => {
						const { formattedPrice, period } = getPriceForProduct(product.id);

						return (
							<div
								key={product.id}
								className={`bg-white rounded-lg shadow-lg divide-y divide-gray-200 ${product.id === 'prod_premium' ? 'ring-2 ring-primary' : ''
									}`}
							>
								<div className="p-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h3>
									<p className="mt-2 text-sm text-gray-500">{product.description}</p>
									<p className="mt-8">
										<span className="text-4xl font-extrabold text-gray-900">{formattedPrice}</span>
										<span className="text-base font-medium text-gray-500">{period}</span>
									</p>
									<button
										type="button"
										className={`mt-8 block w-full py-3 px-6 rounded-md text-center font-medium ${product.id === 'prod_basic'
											? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
											: 'bg-primary text-white hover:bg-primary-dark'
											}`}
									>
										{product.ctaText || 'Get Started'}
									</button>
								</div>
								<div className="pt-6 pb-8 px-6">
									<h4 className="text-sm font-medium text-gray-900 tracking-wide">
										What's included:
									</h4>
									<ul className="mt-6 space-y-4">
										{product.features.map((feature, index) => (
											<li key={index} className="flex space-x-3">
												<svg
													className="flex-shrink-0 h-5 w-5 text-green-500"
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
												<span className="text-sm text-gray-500">{feature}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
} 