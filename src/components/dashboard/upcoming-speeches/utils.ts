
import { format, differenceInDays } from 'date-fns';
import { SpeechEvent } from './types';

export const getCategoryColor = (category: string): string => {
  // Base classes with consistent styling - explicitly remove hover effects
  const baseClasses = 'hover:bg-current hover:text-current pointer-events-none';
  
  switch (category.toLowerCase()) {
    case 'presentation':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'meeting':
      return `${baseClasses} bg-green-100 text-green-700`;
    case 'interview':
      return `${baseClasses} bg-purple-100 text-purple-700`;
    case 'speech':
      return `${baseClasses} bg-amber-100 text-amber-700`;
    case 'wedding':
      return `${baseClasses} bg-pink-100 text-pink-700`;
    case 'birthday':
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    case 'graduation':
      return `${baseClasses} bg-indigo-100 text-indigo-700`;
    case 'retirement':
      return `${baseClasses} bg-orange-100 text-orange-700`;
    case 'award':
      return `${baseClasses} bg-emerald-100 text-emerald-700`;
    case 'funeral':
      return `${baseClasses} bg-slate-100 text-slate-700`;
    case 'social':
      return `${baseClasses} bg-rose-100 text-rose-700`;
    case 'business':
      return `${baseClasses} bg-sky-100 text-sky-700`;
    case 'entertaining':
      return `${baseClasses} bg-violet-100 text-violet-700`;
    case 'persuasive':
      return `${baseClasses} bg-teal-100 text-teal-700`;
    case 'motivational':
      return `${baseClasses} bg-lime-100 text-lime-700`;
    case 'informative':
      return `${baseClasses} bg-cyan-100 text-cyan-700`;
    case 'tedtalk':
      return `${baseClasses} bg-red-100 text-red-700`;
    case 'keynote':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'farewell':
      return `${baseClasses} bg-amber-100 text-amber-700`;
    case 'upcoming':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'other':
      return `${baseClasses} bg-gray-100 text-gray-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const getDaysRemaining = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return differenceInDays(dateObj, today);
};

export const loadEventsFromStorage = (userId: string): SpeechEvent[] | null => {
  try {
    const storageKey = `upcomingEvents_${userId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const events = JSON.parse(stored);
      
      // Convert date strings back to Date objects and filter out past events
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Start of today
      
      const validEvents = events
        .map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }))
        .filter((event: SpeechEvent) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0); // Start of event day
          return eventDate >= currentDate; // Keep events from today onwards
        });
      
      // If we filtered out events, save the cleaned list back to storage
      if (validEvents.length !== events.length) {
        saveEventsToStorage(validEvents, userId);
        console.log(`🧹 Cleaned up ${events.length - validEvents.length} past events`);
      }
      
      return validEvents;
    }
  } catch (error) {
    console.error('Error loading events from storage:', error);
  }
  return null;
};

export const saveEventsToStorage = (events: SpeechEvent[], userId: string): void => {
  try {
    const storageKey = `upcomingEvents_${userId}`;
    const eventsToStore = events.map(event => ({
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    }));
    localStorage.setItem(storageKey, JSON.stringify(eventsToStore));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

export const removeEventFromStorage = (eventId: string, userId: string): void => {
  try {
    const events = loadEventsFromStorage(userId) || [];
    const filteredEvents = events.filter(event => event.id !== eventId);
    saveEventsToStorage(filteredEvents, userId);
    console.log(`🗑️ Removed event ${eventId} from storage`);
  } catch (error) {
    console.error('Error removing event from storage:', error);
  }
};

export const markEventAsCompleted = (eventId: string, userId: string): void => {
  try {
    const events = loadEventsFromStorage(userId) || [];
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: 'completed' as const } : event
    );
    saveEventsToStorage(updatedEvents, userId);
    console.log(`✅ Marked event ${eventId} as completed`);
  } catch (error) {
    console.error('Error marking event as completed:', error);
  }
};
