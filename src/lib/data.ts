import { createClient } from '@/utils/supabase/server';

export const fetchNovel = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', novelId)
    .single()

  return { data, error }
}

export const fetchChapter = async (chapterId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single()

  return { data, error }
}

export const fetchChapters = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .order('order_index', { ascending: true })

  return { data, error }
}

export const fetchLatestNovels = async (limit: number = 3) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*, chapters(id)')
    .order('updated_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

export const fetchNovels = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const fetchNovelWithChapters = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*, chapters(*)')
    .eq('id', novelId)
    .order('order_index', { referencedTable: 'chapters', ascending: true })
    .single()

  return { data, error }
}

export const fetchNovelWithChapter = async (novelId: string, chapterId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*, chapters(*)')
    .eq('id', novelId)
    .eq('chapters.id', chapterId)
    .single()

  return { data, error }
}

export const fetchCharacters = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('novel_id', novelId)

  return { data, error }
}

export const fetchEvents = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('novel_id', novelId)

    return { data, error }
}

export const fetchNovelWithAll = async (novelId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('novels')
    .select('*, chapters(*, character_relations(*), events(*, event_characters(*))), characters(*)')
    .eq('id', novelId)
    .single()

  return { data, error }
}