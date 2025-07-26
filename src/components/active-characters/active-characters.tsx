'use client'

import { UserPlus2, Calendar, Users, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import { Accordion } from "@/components/ui/accordion"
import { NovelWithAll } from '@/types/novel'
import { Tables } from '@/types/supabase'
import { detectAllCharacters, filterCharactersBySearch } from './character-detection'
import { CharacterList } from './character-list'
import { SearchBar } from './search-bar'
import { EmptyState } from './empty-state'

interface ActiveCharactersProps {
  novel: NovelWithAll
  chapter: Tables<'chapters'>
  content?: string
}

export default function ActiveCharacters({ novel, chapter, content }: ActiveCharactersProps) {
  const t = useTranslations('editor.chapter.activeCharacters')
  const [searchQuery, setSearchQuery] = useState('')

  // Detectar todos los tipos de personajes usando la función utilitaria
  const { currentChapterActive, previouslyActive, inactive } = useMemo(() => 
    detectAllCharacters(novel, chapter, content), 
    [novel, chapter, content]
  )

  // Filtrar personajes por búsqueda usando la función utilitaria
  const filteredCurrentChapterActive = useMemo(() => 
    filterCharactersBySearch(currentChapterActive, searchQuery), 
    [currentChapterActive, searchQuery]
  )

  const filteredPreviouslyActive = useMemo(() => 
    filterCharactersBySearch(previouslyActive, searchQuery), 
    [previouslyActive, searchQuery]
  )

  const filteredInactive = useMemo(() => 
    filterCharactersBySearch(inactive, searchQuery), 
    [inactive, searchQuery]
  )

  const filteredAllCharacters = useMemo(() => 
    filterCharactersBySearch(novel.characters || [], searchQuery), 
    [novel.characters, searchQuery]
  )

  // Estado vacío si no hay personajes
  if (!novel.characters || novel.characters.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="p-4 border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <UserPlus2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-xs text-gray-500">
              {t('activeCount', { count: filteredCurrentChapterActive.length + filteredPreviouslyActive.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Lista de personajes con scroll */}
      <div className="max-h-96 overflow-y-auto pr-2">
        <Accordion type="multiple" className="w-full">
          {/* Personajes activos en el capítulo actual */}
          <CharacterList
            characters={filteredCurrentChapterActive}
            title={t('currentChapterActive')}
            icon={<div className="p-1 bg-green-100 rounded"><Calendar className="h-3 w-3 text-green-600" /></div>}
            badgeColor="bg-green-50 text-green-700 border-green-200"
            novel={novel}
            chapter={chapter}
            currentChapterActiveCharacters={currentChapterActive}
            content={content}
          />

          {/* Personajes activos anteriormente */}
          <CharacterList
            characters={filteredPreviouslyActive}
            title={t('previouslyActive')}
            icon={<div className="p-1 bg-orange-100 rounded"><Users className="h-3 w-3 text-orange-600" /></div>}
            badgeColor="bg-orange-50 text-orange-700 border-orange-200"
            novel={novel}
            chapter={chapter}
            currentChapterActiveCharacters={currentChapterActive}
            content={content}
          />

          {/* Personajes inactivos */}
          <CharacterList
            characters={filteredInactive}
            title={t('inactiveCharacters')}
            icon={<div className="p-1 bg-gray-100 rounded"><User className="h-3 w-3 text-gray-600" /></div>}
            badgeColor="bg-gray-50 text-gray-700 border-gray-200"
            novel={novel}
            chapter={chapter}
            currentChapterActiveCharacters={currentChapterActive}
            content={content}
          />

          {/* Todos los personajes (solo si hay búsqueda activa y no se encontraron resultados en las otras categorías) */}
          {searchQuery.trim() && 
           filteredCurrentChapterActive.length === 0 && 
           filteredPreviouslyActive.length === 0 && 
           filteredInactive.length === 0 && 
           filteredAllCharacters.length > 0 && (
            <CharacterList
              characters={filteredAllCharacters}
              title={t('allCharacters')}
              icon={<div className="p-1 bg-gray-100 rounded"><User className="h-3 w-3 text-gray-600" /></div>}
              badgeColor="bg-gray-50 text-gray-700 border-gray-200"
              novel={novel}
              chapter={chapter}
              currentChapterActiveCharacters={currentChapterActive}
              content={content}
            />
          )}
        </Accordion>
      </div>
    </div>
  )
} 