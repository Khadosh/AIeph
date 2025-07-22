'use server'
import { createClient } from '@/utils/supabase/server'

export async function updateNovel(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('novels')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
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