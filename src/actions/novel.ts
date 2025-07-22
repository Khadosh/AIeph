'use server'
import { createClient } from '@/utils/supabase/server'
import { TablesUpdate } from '@/types/supabase'

export async function updateNovel(id: string, data: TablesUpdate<'novels'>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('novels')
    .update(data)
    .eq('id', id)
  if (error) throw error
}

export async function deleteNovel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('novels')
    .delete()
    .eq('id', id)
  if (error) throw error
} 