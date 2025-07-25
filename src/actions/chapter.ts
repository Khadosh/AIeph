
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { diff_match_patch } from 'diff-match-patch'
import { ValidChapterField, getChapterFieldValue } from '@/types/chapter'
import { TablesUpdate, TablesInsert } from "@/types/supabase";
import { CharacterSuggestion, EventSuggestion, RelationSuggestion } from '@/types/magic-deduction';

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

export async function updateChapter(id: string, data: TablesUpdate<'chapters'>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('chapters')
    .update(data)
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

export async function acceptCharacterSuggestion(
  novelId: string,
  chapterId: string,
  suggestion: CharacterSuggestion
) {
  const supabase = await createClient()
  
  try {
    if (suggestion.isNew) {
      // Crear nuevo personaje
      const { data, error } = await supabase
        .from('characters')
        .insert({
          name: suggestion.name,
          summary: suggestion.description,
          novel_id: novelId,
        })
        .select('id')
        .single()
      
      if (error) throw error
      return { success: true, characterId: data.id }
    } else {
      // Actualizar personaje existente si tiene existingCharacterId
      if (!suggestion.existingCharacterId) {
        throw new Error('Missing existingCharacterId for existing character')
      }
      
      const { error } = await supabase
        .from('characters')
        .update({ summary: suggestion.description })
        .eq('id', suggestion.existingCharacterId)
      
      if (error) throw error
      return { success: true, characterId: suggestion.existingCharacterId }
    }
  } catch (error) {
    console.error('Error accepting character suggestion:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function acceptEventSuggestion(
  novelId: string,
  chapterId: string,
  suggestion: EventSuggestion
) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: suggestion.title,
        summary: suggestion.description,
        novel_id: novelId,
        chapter_id: chapterId,
        date: suggestion.date || null,
      })
      .select('id')
      .single()
    
    if (error) throw error
    
    // Si hay personajes involucrados, crear las relaciones
    if (suggestion.involvedCharacters && suggestion.involvedCharacters.length > 0) {
      // Buscar los IDs de los personajes por nombre
      const { data: characters, error: charactersError } = await supabase
        .from('characters')
        .select('id, name')
        .eq('novel_id', novelId)
        .in('name', suggestion.involvedCharacters)
      
      if (charactersError) {
        console.error('Error finding characters:', charactersError)
      } else if (characters && characters.length > 0) {
        const eventCharacters = characters.map(char => ({
          event_id: data.id,
          character_id: char.id
        }))
        
        const { error: insertError } = await supabase
          .from('event_characters')
          .insert(eventCharacters)
          
        if (insertError) {
          console.error('Error inserting event_characters:', insertError)
        } else {
          console.log(`Inserted ${eventCharacters.length} event_characters relations`)
        }
      } else {
        console.log('No matching characters found for:', suggestion.involvedCharacters)
      }
    }
    
    return { success: true, eventId: data.id }
  } catch (error) {
    console.error('Error accepting event suggestion:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function acceptRelationSuggestion(
  novelId: string,
  chapterId: string,
  suggestion: RelationSuggestion
) {
  const supabase = await createClient()
  
  try {
    // Buscar los IDs de los personajes por nombre
    const { data: characters } = await supabase
      .from('characters')
      .select('id, name')
      .eq('novel_id', novelId)
      .in('name', [suggestion.characterAName, suggestion.characterBName])
    
    if (!characters || characters.length < 2) {
      throw new Error('Could not find both characters for the relationship')
    }
    
    const charA = characters.find(c => c.name === suggestion.characterAName)
    const charB = characters.find(c => c.name === suggestion.characterBName)
    
    if (!charA || !charB) {
      throw new Error('Could not match character names to database records')
    }
    
    const { data, error } = await supabase
      .from('character_relations')
      .insert({
        character_a_id: charA.id,
        character_b_id: charB.id,
        type: suggestion.type,
        summary: suggestion.description,
        context: suggestion.context,
        chapter_id: chapterId,
      })
      .select('id')
      .single()
    
    if (error) throw error
    return { success: true, relationId: data.id }
  } catch (error) {
    console.error('Error accepting relation suggestion:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
