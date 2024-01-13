
import React, { useEffect } from 'react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import SpeechLabContent from '@/components/speech/SpeechLabContent';
import { LimitType } from '@/lib/plan_rules';
import { FeatureAccess } from '@/components/plan/FeatureAccess';
import { useLanguage } from '@/contexts/LanguageContext';

const SpeechLab = () => {
	const { currentLanguage } = useLanguage();

	// Effect to update document title when language changes
	useEffect(() => {
		document.title = currentLanguage.code === 'en-US' ? 
			'Speech Lab - Create Your Perfect Speech' : 
			(currentLanguage.code === 'es' ? 
				'Laboratorio de Discursos - Crea tu Discurso Perfecto' : 
				(currentLanguage.code === 'fr' ? 
					'Laboratoire de Discours - Créez Votre Discours Parfait' : 
					'Speech Lab - Create Your Perfect Speech'));
	}, [currentLanguage]);

	return (
		<SpeechLabLayout>
			<FeatureAccess
				limitType={LimitType.SPEECHES_COUNT}
				featureName="Speech Lab"
				limitDescription="Our Premium plan gives you access to 3 speeches per month, along with additional features like team collaboration and expanded export options."
				blockClassName="max-w-xl mx-auto my-8"
			>
				<SpeechLabContent />
			</FeatureAccess>
		</SpeechLabLayout>
	);
};

export default SpeechLab;
