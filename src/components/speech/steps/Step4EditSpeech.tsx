
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface Step4EditSpeechProps {
  prevStep: () => void;
  generatedSpeech: string;
  speechTitle: string;
  selectedSpeechType: string;
}

const Step4EditSpeech: React.FC<Step4EditSpeechProps> = ({
  prevStep,
  generatedSpeech,
  speechTitle,
  selectedSpeechType
}) => {
  const [title, setTitle] = useState(speechTitle || 'My Speech');
  const [content, setContent] = useState(generatedSpeech || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { saveSpeech, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!content || !title) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your speech.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your speech.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsSaving(true);
    try {
      await saveSpeech(title, content, selectedSpeechType);
      setIsSaved(true);
      toast({
        title: "Speech saved",
        description: "Your speech has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error saving speech:", error);
      toast({
        title: "Error saving speech",
        description: error?.message || "There was an error saving your speech. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Card className="lg:max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="speechTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Speech Title
            </label>
            <Input
              id="speechTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              placeholder="Give your speech a title"
            />
          </div>
          
          <div>
            <label htmlFor="speechContent" className="block text-sm font-medium text-gray-700 mb-1">
              Speech Content
            </label>
            <Textarea
              id="speechContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] w-full"
              placeholder="Edit your speech content here..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="space-x-4">
              {isSaved ? (
                <Button
                  variant="outline"
                  onClick={handleViewDashboard}
                  className="flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  View in Dashboard
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="flex items-center bg-pink-600 hover:bg-pink-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Speech
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4EditSpeech;
