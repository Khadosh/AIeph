
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { diff_match_patch } from 'diff-match-patch'
import { ValidChapterField, getChapterFieldValue } from '@/types/chapter'

export async function createChapter(novelId: string) {
  const supabase = await createClient();

  // First, get the highest order_index for the given novel_id
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('chapters')
    .select('order_index')
    .eq('novel_id', novelId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  if (maxOrderError && maxOrderError.code !== 'PGRST116') { // Ignore 'range not found' error
    console.error('Error fetching max order_index:', maxOrderError);
    return;
  }

  const newOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 1;

  const { data, error } = await supabase
    .from('chapters')
    .insert([
      {
        novel_id: novelId,
        title: '',
        content: '',
        order_index: newOrderIndex,
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating chapter:', error);
    return;
  }

  // Revalidate the novel page to show the new chapter in the list
  revalidatePath(`/creator/novel/${novelId}`);

  // Redirect to the new chapter's edit page
  redirect(`/creator/novel/${novelId}/chapter/${data.id}`);
}

export async function updateChapter(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('chapters')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  if (error) throw error
}

export async function deleteChapter(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function autosaveChapterPatch({
  chapterId,
  patch,
  field,
}: {
  chapterId: string
  patch: string
  field: ValidChapterField
}) {
  const supabase = await createClient()
  try {
    // 1. Leer el capítulo actual
    const { data: content, error: fetchError } = await supabase
      .from('chapters')
      .select(field)
      .eq('id', chapterId)
      .single()
    
    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      return { success: false, error: 'Could not read chapter' }
    }
    
    if (!content) {
      return { success: false, error: 'Chapter not found' }
    }

    // Use safe field access
    const oldContent = getChapterFieldValue(content, field)

    // 2. Aplicar el patch
    const dmp = new diff_match_patch()
    let patchObj
    try {
      patchObj = dmp.patch_fromText(patch)
    } catch (patchError) {
      console.error('Patch parsing error:', patchError)
      return { success: false, error: 'Invalid patch' }
    }

    const [newContent, results] = dmp.patch_apply(patchObj, oldContent)
    if (!results.every(Boolean)) {
      return { success: false, error: 'Could not apply complete patch' }
    }

    // 3. Guardar el nuevo contenido
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ [field]: newContent })
      .eq('id', chapterId)
    
    if (updateError) {
      console.error('Database update error:', updateError)
      return { success: false, error: 'Could not save chapter' }
    }
    
    return { success: true, data: { field, newLength: newContent.length } }
  } catch (e) {
    console.error('Unexpected error in autosaveChapterPatch:', e)
    return { 
      success: false, 
      error: `Unexpected error: ${e instanceof Error ? e.message : 'Unknown'}` 
    }
  }
}
