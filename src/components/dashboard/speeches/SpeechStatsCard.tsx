
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Speech } from '@/types/speech';
import { Badge } from '@/components/ui/badge';

interface SpeechStatsCardProps {
  speeches: Speech[];
}

const SpeechStatsCard: React.FC<SpeechStatsCardProps> = ({ speeches }) => {
  const totalSpeeches = speeches.length;
  const upcomingSpeeches = speeches.filter(s => s.isUpcoming).length;
  const completedSpeeches = speeches.filter(s => !s.isUpcoming).length;
  
  const speechTypes = speeches.reduce((acc, speech) => {
    const type = speech.isUpcoming ? 'upcoming' : speech.speech_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Speech Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalSpeeches}</div>
            <div className="text-sm text-gray-600">Total Speeches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{upcomingSpeeches}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedSpeeches}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
        
        {Object.keys(speechTypes).length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Speech Types</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(speechTypes).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechStatsCard;
