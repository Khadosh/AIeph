
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

export async function deleteChapter(chapterId: string, novelId: string) {
  const supabase = await createClient();

  // First, get the chapter to know its order_index
  const { data: chapterData, error: chapterError } = await supabase
    .from('chapters')
    .select('order_index')
    .eq('id', chapterId)
    .single();

  if (chapterError) {
    console.error('Error fetching chapter:', chapterError);
    return { error: 'Failed to fetch chapter' };
  }

  // Delete the chapter
  const { error: deleteError } = await supabase
    .from('chapters')
    .delete()
    .eq('id', chapterId);

  if (deleteError) {
    console.error('Error deleting chapter:', deleteError);
    return { error: 'Failed to delete chapter' };
  }

  // Reorder remaining chapters to fill the gap
  const { data: remainingChapters, error: reorderError } = await supabase
    .from('chapters')
    .select('id, order_index')
    .eq('novel_id', novelId)
    .gt('order_index', chapterData.order_index)
    .order('order_index', { ascending: true });

  if (reorderError) {
    console.error('Error fetching remaining chapters:', reorderError);
    return { error: 'Failed to reorder chapters' };
  }

  // Update order_index for chapters that come after the deleted one
  if (remainingChapters && remainingChapters.length > 0) {
    const updates = remainingChapters.map(chapter => ({
      id: chapter.id,
      order_index: chapter.order_index - 1
    }));

    const { error: updateError } = await supabase
      .from('chapters')
      .upsert(updates);

    if (updateError) {
      console.error('Error updating chapter order:', updateError);
      return { error: 'Failed to reorder chapters' };
    }
  }

  // Revalidate the novel page to reflect the changes
  revalidatePath(`/creator/novel/${novelId}`);

  return { success: true };
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
      return { success: false, error: 'No se pudo leer el capítulo' }
    }
    
    if (!content) {
      return { success: false, error: 'Capítulo no encontrado' }
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
      return { success: false, error: 'Patch inválido' }
    }

    const [newContent, results] = dmp.patch_apply(patchObj, oldContent)
    if (!results.every(Boolean)) {
      return { success: false, error: 'No se pudo aplicar el patch completo' }
    }

    // 3. Guardar el nuevo contenido
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ [field]: newContent })
      .eq('id', chapterId)
    
    if (updateError) {
      console.error('Database update error:', updateError)
      return { success: false, error: 'No se pudo guardar el capítulo' }
    }
    
    return { success: true, data: { field, newLength: newContent.length } }
  } catch (e) {
    console.error('Unexpected error in autosaveChapterPatch:', e)
    return { 
      success: false, 
      error: `Error inesperado: ${e instanceof Error ? e.message : 'Desconocido'}` 
    }
  }
}
