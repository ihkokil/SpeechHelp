import React from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { AlertCircle, Check, X, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Component displaying user's plan limits and subscription status
 */
export function PlanLimitsIndicator() {
	const planLimits = usePlanLimits();

	// Show loading state if we don't have plan info yet
	if (!planLimits.planDisplayName) {
		return (
			<Card className="w-full animate-pulse">
				<CardHeader className="pb-2">
					<div className="h-5 w-24 bg-slate-200 rounded"></div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="h-4 w-full bg-slate-200 rounded"></div>
						<div className="h-4 w-2/3 bg-slate-200 rounded"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Render upgrade prompt if needed
	if (planLimits.shouldShowUpgradePrompt) {
		return (
			<Alert className="mb-4 border-amber-500">
				<AlertCircle className="h-4 w-4 text-amber-500" />
				<AlertTitle>Time to Upgrade</AlertTitle>
				<AlertDescription>
					{planLimits.speechesRemaining <= 1 && (
						<p>You're running low on speeches. Only {planLimits.speechesRemaining} remaining.</p>
					)}
					{planLimits.daysRemaining !== null && planLimits.daysRemaining <= 2 && (
						<p>Your {planLimits.planDisplayName} expires in {planLimits.daysRemaining} days.</p>
					)}
					{typeof planLimits.storageRemaining === 'number' && planLimits.storageRemaining <= 50 && (
						<p>You're running low on storage space.</p>
					)}
					<Button className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">
						Upgrade Now
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg">{planLimits.planDisplayName}</CardTitle>
					<Badge
						variant={planLimits.isActive ? "default" : "destructive"}
						className={planLimits.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
					>
						{planLimits.isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
				{planLimits.daysRemaining !== null && (
					<p className="text-sm text-muted-foreground">
						{planLimits.daysRemaining} days remaining
					</p>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Speeches Usage */}
				<div>
					<div className="flex justify-between mb-1">
						<span className="text-sm font-medium">Speeches</span>
						<span className="text-sm text-muted-foreground">
							{planLimits.speechesUsed} / {planLimits.speechesLimit === Infinity ? '∞' : planLimits.speechesLimit}
						</span>
					</div>
					{planLimits.speechesLimit !== Infinity && (
						<Progress
							value={(planLimits.speechesUsed / planLimits.speechesLimit) * 100}
							className="h-2"
						/>
					)}
				</div>

				{/* Features List */}
				<div className="mt-4">
					<h4 className="text-sm font-medium mb-2">Features</h4>
					<ul className="space-y-1">
						<li className="flex items-center text-sm">
							{planLimits.canUseAiAnalysis ?
								<Check className="h-4 w-4 text-green-500 mr-2" /> :
								<X className="h-4 w-4 text-red-500 mr-2" />}
							AI Speech Analysis
						</li>
						<li className="flex items-center text-sm">
							{planLimits.canUseTeamCollaboration ?
								<Check className="h-4 w-4 text-green-500 mr-2" /> :
								<X className="h-4 w-4 text-red-500 mr-2" />}
							Team Collaboration
						</li>
						<li className="flex items-center text-sm">
							{planLimits.canUseCustomBranding ?
								<Check className="h-4 w-4 text-green-500 mr-2" /> :
								<X className="h-4 w-4 text-red-500 mr-2" />}
							Custom Branding
						</li>
						<li className="flex items-start text-sm">
							<Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
							<div>
								<span>Export Formats: </span>
								<span className="text-muted-foreground">
									{planLimits.availableExportFormats.join(', ')}
								</span>
							</div>
						</li>
					</ul>
				</div>
			</CardContent>

			<CardFooter>
				<Button
					variant="outline"
					className="w-full"
					onClick={() => {/* Handle upgrade click */ }}
				>
					Upgrade Plan
				</Button>
			</CardFooter>
		</Card>
	);
} 