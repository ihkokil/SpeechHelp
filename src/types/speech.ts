
export type Speech = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  speech_type: string;
  isUpcoming?: boolean;
  event_date?: string;
};
