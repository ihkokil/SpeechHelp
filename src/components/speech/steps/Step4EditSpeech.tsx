
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Translate from '@/components/Translate';
import SpeechEditor from '../components/SpeechEditor';
import { useSpeechSave } from '../hooks/useSpeechSave';
import { useSpeechReset } from '../hooks/useSpeechReset';
import { useSpeechDownload } from '../hooks/useSpeechDownload';
import { createPlaceholderSpeech } from '../utils/speechContentUtils';
import { useToast } from "@/hooks/use-toast";

interface Step4Props {
	prevStep: () => void;
	speechTitle: string;
	speechType: string;
	onTitleChange: (title: string) => void;
	speechDetails?: Record<string, string>;
}

const Step4EditSpeech: React.FC<Step4Props> = ({
	prevStep,
	speechTitle,
	speechType,
	onTitleChange,
	speechDetails = {}
}) => {
	const { toast } = useToast();
	const [title, setTitle] = useState(speechTitle);
	const [content, setContent] = useState('');
	const [hasRecoveredSpeech, setHasRecoveredSpeech] = useState(false);

	const { isSaving, handleSave, speechId } = useSpeechSave({
		title,
		content,
		speechType,
		speechDetails
	});

	const { handleReset } = useSpeechReset({
		title,
		content,
		setContent,
		speechDetails
	});

	const { handleDownload } = useSpeechDownload({
		title,
		content,
		speechType
	});

	useEffect(() => {
		setTitle(speechTitle);
	}, [speechTitle]);

	useEffect(() => {
		// Try to recover the generated speech from multiple possible storage locations
		const savedSpeech = localStorage.getItem('generatedSpeech');
		const backupSpeech = localStorage.getItem('speechBackup');
		const tempSpeech = localStorage.getItem('tempGeneratedSpeech');
		
		let recoveredContent = '';
		let recoverySource = '';

		if (savedSpeech && savedSpeech.trim()) {
			recoveredContent = savedSpeech;
			recoverySource = 'main storage';
		} else if (backupSpeech && backupSpeech.trim()) {
			recoveredContent = backupSpeech;
			recoverySource = 'backup storage';
		} else if (tempSpeech && tempSpeech.trim()) {
			recoveredContent = tempSpeech;
			recoverySource = 'temporary storage';
		}

		if (recoveredContent) {
			setContent(recoveredContent);
			setHasRecoveredSpeech(true);
			
			toast({
				title: "Speech Recovered!",
				description: `Your generated speech was recovered from ${recoverySource}. Make sure to save it now!`,
			});
		} else {
			// Fallback to placeholder if no recovery possible
			const placeholderSpeech = createPlaceholderSpeech(title, speechDetails);
			setContent(placeholderSpeech);
			
			toast({
				title: "No Saved Speech Found",
				description: "We couldn't recover your previous speech. You can start fresh or go back to regenerate.",
				variant: "destructive"
			});
		}
	}, [title, speechDetails, toast]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		onTitleChange(e.target.value);
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setContent(newContent);
		
		// Auto-backup content as user edits
		localStorage.setItem('speechBackup', newContent);
	};

	const handleSaveWithBackup = async () => {
		// Clear recovery data after successful save
		await handleSave();
		if (!isSaving) {
			localStorage.removeItem('generatedSpeech');
			localStorage.removeItem('speechBackup');
			localStorage.removeItem('tempGeneratedSpeech');
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
				<CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
				{hasRecoveredSpeech && (
					<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
						<AlertCircle className="h-4 w-4 text-green-600" />
						<span className="text-sm text-green-700">
							Speech recovered! Remember to save your changes.
						</span>
					</div>
				)}
			</CardHeader>
			<CardContent>
				<SpeechEditor
					title={title}
					content={content}
					onTitleChange={handleTitleChange}
					onContentChange={handleContentChange}
					onDownload={handleDownload}
					onReset={handleReset}
				/>
			</CardContent>
			<CardFooter className="flex justify-between">
				<ButtonCustom onClick={prevStep} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					<Translate text="speechLab.backButton" />
				</ButtonCustom>
				<ButtonCustom
					variant="magenta"
					onClick={handleSaveWithBackup}
					disabled={isSaving || !title.trim() || !content.trim()}
				>
					{isSaving ? (
						<span className="inline-flex items-center">
							<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<Translate text="common.saving" fallback="Saving..." />
						</span>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							<Translate text="speechLab.saveButton" />
						</>
					)}
				</ButtonCustom>
			</CardFooter>
		</Card>
	);
};

export default Step4EditSpeech;
