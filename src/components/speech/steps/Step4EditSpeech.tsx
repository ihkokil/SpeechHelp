
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Copy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechService } from '@/services/speechService';

// Create schema for form validation
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Speech content must be at least 10 characters.",
  }),
});

interface Step4Props {
  prevStep: () => void;
  speechTitle: string;
  speechType: string;
  onTitleChange: (title: string) => void;
}

const Step4EditSpeech: React.FC<Step4Props> = ({
  prevStep,
  speechTitle,
  speechType,
  onTitleChange,
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveSpeech } = useSpeechService();
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Generate placeholder content if no real content is available
  const placeholderContent = `This is a sample ${speechType} speech. The real content will be provided by your make.com integration. You can edit this text to customize your speech.`;
  
  // Initialize form with the speech title and default content
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: speechTitle,
      content: placeholderContent,
    },
  });

  // Update the local form when speechTitle prop changes
  useEffect(() => {
    form.setValue('title', speechTitle);
  }, [speechTitle, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to save a speech",
          variant: "destructive",
        });
        return;
      }
      
      // Update the title in parent component
      onTitleChange(values.title);
      
      // Save the speech to the database
      await saveSpeech(user.id, values.title, values.content, speechType);
      
      toast({
        title: "Success!",
        description: "Your speech has been saved",
      });
    } catch (error) {
      console.error("Error saving speech:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your speech",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle copying to clipboard
  const handleCopyToClipboard = () => {
    const content = form.getValues('content');
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Speech copied to clipboard",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch((err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Error",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle><Translate text="speechLab.editTitle" fallback="Edit Your Speech" /></CardTitle>
            <CardDescription><Translate text="speechLab.editDesc" fallback="Review and edit your speech before saving" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><Translate text="speechLab.speechTitleLabel" fallback="Speech Title" /></FormLabel>
                  <FormControl>
                    <Input placeholder={t('speechLab.speechTitlePlaceholder', currentLanguage.code)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><Translate text="speechLab.speechContentLabel" fallback="Speech Content" /></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('speechLab.speechContentPlaceholder', currentLanguage.code)} 
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <ButtonCustom 
                type="button"
                onClick={prevStep} 
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <Translate text="speechLab.backButton" fallback="Back" />
              </ButtonCustom>
              
              <ButtonCustom
                type="button"
                onClick={handleCopyToClipboard}
                variant="outline"
              >
                <Copy className="mr-2 h-4 w-4" />
                {isCopied ? 
                  <Translate text="common.copied" fallback="Copied!" /> : 
                  <Translate text="common.copy" fallback="Copy" />
                }
              </ButtonCustom>
            </div>
            
            <ButtonCustom 
              type="submit"
              variant="magenta" 
              disabled={isSaving}
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
                  <Translate text="speechLab.saveButton" fallback="Save Speech" />
                </>
              )}
            </ButtonCustom>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Step4EditSpeech;
