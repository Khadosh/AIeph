import { NovelWithAll } from '@/types/novel'
import { Tables } from '@/types/supabase'

export interface CharacterDetectionResult {
  currentChapterActive: Tables<'characters'>[]
  previouslyActive: Tables<'characters'>[]
  inactive: Tables<'characters'>[]
}

export interface CharacterDetectionMethod {
  characterId: string
  method: 'event' | 'text' | 'both' | 'none'
}

/**
 * Detecta personajes mencionados en el texto del capítulo
 */
export function getCharactersMentionedInText(content: string, characters: Tables<'characters'>[]) {
  if (!content || !characters) return []
  
  const mentionedCharacters = characters.filter(character => {
    // Limpiar el contenido de HTML tags para búsqueda de texto plano
    const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
    
    // Buscar el nombre del personaje en el texto (case insensitive)
    // Escapar caracteres especiales en el nombre
    const escapedName = character.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const nameRegex = new RegExp(`\\b${escapedName}\\b`, 'gi')
    
    return nameRegex.test(cleanContent)
  })
  
  return mentionedCharacters
}

/**
 * Obtiene personajes activos en el capítulo actual basado en eventos
 */
export function getCurrentChapterActiveCharacters(novel: NovelWithAll, chapterId: string) {
  const currentChapterEvents = novel.events?.filter(event =>
    event.chapter_id === chapterId
  ) || []

  const currentChapterCharacterIds = new Set<string>()
  currentChapterEvents.forEach(event => {
    event.event_characters?.forEach((ec: Tables<'event_characters'>) => {
      currentChapterCharacterIds.add(ec.character_id)
    })
  })

  return novel.characters?.filter(char =>
    currentChapterCharacterIds.has(char.id)
  ) || []
}

/**
 * Obtiene personajes mencionados en el texto y combina con eventos
 */
export function getTextMentionedCharacters(novel: NovelWithAll, chapterId: string, content?: string) {
  const eventActiveCharacters = getCurrentChapterActiveCharacters(novel, chapterId)
  const mentionedCharacters = getCharactersMentionedInText(content || '', novel.characters || [])
  
  // Combinar personajes de eventos y mencionados en texto, sin duplicados
  const allActiveCharacterIds = new Set([
    ...eventActiveCharacters.map(char => char.id),
    ...mentionedCharacters.map(char => char.id)
  ])
  
  return novel.characters?.filter(char => allActiveCharacterIds.has(char.id)) || []
}

/**
 * Obtiene personajes que han estado activos en capítulos anteriores
 */
export function getPreviouslyActiveCharacters(novel: NovelWithAll, currentChapterOrder: number) {
  // Filtrar eventos de capítulos anteriores al actual
  const previousEvents = novel.events?.filter(event => {
    if (!event.chapter_id) return false
    const eventChapter = novel.chapters?.find(c => c.id === event.chapter_id)
    return eventChapter && eventChapter.order_index < currentChapterOrder
  }) || []

  const previousCharacterIds = new Set<string>()
  previousEvents.forEach(event => {
    event.event_characters?.forEach((ec: Tables<'event_characters'>) => {
      previousCharacterIds.add(ec.character_id)
    })
  })

  return novel.characters?.filter(char => previousCharacterIds.has(char.id)) || []
}

/**
 * Obtiene personajes inactivos
 */
export function getInactiveCharacters(novel: NovelWithAll, activeCharacterIds: Set<string>) {
  return novel.characters?.filter(char => !activeCharacterIds.has(char.id)) || []
}

/**
 * Función principal para detectar todos los tipos de personajes
 */
export function detectAllCharacters(novel: NovelWithAll, chapter: Tables<'chapters'>, content?: string): CharacterDetectionResult {
  const currentChapterActive = getTextMentionedCharacters(novel, chapter.id, content)
  const previouslyActive = getPreviouslyActiveCharacters(novel, chapter.order_index)
  
  const activeCharacterIds = new Set([
    ...currentChapterActive.map(char => char.id),
    ...previouslyActive.map(char => char.id)
  ])
  
  const inactive = getInactiveCharacters(novel, activeCharacterIds)

  return {
    currentChapterActive,
    previouslyActive,
    inactive
  }
}

/**
 * Determina el método de detección de un personaje
 */
export function getCharacterDetectionMethod(
  characterId: string, 
  novel: NovelWithAll, 
  chapterId: string, 
  content?: string
): CharacterDetectionMethod['method'] {
  const eventActiveCharacters = getCurrentChapterActiveCharacters(novel, chapterId)
  const mentionedCharacters = getCharactersMentionedInText(content || '', novel.characters || [])
  
  const isEventActive = eventActiveCharacters.some(char => char.id === characterId)
  const isMentionedInText = mentionedCharacters.some(char => char.id === characterId)
  
  if (isEventActive && isMentionedInText) {
    return 'both'
  } else if (isEventActive) {
    return 'event'
  } else if (isMentionedInText) {
    return 'text'
  } else {
    return 'none'
  }
}

/**
 * Filtra personajes por búsqueda
 */
export function filterCharactersBySearch(
  characters: Tables<'characters'>[], 
  searchQuery: string
) {
  if (!searchQuery.trim()) return characters
  
  const query = searchQuery.toLowerCase()
  return characters.filter(character =>
    character.name.toLowerCase().includes(query) ||
    (character.summary && character.summary.toLowerCase().includes(query))
  )
} 