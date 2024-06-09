
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Lock } from 'lucide-react';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { questionnaires } from '@/components/speech/questionnaires';
import { useToast } from '@/components/ui/use-toast';
import { createPdfFromContent } from '@/components/speech/utils/pdfGenerator';
import ResourceCard from './ResourceCard';
import PasswordDialog from './PasswordDialog';
import { createTemplateContent } from './utils/templateFormatter';
import { Button } from '@/components/ui/button';

// Type for password form values from PasswordDialog
type PasswordFormValues = {
  password: string;
};

const ResourcesTab = () => {
  const { toast } = useToast();
  const [selectedSpeechType, setSelectedSpeechType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleTemplateClick = (speechType: string) => {
    setSelectedSpeechType(speechType);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleTemplateDownload = (values: PasswordFormValues) => {
    // Check if password is correct
    if (values.password !== '2215') {
      toast({
        title: "Incorrect password",
        description: "The password you entered is incorrect.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedSpeechType) return;
    
    // Get the speech type label
    const speechTypeLabel = speechTypesData.find(type => type.id === selectedSpeechType)?.label || selectedSpeechType;
    
    // Get the questionnaire for this speech type
    const questionnaire = questionnaires[selectedSpeechType as keyof typeof questionnaires];
    if (!questionnaire) return;
    
    // Create the formatted content for the template
    const formattedContent = createTemplateContent(speechTypeLabel, questionnaire);
    
    // Generate and download the PDF with fillable fields
    createPdfFromContent(
      `${speechTypeLabel} Speech Template`,
      formattedContent,
      `${speechTypeLabel} Template`,
      toast
    );
    
    // Close dialog
    setIsDialogOpen(false);
  };

  // Create speech template items
  const speechTemplateItems = speechTypesData.map((speechType) => ({
    id: speechType.id,
    label: speechType.label,
    action: () => handleTemplateClick(speechType.id),
    buttonLabel: "Download",
    buttonIcon: (
      <>
        <Lock className="h-3.5 w-3.5 mr-1" />
        <Download className="h-3.5 w-3.5 mr-1" />
      </>
    )
  }));

  // Create external resource items
  const externalResourceItems = [
    {
      id: "public-speaking",
      label: "Public Speaking Tips",
      action: () => {},
      buttonLabel: "Visit",
      buttonIcon: <></>
    },
    {
      id: "voice-training",
      label: "Voice Training Exercises",
      action: () => {},
      buttonLabel: "Visit",
      buttonIcon: <></>
    },
    {
      id: "body-language",
      label: "Body Language Guide",
      action: () => {},
      buttonLabel: "Visit",
      buttonIcon: <></>
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Resources</CardTitle>
        <CardDescription>Helpful resources to improve your speech writing and delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard
            title="Speech Writing Templates"
            description="Download templates with the latest questionnaires"
            items={speechTemplateItems}
            gradientClasses="bg-gradient-to-r from-pink-50 to-purple-50"
          />

          <ResourceCard
            title="External Resources"
            description="Valuable resources from around the web"
            items={externalResourceItems}
            gradientClasses="bg-gradient-to-r from-pink-50 to-purple-50"
          />
        </div>
        
        {/* Password Dialog */}
        <PasswordDialog 
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleTemplateDownload}
        />
      </CardContent>
    </Card>
  );
};

export default ResourcesTab;
