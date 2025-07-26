-- Create initial schema with novels and chapters tables
-- This migration must run before the characters/events migration

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table: novels
CREATE TABLE public.novels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    summary text,
    genre text,
    status text DEFAULT 'draft',
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- Table: chapters
CREATE TABLE public.chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    order_index integer NOT NULL,
    novel_id uuid REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- Indexes
CREATE INDEX idx_novels_user_id ON public.novels(user_id);
CREATE INDEX idx_chapters_novel_id ON public.chapters(novel_id);
CREATE INDEX idx_chapters_order_index ON public.chapters(order_index);

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_novels
BEFORE UPDATE ON public.novels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_chapters
BEFORE UPDATE ON public.chapters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- RLS (Row Level Security) Policies
-- ================================================

-- Habilitar RLS en las tablas
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Política para la tabla `novels`
-- Los usuarios pueden gestionar (ver, insertar, actualizar, borrar) sus propias novelas.
CREATE POLICY "Users can manage their own novels"
ON public.novels
FOR ALL
USING (user_id = auth.uid());

-- Política para la tabla `chapters`
-- Los usuarios pueden gestionar capítulos que pertenecen a sus novelas.
CREATE POLICY "Users can manage chapters for their own novels"
ON public.chapters
FOR ALL
USING (
  novel_id IN (
    SELECT id FROM public.novels WHERE user_id = auth.uid()
  )
); 