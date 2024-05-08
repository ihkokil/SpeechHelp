
import { SpeechEvent } from './types';

export const loadEventsFromStorage = (userId: string): SpeechEvent[] => {
  try {
    // Get events from user-specific storage key
    const eventsJson = localStorage.getItem(`upcomingEvents_${userId}`);
    if (eventsJson) {
      const parsedEvents = JSON.parse(eventsJson);
      
      // Convert date strings back to Date objects
      return parsedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading events from storage:', error);
    return [];
  }
};

export const saveEventsToStorage = (events: SpeechEvent[], userId: string): void => {
  try {
    localStorage.setItem(`upcomingEvents_${userId}`, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

export const formatDate = (date: Date, localeCode: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(localeCode, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getDaysRemaining = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'wedding': 'bg-pink-100 text-pink-800',
    'business': 'bg-blue-100 text-blue-800',
    'graduation': 'bg-purple-100 text-purple-800',
    'birthday': 'bg-yellow-100 text-yellow-800',
    'award': 'bg-green-100 text-green-800',
    'farewell': 'bg-red-100 text-red-800',
    'funeral': 'bg-gray-100 text-gray-800',
    'motivational': 'bg-indigo-100 text-indigo-800',
    'tedtalk': 'bg-orange-100 text-orange-800',
    'keynote': 'bg-emerald-100 text-emerald-800',
    'retirement': 'bg-teal-100 text-teal-800',
    'persuasive': 'bg-violet-100 text-violet-800',
    'informative': 'bg-cyan-100 text-cyan-800',
    'entertaining': 'bg-amber-100 text-amber-800',
    'social': 'bg-fuchsia-100 text-fuchsia-800',
    'introduction': 'bg-sky-100 text-sky-800',
    'other': 'bg-slate-100 text-slate-800'
  };
  
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
