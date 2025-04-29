
import { format } from 'date-fns';
import { enUS, es, fr } from 'date-fns/locale';
import { SpeechEvent } from './types';

// Get date-fns locale based on app language
const getDateLocale = (langCode: string) => {
  switch (langCode) {
    case 'es': return es;
    case 'fr': return fr;
    default: return enUS;
  }
};

// Format date for display
export const formatDate = (date: Date, langCode: string = 'en') => {
  const locale = getDateLocale(langCode);
  return format(date, 'MMM d, yyyy', { locale });
};

// Get days remaining until event
export const getDaysRemaining = (date: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(date.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get tailwind class for event category
export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'business':
      return 'bg-blue-100 text-blue-800';
    case 'wedding':
      return 'bg-pink-100 text-pink-800';
    case 'birthday':
      return 'bg-purple-100 text-purple-800';
    case 'graduation':
      return 'bg-green-100 text-green-800';
    case 'motivational':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Save events to localStorage with optional user-specific key
export const saveEventsToStorage = (events: SpeechEvent[], key: string = 'upcomingEvents'): void => {
  try {
    const serializedEvents = JSON.stringify(events.map(event => ({
      ...event,
      date: event.date.toISOString() // Convert Date to string for serialization
    })));
    
    localStorage.setItem(key, serializedEvents);
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

// Load events from localStorage with optional user-specific key
export const loadEventsFromStorage = (key: string = 'upcomingEvents'): SpeechEvent[] => {
  try {
    const serializedEvents = localStorage.getItem(key);
    
    if (!serializedEvents) {
      return [];
    }
    
    const parsedEvents = JSON.parse(serializedEvents);
    
    // Convert ISO date strings back to Date objects
    return parsedEvents.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};
