
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import Translate from '@/components/Translate';

interface Step4Props {
  prevStep: () => void;
}

const Step4EditSpeech: React.FC<Step4Props> = ({ prevStep }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.editTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.editDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea 
          className="min-h-[300px]" 
          defaultValue="[Generated speech content will appear here]" 
        />
        
        <div className="flex flex-wrap gap-2">
          <ButtonCustom variant="outline" size="sm">
            <Translate text="speechLab.downloadButton" />
            <Download className="ml-2 h-4 w-4" />
          </ButtonCustom>
          <ButtonCustom variant="outline" size="sm">
            <Translate text="speechLab.resetButton" />
            <RefreshCw className="ml-2 h-4 w-4" />
          </ButtonCustom>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom variant="magenta">
          <Translate text="speechLab.saveButton" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step4EditSpeech;
