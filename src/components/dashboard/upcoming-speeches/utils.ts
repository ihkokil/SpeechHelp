
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
