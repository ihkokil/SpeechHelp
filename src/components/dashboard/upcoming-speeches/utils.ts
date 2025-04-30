
import { SpeechEvent } from './types';

// Updated to take a userId parameter
export const loadEventsFromStorage = (userId?: string): SpeechEvent[] => {
  if (!userId) {
    console.error('Cannot load events: No user ID provided');
    return [];
  }

  try {
    const storageKey = `upcomingEvents_${userId}`;
    const eventsJson = localStorage.getItem(storageKey);
    
    if (eventsJson) {
      return JSON.parse(eventsJson);
    }
  } catch (error) {
    console.error('Error loading events from storage:', error);
  }
  
  return [];
};

// Updated to take a userId parameter
export const saveEventsToStorage = (events: SpeechEvent[], userId?: string): void => {
  if (!userId) {
    console.error('Cannot save events: No user ID provided');
    return;
  }

  try {
    const storageKey = `upcomingEvents_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

// Helper function to clear all events for a user
export const clearUserEvents = (userId: string): void => {
  if (!userId) return;
  
  const storageKey = `upcomingEvents_${userId}`;
  localStorage.removeItem(storageKey);
};

// Update the event list for a specific user
export const updateEventForUser = (
  userId: string, 
  eventId: string, 
  updatedData: Partial<SpeechEvent>
): SpeechEvent[] => {
  if (!userId) return [];
  
  const events = loadEventsFromStorage(userId);
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, ...updatedData } : event
  );
  saveEventsToStorage(updatedEvents, userId);
  return updatedEvents;
};

// Format date for display
export const formatDate = (date: Date, locale = 'en-US'): string => {
  return new Date(date).toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get number of days remaining until an event
export const getDaysRemaining = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get color class based on speech category
export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'wedding':
      return 'bg-pink-100 text-pink-800';
    case 'business':
      return 'bg-blue-100 text-blue-800';
    case 'motivational':
      return 'bg-orange-100 text-orange-800';
    case 'funeral':
      return 'bg-purple-100 text-purple-800';
    case 'birthday':
      return 'bg-green-100 text-green-800';
    case 'graduation':
      return 'bg-yellow-100 text-yellow-800';
    case 'retirement':
      return 'bg-teal-100 text-teal-800';
    case 'farewell':
      return 'bg-indigo-100 text-indigo-800';
    case 'award':
      return 'bg-amber-100 text-amber-800';
    case 'entertaining':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
