
import React from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { FeatureAccess } from '@/components/plan/FeatureAccess';
import { SubscriptionPlan } from '@/lib/plan_rules';
import {
	FileText,
	FileCode,
	Presentation,
	Download,
	Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Example component showing how to use the plan-based access system
 * for export options that vary by subscription tier
 */
export function ExportOptionsExample() {
	const planLimits = usePlanLimits();

	return (
		<div className="space-y-6 p-4">
			<h2 className="text-2xl font-bold">Export Your Speech</h2>
			<p className="text-gray-600">
				Choose a format to export your speech content.
				Different formats are available depending on your subscription plan.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				{/* PDF Export - Available to All Plans */}
				<ExportCard
					title="PDF Document"
					icon={<FileText className="h-6 w-6" />}
					description="Export your speech as a well-formatted PDF document."
					buttonText="Export PDF"
					onClick={() => handleExport('pdf')}
				/>

				{/* DOCX Export - Available to Premium and Above */}
				<FeatureAccess
					minimumPlan={SubscriptionPlan.PREMIUM}
					featureName="Word export"
				>
					<ExportCard
						title="Word Document"
						icon={<FileText className="h-6 w-6" />}
						description="Export your speech as a Word document for easy editing."
						buttonText="Export DOCX"
						onClick={() => handleExport('docx')}
					/>
				</FeatureAccess>

				{/* PowerPoint Export - Available to Premium and Above */}
				<FeatureAccess
					minimumPlan={SubscriptionPlan.PREMIUM}
					featureName="PowerPoint export"
				>
					<ExportCard
						title="PowerPoint"
						icon={<Presentation className="h-6 w-6" />}
						description="Export your speech as a PowerPoint presentation."
						buttonText="Export PPTX"
						onClick={() => handleExport('pptx')}
					/>
				</FeatureAccess>

				{/* HTML Export - Available only to Pro Plan */}
				<FeatureAccess
					minimumPlan={SubscriptionPlan.PRO}
					featureName="HTML export"
					limitDescription="Upgrade to our Pro plan to export your speech as HTML for web publishing."
				>
					<ExportCard
						title="HTML"
						icon={<FileCode className="h-6 w-6" />}
						description="Export your speech as HTML for web publishing."
						buttonText="Export HTML"
						onClick={() => handleExport('html')}
						isPremium
					/>
				</FeatureAccess>
			</div>

			{/* Plan information and upgrade prompt */}
			<div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
				<div className="flex items-center gap-2 mb-2">
					<Crown className="h-4 w-4 text-amber-500" />
					<p className="font-medium">Your current plan: {planLimits.planDisplayName}</p>
				</div>
				<p>
					Available export formats: {planLimits.availableExportFormats.join(', ')}
				</p>
				{planLimits.currentPlan !== SubscriptionPlan.PRO && (
					<div className="mt-2">
						<Button
							variant="outline"
							size="sm"
							className="mt-2 text-xs"
							onClick={() => window.location.href = '/settings/billing'}
						>
							Upgrade for more export options
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Helper function to handle export (this would connect to your actual export logic)
 */
function handleExport(format: string) {
	console.log(`Exporting in ${format} format`);
	// Your actual export logic would go here
}

/**
 * Card component for an export option
 */
function ExportCard({
	title,
	icon,
	description,
	buttonText,
	onClick,
	isPremium = false,
}: {
	title: string;
	icon: React.ReactNode;
	description: string;
	buttonText: string;
	onClick: () => void;
	isPremium?: boolean;
}) {
	return (
		<Card className={isPremium ? "border-purple-200" : ""}>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg">{title}</CardTitle>
					<div className={`p-2 rounded-full ${isPremium ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-100'}`}>
						{React.cloneElement(icon as React.ReactElement, {
							className: `h-5 w-5 ${isPremium ? 'text-white' : 'text-gray-600'}`
						})}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-500 mb-4">{description}</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="w-full"
								variant={isPremium ? "default" : "outline"}
								onClick={onClick}
							>
								<Download className="h-4 w-4 mr-2" /> {buttonText}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Export your speech as {title}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</CardContent>
		</Card>
	);
} 
