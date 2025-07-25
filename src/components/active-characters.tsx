'use client'

import { UserPlus2, User, Calendar, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { NovelWithAll } from '@/types/novel'
import { Tables } from '@/types/supabase'

interface ActiveCharactersProps {
  novel: NovelWithAll
  chapter: Tables<'chapters'>
}

export default function ActiveCharacters({ novel, chapter }: ActiveCharactersProps) {
  const t = useTranslations('editor.chapter.activeCharacters')
  
  // Obtener personajes que aparecen hasta este capítulo
  const currentOrder = chapter.order_index
  
  // Filtrar eventos hasta el capítulo actual para encontrar personajes activos
  const relevantEvents = novel.events?.filter(event => {
    if (!event.chapter_id) return false
    const eventChapter = novel.chapters?.find(c => c.id === event.chapter_id)
    return eventChapter && eventChapter.order_index <= currentOrder
  }) || []

  // Obtener personajes que participan en eventos
  const activeCharacterIds = new Set<string>()
  
  relevantEvents.forEach(event => {
    event.event_characters?.forEach(ec => {
      activeCharacterIds.add(ec.character_id)
    })
  })

  // Filtrar personajes activos
  const activeCharacters = novel.characters?.filter(char => 
    activeCharacterIds.has(char.id)
  ) || []

  // Si no hay personajes activos, mostrar todos los personajes de la novela
  const charactersToShow = activeCharacters.length > 0 ? activeCharacters : (novel.characters || [])

  // Obtener relaciones para cada personaje
  const getCharacterRelations = (characterId: string) => {
    return novel.character_relations?.filter(rel => 
      (rel.character_a_id === characterId || rel.character_b_id === characterId) &&
      rel.chapter_id && 
      novel.chapters?.find(c => c.id === rel.chapter_id)?.order_index <= currentOrder
    ) || []
  }

  // Obtener eventos donde participa el personaje
  const getCharacterEvents = (characterId: string) => {
    return relevantEvents.filter(event =>
      event.event_characters?.some(ec => ec.character_id === characterId)
    )
  }

  if (charactersToShow.length === 0) {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2">
          <UserPlus2 className="h-5 w-5 text-primary" />
          {t('title')}
        </div>
        <p className="text-sm text-gray-500">
          {t('noCharacters')}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <UserPlus2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-xs text-gray-500">{t('activeCount', { count: charactersToShow.length })}</p>
          </div>
        </div>
      </div>
      
      <Accordion type="multiple" className="w-full space-y-2">
        {charactersToShow.map((character) => {
          const relations = getCharacterRelations(character.id)
          const events = getCharacterEvents(character.id)
          
          return (
            <AccordionItem 
              key={character.id} 
              value={character.id} 
              className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline px-3 py-2.5 [&[data-state=open]]:border-b [&[data-state=open]]:border-gray-100">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{character.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {events.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                          {events.length === 1 ? t('eventCount', { count: events.length }) : t('eventCountPlural', { count: events.length })}
                        </Badge>
                      )}
                      {relations.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 border-purple-200">
                          {relations.length === 1 ? t('relationCount', { count: relations.length }) : t('relationCountPlural', { count: relations.length })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-3 pl-11">
                  {/* Descripción del personaje */}
                  {character.summary && (
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm text-gray-700 leading-relaxed">{character.summary}</p>
                    </div>
                  )}
                  
                  {/* Eventos recientes */}
                  {events.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t('recentEvents')}</span>
                      </div>
                      <div className="space-y-1.5">
                        {events.slice(-3).map((event) => (
                          <div key={event.id} className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-md">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Relaciones */}
                  {relations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-purple-100 rounded">
                          <Heart className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t('relations')}</span>
                      </div>
                      <div className="space-y-1.5">
                        {relations.slice(0, 3).map((relation) => {
                          const otherCharacterId = relation.character_a_id === character.id 
                            ? relation.character_b_id 
                            : relation.character_a_id
                          const otherCharacter = novel.characters?.find(c => c.id === otherCharacterId)
                          
                          return (
                            <div key={relation.id} className="flex items-center gap-2 text-sm bg-purple-50 border border-purple-100 px-3 py-2 rounded-md">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                              <span className="font-medium text-gray-900">{otherCharacter?.name || t('unknown')}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-purple-700 text-xs font-medium">{relation.type}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}