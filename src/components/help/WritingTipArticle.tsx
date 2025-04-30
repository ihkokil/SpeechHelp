
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WritingTipArticleProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    description: string;
    content: React.ReactNode;
  } | null;
}

const WritingTipArticle: React.FC<WritingTipArticleProps> = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-pink-600">{article.title}</DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">{article.description}</DialogDescription>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <ScrollArea className="mt-4 flex-grow pr-4">
          <div className="prose prose-pink max-w-none">
            {article.content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WritingTipArticle;
