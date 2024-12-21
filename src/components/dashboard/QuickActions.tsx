
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create New Speech',
      description: 'Start crafting your next speech',
      icon: Plus,
      onClick: () => navigate('/speech-lab'),
      color: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
    },
    {
      title: 'View All Speeches',
      description: 'Manage your speech library',
      icon: FileText,
      onClick: () => navigate('/my-speeches'),
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
    },
    {
      title: 'Upcoming Events',
      description: 'View scheduled speeches',
      icon: Calendar,
      onClick: () => navigate('/my-speeches?filter=upcoming'),
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Settings',
      description: 'Customize your preferences',
      icon: Settings,
      onClick: () => navigate('/settings'),
      color: 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white p-4 h-auto flex flex-col items-center space-y-2 rounded-lg transition-all duration-200 transform hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
