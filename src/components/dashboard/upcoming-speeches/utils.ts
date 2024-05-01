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

// Calculate days remaining until the speech date
export const getDaysRemaining = (date: Date): number => {
  const today = new Date();
  // Reset hours to compare just the dates
  today.setHours(0, 0, 0, 0);
  const speechDate = new Date(date);
  speechDate.setHours(0, 0, 0, 0);
  
  // Calculate the difference in milliseconds
  const differenceMs = speechDate.getTime() - today.getTime();
  // Convert to days
  const daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysDifference); // Ensure we don't show negative days
};

// Load events from localStorage with user ID separation
export const loadEventsFromStorage = (userId: string): SpeechEvent[] => {
  if (!userId) return [];
  
  const storageKey = `upcomingEvents_${userId}`;
  const savedEvents = localStorage.getItem(storageKey);
  
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

// Save events to localStorage with user ID separation
export const saveEventsToStorage = (events: SpeechEvent[], userId: string): void => {
  if (!userId) return;
  
  try {
    const storageKey = `upcomingEvents_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};
