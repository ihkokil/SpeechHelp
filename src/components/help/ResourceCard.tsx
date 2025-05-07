
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';

interface ResourceCardProps {
  title: string;
  description: string;
  items: {
    id: string;
    label: string;
    action: () => void;
    buttonLabel: string;
    buttonIcon: React.ReactNode;
  }[];
  gradientClasses?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  title, 
  description, 
  items, 
  gradientClasses = "bg-gradient-to-r from-pink-50 to-purple-50" 
}) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className={`${gradientClasses} rounded-t-lg`}>
        <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <ButtonCustom 
                variant="premium" 
                size="sm" 
                className="flex gap-1 items-center hover:opacity-90"
                onClick={item.action}
              >
                {item.buttonIcon}
                <span className="text-xs">{item.buttonLabel}</span>
              </ButtonCustom>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
