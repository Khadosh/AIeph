import { ReactNode } from 'react'
import { Tables } from '@/types/supabase'
import { Badge } from "@/components/ui/badge"
import { CharacterItem } from './character-item'
import { NovelWithAll } from '@/types/novel'

interface CharacterListProps {
  characters: Tables<'characters'>[]
  title: string
  icon: ReactNode
  badgeColor: string
  novel: NovelWithAll
  chapter: Tables<'chapters'>
  currentChapterActiveCharacters: Tables<'characters'>[]
  content?: string
}

export function CharacterList({ 
  characters, 
  title, 
  icon, 
  badgeColor, 
  novel, 
  chapter, 
  currentChapterActiveCharacters,
  content 
}: CharacterListProps) {
  if (!characters || characters.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-medium text-sm text-gray-700">{title}</h4>
        <Badge variant="secondary" className={`text-xs ${badgeColor}`}>
          {characters.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {characters.map((character) => (
          <CharacterItem
            key={character.id}
            character={character}
            novel={novel}
            chapter={chapter}
            currentChapterActiveCharacters={currentChapterActiveCharacters}
            content={content}
          />
        ))}
      </div>
    </div>
  )
} 