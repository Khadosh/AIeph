-- Table: characters
CREATE TABLE public.characters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    summary text,
    metadata jsonb,
    image text,
    novel_id uuid REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL, -- Hacemos que novel_id no pueda ser nulo
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- Table: events
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    summary text,
    metadata jsonb,
    date text,
    chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
    novel_id uuid REFERENCES public.novels(id) ON DELETE CASCADE NOT NULL, -- Hacemos que novel_id no pueda ser nulo
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- Table: character_relations
CREATE TABLE public.character_relations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    character_a_id uuid REFERENCES public.characters(id) ON DELETE CASCADE,
    character_b_id uuid REFERENCES public.characters(id) ON DELETE CASCADE,
    type text NOT NULL,
    summary text,
    context text,
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz,
    UNIQUE(character_a_id, character_b_id, type)
);

-- Table: event_characters (many-to-many between events and characters)
CREATE TABLE public.event_characters (
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    character_id uuid REFERENCES public.characters(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, character_id)
);

-- Indexes
CREATE INDEX idx_characters_novel_id ON public.characters(novel_id);
CREATE INDEX idx_events_novel_id ON public.events(novel_id);
CREATE INDEX idx_events_chapter_id ON public.events(chapter_id);

-- Triggers for updated_at
-- La función `update_updated_at_column` ya existe de migraciones anteriores.
CREATE TRIGGER set_updated_at_characters
BEFORE UPDATE ON public.characters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_events
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_character_relations
BEFORE UPDATE ON public.character_relations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 

-- ================================================
-- RLS (Row Level Security) Policies
-- ================================================

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_characters ENABLE ROW LEVEL SECURITY;

-- Política para la tabla `characters`
-- Los usuarios pueden gestionar (ver, insertar, actualizar, borrar) personajes que pertenecen a sus novelas.
CREATE POLICY "Users can manage characters for their own novels"
ON public.characters
FOR ALL
USING (
  novel_id IN (
    SELECT id FROM public.novels WHERE user_id = auth.uid()
  )
);

-- Política para la tabla `events`
-- Los usuarios pueden gestionar eventos que pertenecen a sus novelas.
CREATE POLICY "Users can manage events for their own novels"
ON public.events
FOR ALL
USING (
  novel_id IN (
    SELECT id FROM public.novels WHERE user_id = auth.uid()
  )
);

-- Política para la tabla `character_relations`
-- Los usuarios pueden gestionar relaciones si ambos personajes pertenecen a una de sus novelas.
CREATE POLICY "Users can manage relations for their own characters"
ON public.character_relations
FOR ALL
USING (
  (
    SELECT novel_id FROM public.characters WHERE id = character_a_id
  ) IN (
    SELECT id FROM public.novels WHERE user_id = auth.uid()
  )
);

-- Política para la tabla `event_characters`
-- Los usuarios pueden vincular personajes y eventos que pertenecen a sus novelas.
CREATE POLICY "Users can link characters and events for their own novels"
ON public.event_characters
FOR ALL
USING (
  (
    SELECT novel_id FROM public.events WHERE id = event_id
  ) IN (
    SELECT id FROM public.novels WHERE user_id = auth.uid()
  )
);
