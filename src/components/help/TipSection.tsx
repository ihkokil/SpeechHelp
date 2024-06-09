
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface TipSectionProps {
  section: {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
  };
  openArticle: (id: string) => void;
}

const TipSection: React.FC<TipSectionProps> = ({ section, openArticle }) => {
  return (
    <AccordionItem key={section.id} value={section.id} className="border-b border-gray-200">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="text-left">
          <h3 className="text-xl font-bold text-pink-600">{section.title}</h3>
          <p className="text-gray-600 mt-1">{section.description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-gray-50">
        <div className="prose max-w-none">
          {section.content}
        </div>
        <Button 
          className="mt-4"
          variant="magenta"
          onClick={() => openArticle(section.id)}
        >
          Read Article
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TipSection;
