
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Speech } from '@/types/auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditSpeechFormProps {
  speech: Speech;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
}

const EditSpeechForm = ({
  speech,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
}: EditSpeechFormProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="speech-title" 
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <Input
          id="speech-title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Speech Title"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="speech-content" 
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <Textarea
          id="speech-content"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Speech Content"
          className={`w-full text-sm md:text-base ${isMobile ? 'min-h-[200px]' : 'min-h-[300px]'}`}
        />
      </div>
    </div>
  );
};

export default EditSpeechForm;
