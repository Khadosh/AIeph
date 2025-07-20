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