
// Utility functions for working with speech events
import { SpeechEvent } from './types';

export const formatDate = (date: Date, localeCode: string): string => {
  return date.toLocaleDateString(localeCode, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const getCategoryColor = (category: string): string => {
  const categories: Record<string, string> = {
    'presentation': 'bg-blue-100 text-blue-700',
    'meeting': 'bg-green-100 text-green-700',
    'interview': 'bg-purple-100 text-purple-700',
    'speech': 'bg-amber-100 text-amber-700',
    'wedding': 'bg-pink-100 text-pink-700',
    'birthday': 'bg-yellow-100 text-yellow-700',
    'graduation': 'bg-indigo-100 text-indigo-700',
    'retirement': 'bg-orange-100 text-orange-700',
    'award': 'bg-emerald-100 text-emerald-700',
    'funeral': 'bg-slate-100 text-slate-700',
    'social': 'bg-rose-100 text-rose-700',
    'business': 'bg-sky-100 text-sky-700',
    'entertaining': 'bg-violet-100 text-violet-700',
    'persuasive': 'bg-teal-100 text-teal-700',
    'motivational': 'bg-lime-100 text-lime-700',
    'informative': 'bg-cyan-100 text-cyan-700',
    'tedtalk': 'bg-red-100 text-red-700',
    'keynote': 'bg-blue-100 text-blue-700',
    'other': 'bg-gray-100 text-gray-700'
  };
  
  return categories[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

// Load events from localStorage
export const loadEventsFromStorage = (): SpeechEvent[] => {
  const savedEvents = localStorage.getItem('upcomingEvents');
  if (savedEvents) {
    try {
      const parsedEvents = JSON.parse(savedEvents);
      // Convert string dates back to Date objects
      return parsedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      console.error('Error parsing saved events:', error);
      return [];
    }
  }
  return [];
};

// Save events to localStorage
export const saveEventsToStorage = (events: SpeechEvent[]): void => {
  try {
    localStorage.setItem('upcomingEvents', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};
