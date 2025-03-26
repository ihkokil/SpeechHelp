
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { questionnaires } from '@/components/speech/questionnaires';
import { useToast } from '@/components/ui/use-toast';

const ResourcesTab = () => {
  const { toast } = useToast();

  const handleTemplateDownload = (speechType: string) => {
    // Create a JSON representation of the questionnaire
    const questionnaire = questionnaires[speechType as keyof typeof questionnaires];
    if (!questionnaire) return;
    
    // Convert to JSON string
    const jsonData = JSON.stringify(questionnaire, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${speechType}-questionnaire.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Template Downloaded",
      description: `The ${speechType} template has been downloaded.`,
    });
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
