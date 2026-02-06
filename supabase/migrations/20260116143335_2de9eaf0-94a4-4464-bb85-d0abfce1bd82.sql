-- Drop existing policies that apply to public role
DROP POLICY IF EXISTS "Users can create their own speeches" ON public.speeches;
DROP POLICY IF EXISTS "Users can delete their own speeches" ON public.speeches;
DROP POLICY IF EXISTS "Users can soft delete their own speeches" ON public.speeches;
DROP POLICY IF EXISTS "Users can update their own non-deleted speeches" ON public.speeches;
DROP POLICY IF EXISTS "Users can view their own non-deleted speeches" ON public.speeches;

-- Recreate policies that ONLY apply to authenticated users

-- SELECT: Only authenticated users can view their own non-deleted speeches
CREATE POLICY "Authenticated users can view own speeches"
ON public.speeches
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) AND (deleted_at IS NULL));

-- INSERT: Only authenticated users can create their own speeches
CREATE POLICY "Authenticated users can create own speeches"
ON public.speeches
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Only authenticated users can update their own non-deleted speeches
CREATE POLICY "Authenticated users can update own speeches"
ON public.speeches
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) AND (deleted_at IS NULL))
WITH CHECK (auth.uid() = user_id);

-- DELETE: Only authenticated users can delete their own speeches
CREATE POLICY "Authenticated users can delete own speeches"
ON public.speeches
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);