
import { SpeechEvent } from "./types";

// Format date based on language
export const formatDate = (date: Date, languageCode: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return new Date(date).toLocaleDateString(languageCode, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date(date).toLocaleDateString();
  }
};

// Get color class based on category - updated to match speech-utils.ts color scheme
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'wedding': 'bg-pink-100 text-pink-800',
    'graduation': 'bg-blue-100 text-blue-800',
    'birthday': 'bg-purple-100 text-purple-800',
    'business': 'bg-slate-100 text-slate-800',
    'tedtalk': 'bg-red-100 text-red-800',
    'motivational': 'bg-amber-100 text-amber-800',
    'funeral': 'bg-gray-100 text-gray-800',
    'keynote': 'bg-emerald-100 text-emerald-800',
    'social': 'bg-indigo-100 text-indigo-800',
    'farewell': 'bg-cyan-100 text-cyan-800',
    'informative': 'bg-teal-100 text-teal-800',
    'persuasive': 'bg-orange-100 text-orange-800',
    'entertaining': 'bg-violet-100 text-violet-800',
    'retirement': 'bg-sky-100 text-sky-800',
    'award': 'bg-lime-100 text-lime-800',
    'personal': 'bg-green-100 text-green-800',
    'academic': 'bg-purple-100 text-purple-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Load events from localStorage
export const loadEventsFromStorage = (): SpeechEvent[] => {
  try {
    const savedEvents = localStorage.getItem('upcomingEvents');
    if (savedEvents) {
      // Parse and convert date strings back to Date objects
      return JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
  } catch (error) {
    console.error('Error loading events from storage:', error);
  }
  return [];
};

// Save events to localStorage
export const saveEventsToStorage = (events: SpeechEvent[]): void => {
  try {
    // Convert Date objects to ISO strings for storage
    const eventsForStorage = events.map(event => ({
      ...event,
      date: event.date instanceof Date 
        ? event.date.toISOString() 
        : new Date(event.date).toISOString()
    }));
    
    localStorage.setItem('upcomingEvents', JSON.stringify(eventsForStorage));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};
