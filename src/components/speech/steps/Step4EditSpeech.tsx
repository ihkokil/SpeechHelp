
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
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
	const [wasAutoSaved, setWasAutoSaved] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
			setWasAutoSaved(true);
			setHasUnsavedChanges(false);
			
			toast({
				title: "Speech Ready!",
				description: `Your generated speech is ready for editing. It has been automatically saved to your account.`,
			});
		} else {
			// Fallback to placeholder if no recovery possible
			const placeholderSpeech = createPlaceholderSpeech(title, speechDetails);
			setContent(placeholderSpeech);
			setWasAutoSaved(false);
			
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
		if (wasAutoSaved) {
			setHasUnsavedChanges(true);
		}
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setContent(newContent);
		
		// Auto-backup content as user edits
		localStorage.setItem('speechBackup', newContent);
		
		// Mark as having unsaved changes if this was auto-saved
		if (wasAutoSaved) {
			setHasUnsavedChanges(true);
		}
	};

	const handleSaveWithStatus = async () => {
		await handleSave();
		if (!isSaving) {
			setHasUnsavedChanges(false);
			setWasAutoSaved(false); // Now it's manually saved
		}
	};

	const getStatusMessage = () => {
		if (hasRecoveredSpeech && wasAutoSaved && !hasUnsavedChanges) {
			return {
				type: 'success',
				message: 'Speech automatically saved! You can edit and save again if needed.'
			};
		}
		if (hasUnsavedChanges) {
			return {
				type: 'warning',
				message: 'You have unsaved changes. Click Save to update your speech.'
			};
		}
		return null;
	};

	const statusMessage = getStatusMessage();

	return (
		<Card>
			<CardHeader>
				<CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
				<CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
				{statusMessage && (
					<div className={`flex items-center gap-2 p-3 rounded-md ${
						statusMessage.type === 'success' 
							? 'bg-green-50 border border-green-200' 
							: 'bg-yellow-50 border border-yellow-200'
					}`}>
						{statusMessage.type === 'success' ? (
							<CheckCircle className="h-4 w-4 text-green-600" />
						) : (
							<AlertCircle className="h-4 w-4 text-yellow-600" />
						)}
						<span className={`text-sm ${
							statusMessage.type === 'success' ? 'text-green-700' : 'text-yellow-700'
						}`}>
							{statusMessage.message}
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
					onClick={handleSaveWithStatus}
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
					) : hasUnsavedChanges ? (
						<>
							<Save className="mr-2 h-4 w-4" />
							<Translate text="speechLab.saveChanges" fallback="Save Changes" />
						</>
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
