-- Phase 1: Database Schema Enhancement
-- Add columns for soft deletion, event dates, and status tracking

ALTER TABLE public.speeches 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'upcoming', 'archived'));

-- Create index for better performance on deleted_at queries
CREATE INDEX IF NOT EXISTS idx_speeches_deleted_at ON public.speeches(deleted_at);

-- Create index for event_date queries
CREATE INDEX IF NOT EXISTS idx_speeches_event_date ON public.speeches(event_date);

-- Create composite index for user queries with soft deletion
CREATE INDEX IF NOT EXISTS idx_speeches_user_active ON public.speeches(user_id, deleted_at);

-- Update RLS policies to exclude soft-deleted speeches
DROP POLICY IF EXISTS "Users can view their own speeches" ON public.speeches;
CREATE POLICY "Users can view their own non-deleted speeches" 
ON public.speeches FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Update other policies to handle soft deletion
DROP POLICY IF EXISTS "Users can update their own speeches" ON public.speeches;
CREATE POLICY "Users can update their own non-deleted speeches" 
ON public.speeches FOR UPDATE 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Allow soft deletion (updating deleted_at)
CREATE POLICY "Users can soft delete their own speeches" 
ON public.speeches FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to handle speech soft deletion
CREATE OR REPLACE FUNCTION public.soft_delete_speech(speech_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the speech to mark as deleted
  UPDATE public.speeches
  SET 
    deleted_at = now(),
    updated_at = now()
  WHERE id = speech_id AND user_id = auth.uid() AND deleted_at IS NULL;
  
  IF FOUND THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Speech soft deleted successfully',
      'deleted_at', now()
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'error', 'Speech not found or already deleted'
    );
  END IF;
  
  RETURN result;
END;
$$;