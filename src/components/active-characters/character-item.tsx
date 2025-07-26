import { useTranslations } from 'next-intl'
import { Tables } from '@/types/supabase'
import { NovelWithAll } from '@/types/novel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CharacterAvatar } from './character-avatar'
import { CharacterBadge } from './character-badge'
import { DetectionMethodBadge } from './character-badge'
import { CharacterEvents } from './character-events'
import { CharacterRelations } from './character-relations'
import { 
  getCharacterCurrentChapterRelations, 
  getCharacterCurrentChapterEvents,
  isCharacterActiveInCurrentChapter 
} from './character-data'
import { getCharacterDetectionMethod } from './character-detection'

interface CharacterItemProps {
  character: Tables<'characters'>
  novel: NovelWithAll
  chapter: Tables<'chapters'>
  currentChapterActiveCharacters: Tables<'characters'>[]
  content?: string
}

export function CharacterItem({ 
  character, 
  novel, 
  chapter, 
  currentChapterActiveCharacters,
  content 
}: CharacterItemProps) {
  const t = useTranslations('editor.chapter.activeCharacters')
  
  const currentChapterRelations = getCharacterCurrentChapterRelations(character.id, novel, chapter.id)
  const currentChapterEvents = getCharacterCurrentChapterEvents(character.id, novel, chapter.id)
  const isActive = isCharacterActiveInCurrentChapter(character.id, currentChapterActiveCharacters)
  const detectionMethod = getCharacterDetectionMethod(character.id, novel, chapter.id, content)

  return (
    <AccordionItem
      value={character.id}
      className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="text-left hover:no-underline px-3 py-2.5 [&[data-state=open]]:border-b [&[data-state=open]]:border-gray-100">
        <div className="flex items-center gap-3 w-full">
          <CharacterAvatar isActive={isActive} />
          <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
              {character.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {currentChapterEvents.length > 0 && (
                <CharacterBadge className="bg-blue-50 text-blue-700 border-blue-200">
                  {currentChapterEvents.length === 1 
                    ? t('eventCount', { count: currentChapterEvents.length }) 
                    : t('eventCountPlural', { count: currentChapterEvents.length })
                  }
                </CharacterBadge>
              )}
              {currentChapterRelations.length > 0 && (
                <CharacterBadge className="bg-purple-50 text-purple-700 border-purple-200">
                  {currentChapterRelations.length === 1 
                    ? t('relationCount', { count: currentChapterRelations.length }) 
                    : t('relationCountPlural', { count: currentChapterRelations.length })
                  }
                </CharacterBadge>
              )}
              <DetectionMethodBadge method={detectionMethod} />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <div className="space-y-3">
          {/* Descripción del personaje */}
          {character.summary && (
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{character.summary}</p>
            </div>
          )}

          {/* Eventos del capítulo actual */}
          <CharacterEvents events={currentChapterEvents} />

          {/* Relaciones del capítulo actual */}
          <CharacterRelations 
            relations={currentChapterRelations}
            novel={novel}
            currentCharacterId={character.id}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
} 