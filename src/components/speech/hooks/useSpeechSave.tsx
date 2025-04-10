
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechService } from '@/services/speechService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface UseSpeechSaveProps {
	title: string;
	content: string;
	speechType: string;
	speechDetails?: Record<string, string>;
}

export const useSpeechSave = ({
	title,
	content,
	speechType,
	speechDetails = {}
}: UseSpeechSaveProps) => {
	const [isSaving, setIsSaving] = useState(false);
	const [speechId, setSpeechId] = useState<string | null>(null);
	const { toast } = useToast();
	const { user } = useAuth();
	const speechService = useSpeechService();
	const { currentLanguage } = useLanguage();
	const { t } = useTranslation();

	const validateInputs = () => {
		if (!title.trim()) {
			toast({
				title: t("speechLab.titleRequired", currentLanguage.code),
				description: t("speechLab.enterTitlePrompt", currentLanguage.code),
				variant: "destructive",
			});
			return false;
		}

		if (!content.trim()) {
			toast({
				title: t("speechLab.contentRequired", currentLanguage.code),
				description: t("speechLab.enterContentPrompt", currentLanguage.code),
				variant: "destructive",
			});
			return false;
		}

		return true;
	};

	const handleSave = async () => {
		if (!validateInputs()) {
			return;
		}

		setIsSaving(true);

		try {
			const speechWithMetadata = {
				content: content,
				details: speechDetails || {},
				metadata: {
					language: currentLanguage.code,
					createdAt: new Date().toISOString()
				}
			};

			const contentToSave = JSON.stringify(speechWithMetadata);

			if (speechId) {
				await speechService.updateSpeech(user.id, speechId, title, contentToSave);
				toast({
					title: t("speechLab.speechUpdated", currentLanguage.code),
					description: t("speechLab.speechUpdatedDesc", currentLanguage.code),
				});
			} else {
				if (user) {
					let speech = await speechService.saveSpeech(user.id, title, contentToSave, speechType);
					setSpeechId(speech);
					toast({
						title: t("speechLab.speechSaved", currentLanguage.code),
						description: t("speechLab.speechSavedDesc", currentLanguage.code),
					});
				} else {
					toast({
						title: t("common.authRequired", currentLanguage.code),
						description: t("common.signInToSave", currentLanguage.code),
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			toast({
				title: t("common.error", currentLanguage.code),
				description: t("speechLab.saveError", currentLanguage.code),
				variant: "destructive",
			});
			console.error("Error saving speech:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return {
		isSaving,
		handleSave,
		speechId
	};
};
