ALTER TABLE public.character_relations
ADD COLUMN chapter_id uuid REFERENCES public.chapters(id) ON DELETE CASCADE;