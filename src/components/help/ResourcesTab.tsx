
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Lock } from 'lucide-react';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { questionnaires } from '@/components/speech/questionnaires';
import { useToast } from '@/hooks/use-toast';
import { createPdfFromContent } from '@/components/speech/utils/pdfGenerator';
import { createFormattedSpeech } from '@/components/speech/utils/speechContentCreator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
    
    // Create a formatted content with the latest questionnaire structure
    const formattedContent = `# ${templateTitle}\n\n` +
      `## About This Template\n\n` +
      `This is a template for creating a ${speechTypeLabel.toLowerCase()} speech. Use our Speech Lab tool to fill in the questionnaire and generate a complete speech tailored to your needs.\n\n` +
      `## Questionnaire Structure\n\n` +
      `${questionnaire.map(q => {
        // Format each question based on its type
        let questionText = `### ${q.question}\n`;
        if (q.type === 'radio' && q.options) {
          questionText += `Options: ${q.options.join(', ')}\n\n`;
        } else if (q.type === 'textarea' || q.type === 'text') {
          questionText += `Type: ${q.type}\n`;
          if (q.placeholder) {
            questionText += `Placeholder: ${q.placeholder}\n`;
          }
          questionText += '\n';
        }
        
        // Add condition information if present
        if (q.condition) {
          questionText += `Displays when: "${q.condition.question}" is "${q.condition.value}"\n\n`;
        }
        
        return questionText;
      }).join('')}` +
      `## Sample Speech Structure\n\n` +
      `### Introduction\n` +
      `• Opening hook\n` +
      `• Greeting and introduction\n` +
      `• Purpose statement\n\n` +
      `### Body\n` +
      `• Main point 1 (with supporting details)\n` +
      `• Main point 2 (with supporting details)\n` +
      `• Main point 3 (with supporting details)\n\n` +
      `### Conclusion\n` +
      `• Summary of key points\n` +
      `• Final message or call to action\n` +
      `• Closing statement`;
    
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
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-lg text-gray-800">Speech Writing Templates</CardTitle>
              <CardDescription>Download templates with the latest questionnaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="grid grid-cols-1 gap-3">
                {speechTypesData.map((speechType) => (
                  <div key={speechType.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <span className="text-sm font-medium text-gray-700">{speechType.label}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex gap-1 items-center border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                      onClick={() => handleTemplateClick(speechType.id)}
                    >
                      <Lock className="h-3.5 w-3.5 mr-1 text-pink-500" />
                      <Download className="h-3.5 w-3.5 mr-1 text-pink-500" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-lg text-gray-800">External Resources</CardTitle>
              <CardDescription>Valuable resources from around the web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="text-sm font-medium text-gray-700">Public Speaking Tips</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span className="text-xs">Visit</span>
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="text-sm font-medium text-gray-700">Voice Training Exercises</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span className="text-xs">Visit</span>
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <span className="text-sm font-medium text-gray-700">Body Language Guide</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span className="text-xs">Visit</span>
                  </Button>
                </div>
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
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-pink-500 via-pink-500 to-purple-600 text-white"
                  >
                    Download
                  </Button>
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
