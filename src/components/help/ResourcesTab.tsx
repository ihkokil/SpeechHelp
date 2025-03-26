
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock } from 'lucide-react';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { questionnaires } from '@/components/speech/questionnaires';
import { useToast } from '@/hooks/use-toast';
import { createPdfFromContent } from '@/components/speech/utils/pdfGenerator';
import { createFormattedSpeech } from '@/components/speech/utils/speechContentCreator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define form schema for password validation
const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ResourcesTab = () => {
  const { toast } = useToast();
  const [selectedSpeechType, setSelectedSpeechType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleTemplateClick = (speechType: string) => {
    setSelectedSpeechType(speechType);
    setIsDialogOpen(true);
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
    
    // Create a sample title for the template
    const templateTitle = `${speechTypeLabel} Speech Template`;
    
    // Get the questionnaire for this speech type
    const questionnaire = questionnaires[selectedSpeechType as keyof typeof questionnaires];
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
    
    // Close dialog and reset form
    setIsDialogOpen(false);
    form.reset();
  };
  
  const onDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
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
                    onClick={() => handleTemplateClick(speechType.id)}
                  >
                    <Lock className="h-4 w-4 mr-1" />
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
        
        {/* Password Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Password Required</DialogTitle>
              <DialogDescription>
                Please enter the password to download this template.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleTemplateDownload)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Download</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ResourcesTab;
