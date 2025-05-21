
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
      const parsedEvents = JSON.parse(eventsJson);
      console.log(`Successfully loaded ${parsedEvents.length} upcoming events for user ${userId}`);
      
      // Ensure we properly convert date strings to Date objects
      return parsedEvents.map((event: any) => ({
        ...event,
        date: event.date ? new Date(event.date) : new Date()
      }));
    } else {
      console.log(`No upcoming events found in storage for user ${userId}`);
    }
  } catch (error) {
    console.error('Error loading events from storage:', error);
  }
  
  return [];
};

// Updated to take a userId parameter and properly handle dates for serialization
export const saveEventsToStorage = (events: SpeechEvent[], userId?: string): void => {
  if (!userId) {
    console.error('Cannot save events: No user ID provided');
    return;
  }

  try {
    const storageKey = `upcomingEvents_${userId}`;
    // Convert Date objects to ISO strings for storage
    const serializedEvents = events.map(event => ({
      ...event,
      date: event.date instanceof Date ? event.date.toISOString() : event.date
    }));
    localStorage.setItem(storageKey, JSON.stringify(serializedEvents));
    console.log(`Saved ${events.length} events to storage for user ${userId}`);
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

// Helper function to clear all events for a user
export const clearUserEvents = (userId: string): void => {
  if (!userId) return;
  
  const storageKey = `upcomingEvents_${userId}`;
  localStorage.removeItem(storageKey);
  console.log(`Cleared all events for user ${userId}`);
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
  if (!date) {
    return 'No Date';
  }
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Date Error';
  }
};

// Get number of days remaining until an event
export const getDaysRemaining = (date: Date): number => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = date instanceof Date ? date : new Date(date);
    if (isNaN(eventDate.getTime())) {
      return 0;
    }
    
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch (error) {
    console.error('Error calculating days remaining:', error, date);
    return 0;
  }
};

// Get color class based on speech category
export const getCategoryColor = (category: string): string => {
  switch (category?.toLowerCase() || 'other') {
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
