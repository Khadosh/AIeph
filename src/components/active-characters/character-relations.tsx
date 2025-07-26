import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tables } from '@/types/supabase'
import { NovelWithAll } from '@/types/novel'
import { getOtherCharacterInRelation } from './character-data'

interface CharacterRelationsProps {
  relations: Tables<'character_relations'>[]
  novel: NovelWithAll
  currentCharacterId: string
}

export function CharacterRelations({ relations, novel, currentCharacterId }: CharacterRelationsProps) {
  const t = useTranslations('editor.chapter.activeCharacters')

  if (relations.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-purple-100 rounded">
          <Heart className="h-3 w-3 text-purple-600" />
        </div>
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {t('currentChapterRelations')}
        </span>
      </div>
      <div className="space-y-1.5">
        {relations.map((relation) => {
          const otherCharacter = getOtherCharacterInRelation(relation, currentCharacterId, novel)

          return (
            <div key={relation.id} className="flex flex-col gap-1 text-sm bg-purple-50 border border-purple-100 px-3 py-2 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span className="font-medium text-gray-900">{otherCharacter?.name || t('unknown')}</span>
                <span className="text-gray-500">•</span>
                <span className="text-purple-700 text-xs font-medium">{relation.type}</span>
              </div>
              {relation.summary && (
                <div className="text-xs text-gray-600 ml-3.5">
                  {relation.summary}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 