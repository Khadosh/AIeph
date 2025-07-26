import { NovelWithAll } from '@/types/novel'
import { Tables } from '@/types/supabase'

/**
 * Obtiene relaciones específicas del capítulo actual para un personaje
 */
export function getCharacterCurrentChapterRelations(
  characterId: string, 
  novel: NovelWithAll, 
  chapterId: string
) {
  return novel.character_relations?.filter(rel =>
    (rel.character_a_id === characterId || rel.character_b_id === characterId) &&
    rel.chapter_id === chapterId
  ) || []
}

/**
 * Obtiene eventos específicos del capítulo actual donde participa el personaje
 */
export function getCharacterCurrentChapterEvents(
  characterId: string, 
  novel: NovelWithAll, 
  chapterId: string
) {
  const currentChapterEvents = novel.events?.filter(event =>
    event.chapter_id === chapterId
  ) || []

  return currentChapterEvents.filter(event =>
    event.event_characters?.some((ec: Tables<'event_characters'>) => ec.character_id === characterId)
  )
}

/**
 * Obtiene el otro personaje en una relación
 */
export function getOtherCharacterInRelation(
  relation: Tables<'character_relations'>, 
  currentCharacterId: string, 
  novel: NovelWithAll
) {
  const otherCharacterId = relation.character_a_id === currentCharacterId
    ? relation.character_b_id
    : relation.character_a_id
  return novel.characters?.find(c => c.id === otherCharacterId)
}

/**
 * Determina si un personaje está activo en el capítulo actual
 */
export function isCharacterActiveInCurrentChapter(
  characterId: string, 
  currentChapterActiveCharacters: Tables<'characters'>[]
) {
  return currentChapterActiveCharacters.some(char => char.id === characterId)
} 