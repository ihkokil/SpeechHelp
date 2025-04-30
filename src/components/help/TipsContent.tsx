
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import TipSection from '@/components/help/TipSection';

interface TipsContentProps {
  tipsSections: Array<{
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
  }>;
  openArticle: (id: string) => void;
}

const TipsContent: React.FC<TipsContentProps> = ({ tipsSections, openArticle }) => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Resources</h2>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {tipsSections.map((section) => (
            <TipSection 
              key={section.id} 
              section={section} 
              openArticle={openArticle} 
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default TipsContent;
