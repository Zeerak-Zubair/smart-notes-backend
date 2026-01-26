-- Enable Row Level Security on tables
-- Note: RLS is enabled after table creation in this script for clarity, 
-- but effectively it applies to the table.

-- Backups Table
CREATE TABLE public.backups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  backup_file_url text,
  CONSTRAINT backups_pkey PRIMARY KEY (id)
);
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

-- Notebooks Table
-- Changed: Removed folder_id, added user_id
CREATE TABLE public.notebooks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  color text NOT NULL,
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  order_index bigint NOT NULL,
  CONSTRAINT notebooks_pkey PRIMARY KEY (id),
  CONSTRAINT notebooks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;

-- Notes Table
-- Changed: notebook_id is now uuid
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notebook_id uuid NOT NULL,
  content text,
  order_index bigint,
  updated_at timestamp with time zone,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebooks(id)
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Media Table
-- Changed: note_id is now uuid, file_type changed to text (placeholder for USER-DEFINED)
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  note_id uuid NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL, -- Originally USER-DEFINED in prompt
  file_size text,
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT media_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id)
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Profile Table
-- Changed: id column removed, user_id is now PK
CREATE TABLE public.profile (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  avatar_url text NOT NULL DEFAULT 'https://wittwikunzfealyekurs.supabase.co/storage/v1/object/sign/smart_notes/default_avatar.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yODZjN2M2OC03NGExLTQ1MDAtYTRiZS0wYmQ2ZGMwYzZmNjgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzbWFydF9ub3Rlcy9kZWZhdWx0X2F2YXRhci5wbmciLCJpYXQiOjE3Njc2NTE3MzgsImV4cCI6MTc3MjgzNTczOH0.KN2l--X_AbTlr_5ScQbtflIxyEv22KkjF8y4YnA4Gwg'::text,
  updated_at timestamp with time zone,
  email text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  CONSTRAINT profile_pkey PRIMARY KEY (user_id),
  CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
