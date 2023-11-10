
export interface SpeechEvent {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  category: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}
