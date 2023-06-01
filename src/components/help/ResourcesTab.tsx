
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { questionnaires } from '@/components/speech/questionnaires';
import { useToast } from '@/hooks/use-toast';
import { createPdfFromContent } from '@/components/speech/utils/pdfGenerator';
import { createFormattedSpeech } from '@/components/speech/utils/speechContentCreator';

const ResourcesTab = () => {
  const { toast } = useToast();

  const handleTemplateDownload = (speechType: string) => {
    // Get the speech type label
    const speechTypeLabel = speechTypesData.find(type => type.id === speechType)?.label || speechType;
    
    // Create a sample title for the template
    const templateTitle = `${speechTypeLabel} Speech Template`;
    
    // Get the questionnaire for this speech type
    const questionnaire = questionnaires[speechType as keyof typeof questionnaires];
    if (!questionnaire) return;
    
    // Create a formatted speech template
    const emptyDetails = {};
    
    // Create a formatted speech content with placeholder text
    const formattedContent = `# ${templateTitle}\n\n` +
      `## About This Template\n\n` +
      `This is a template for creating a ${speechTypeLabel.toLowerCase()} speech. Use our Speech Lab tool to fill in the questionnaire and generate a complete speech tailored to your needs.\n\n` +
      `## Questionnaire Structure\n\n` +
      `${questionnaire.map(q => `### ${q.question}\n${q.type === 'radio' ? `Options: ${q.options?.join(', ')}` : 'Enter your response here...'}\n\n`).join('')}` +
      `## Sample Speech Structure\n\n` +
      `${createFormattedSpeech(templateTitle, emptyDetails)}`;
    
    // Generate and download the PDF
    createPdfFromContent(
      templateTitle,
      formattedContent,
      `${speechTypeLabel} Template`,
      toast
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Resources</CardTitle>
        <CardDescription>Helpful resources to improve your speech writing and delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Speech Writing Templates</CardTitle>
              <CardDescription>Download templates for different types of speeches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {speechTypesData.map((speechType) => (
                <div key={speechType.id} className="flex justify-between items-center">
                  <span className="text-sm">{speechType.label}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex gap-1 items-center"
                    onClick={() => handleTemplateDownload(speechType.id)}
                  >
                    <FileText className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">External Resources</CardTitle>
              <CardDescription>Valuable resources from around the web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Public Speaking Tips</span>
                <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Voice Training Exercises</span>
                <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Body Language Guide</span>
                <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesTab;
