-- Enable RLS on tables (idempotent)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_pictures ENABLE ROW LEVEL SECURITY;
-- Note: backups table skipped as it has no user_id column

-- Clean up existing policies to avoid conflict when re-running
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profile;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profile;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profile;

DROP POLICY IF EXISTS "Users can insert their own notebooks" ON public.notebooks;
DROP POLICY IF EXISTS "Users can view their own notebooks" ON public.notebooks;
DROP POLICY IF EXISTS "Users can update their own notebooks" ON public.notebooks;
DROP POLICY IF EXISTS "Users can delete their own notebooks" ON public.notebooks;

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

DROP POLICY IF EXISTS "Users can insert their own media" ON public.media;
DROP POLICY IF EXISTS "Users can view their own media" ON public.media;
DROP POLICY IF EXISTS "Users can update their own media" ON public.media;
DROP POLICY IF EXISTS "Users can delete their own media" ON public.media;

DROP POLICY IF EXISTS "Authenticated users own profile pictures" ON public.profile_pictures;
DROP POLICY IF EXISTS "Authenticated users can insert profile pictures" ON public.profile_pictures;
DROP POLICY IF EXISTS "Users can view their own profile pictures" ON public.profile_pictures;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON public.profile_pictures;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON public.profile_pictures;


-- PROFILE POLICIES
CREATE POLICY "Users can insert their own profile" 
ON public.profile FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" 
ON public.profile FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profile FOR UPDATE 
USING (auth.uid() = user_id);


-- PROFILE PICTURES POLICIES
-- INSERT: Allow authenticated users (Ownership established when linked to profile)
CREATE POLICY "Authenticated users can insert profile pictures"
ON public.profile_pictures FOR INSERT
TO authenticated
WITH CHECK (true);

-- SELECT: Check if linked to user's profile
CREATE POLICY "Users can view their own profile pictures"
ON public.profile_pictures FOR SELECT
USING (
  id IN (SELECT profile_pic_id FROM public.profile WHERE user_id = auth.uid())
);

-- UPDATE: Check if linked to user's profile
CREATE POLICY "Users can update their own profile pictures"
ON public.profile_pictures FOR UPDATE
USING (
  id IN (SELECT profile_pic_id FROM public.profile WHERE user_id = auth.uid())
);

-- DELETE: Check if linked to user's profile
CREATE POLICY "Users can delete their own profile pictures"
ON public.profile_pictures FOR delete
USING (
  id IN (SELECT profile_pic_id FROM public.profile WHERE user_id = auth.uid())
);


-- NOTEBOOKS POLICIES
CREATE POLICY "Users can insert their own notebooks" 
ON public.notebooks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notebooks" 
ON public.notebooks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebooks" 
ON public.notebooks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebooks" 
ON public.notebooks FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger Function to check notebook limit
CREATE OR REPLACE FUNCTION public.check_notebook_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.notebooks WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'You have reached the maximum limit of 10 notebooks.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce notebook limit
DROP TRIGGER IF EXISTS trg_check_notebook_limit ON public.notebooks;
CREATE TRIGGER trg_check_notebook_limit
BEFORE INSERT ON public.notebooks
FOR EACH ROW EXECUTE FUNCTION public.check_notebook_limit();

-- Trigger Function to check note limit
CREATE OR REPLACE FUNCTION public.check_note_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.notes WHERE notebook_id = NEW.notebook_id) >= 50 THEN
    RAISE EXCEPTION 'You have reached the maximum limit of 50 notes for this notebook.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce note limit
DROP TRIGGER IF EXISTS trg_check_note_limit ON public.notes;
CREATE TRIGGER trg_check_note_limit
BEFORE INSERT ON public.notes
FOR EACH ROW EXECUTE FUNCTION public.check_note_limit();


-- NOTES POLICIES
-- Checks ownership via the associated notebook
CREATE POLICY "Users can insert their own notes" 
ON public.notes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.notebooks 
    WHERE id = notebook_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own notes" 
ON public.notes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.notebooks 
    WHERE id = notebook_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own notes" 
ON public.notes FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.notebooks 
    WHERE id = notebook_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own notes" 
ON public.notes FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.notebooks 
    WHERE id = notebook_id 
    AND user_id = auth.uid()
  )
);


-- MEDIA POLICIES
-- Checks ownership via the associated note -> notebook
CREATE POLICY "Users can insert their own media" 
ON public.media FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.notes 
    JOIN public.notebooks ON notebooks.id = notes.notebook_id
    WHERE notes.id = note_id 
    AND notebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own media" 
ON public.media FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.notes 
    JOIN public.notebooks ON notebooks.id = notes.notebook_id
    WHERE notes.id = note_id 
    AND notebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own media" 
ON public.media FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.notes 
    JOIN public.notebooks ON notebooks.id = notes.notebook_id
    WHERE notes.id = note_id 
    AND notebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own media" 
ON public.media FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.notes 
    JOIN public.notebooks ON notebooks.id = notes.notebook_id
    WHERE notes.id = note_id 
    AND notebooks.user_id = auth.uid()
  )
);
