
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

// Get color class based on category
export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'business':
      return 'bg-blue-100 text-blue-800';
    case 'personal':
      return 'bg-green-100 text-green-800';
    case 'academic':
      return 'bg-purple-100 text-purple-800';
    case 'social':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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
