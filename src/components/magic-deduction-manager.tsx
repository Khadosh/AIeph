'use client'

import { useState } from 'react'
import { Brain, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { generateMagic } from '@/actions/ai'
import { acceptCharacterSuggestion, acceptEventSuggestion, acceptRelationSuggestion } from '@/actions/chapter'
import { MagicDeductionResponse, CharacterSuggestion, EventSuggestion, RelationSuggestion } from '@/types/magic-deduction'
import MagicSuggestions from '@/components/magic-suggestions'
import { NovelWithAll } from '@/types/novel'
import { Tables } from '@/types/supabase'

interface MagicDeductionManagerProps {
  novel: NovelWithAll
  chapter: Tables<'chapters'>
  content: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function MagicDeductionManager({
  novel,
  chapter,
  content,
  isOpen,
  onOpenChange
}: MagicDeductionManagerProps) {
  const [suggestions, setSuggestions] = useState<MagicDeductionResponse | null>(null)
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const t = useTranslations('editor.chapter.magicDeduction')

  const handleGenerateSuggestions = async () => {
    if (!content.trim()) {
      alert(t('needContent'))
      return
    }
    
    setIsGeneratingSuggestions(true)
    try {
      const result = await generateMagic(novel, chapter, content)
      
      if (result.error) {
        alert(t('generateError', { error: result.error }))
        return
      }
      
      setSuggestions(result)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      alert(t('unexpectedError'))
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const handleAcceptSuggestion = async (
    suggestionId: string, 
    type: 'character' | 'event' | 'relation', 
    data: CharacterSuggestion | EventSuggestion | RelationSuggestion
  ) => {
    try {
      let result
      switch (type) {
        case 'character':
          result = await acceptCharacterSuggestion(novel.id, chapter.id, data as CharacterSuggestion)
          break
        case 'event':
          result = await acceptEventSuggestion(novel.id, chapter.id, data as EventSuggestion)
          break
        case 'relation':
          result = await acceptRelationSuggestion(novel.id, chapter.id, data as RelationSuggestion)
          break
      }
      
      if (!result.success) {
        alert(t('acceptError', { error: result.error }))
      } else {
        // Mostrar mensaje de éxito y potencialmente refrescar datos
        console.log(`${type} suggestion accepted successfully`)
      }
    } catch (error) {
      console.error('Error accepting suggestion:', error)
      alert(t('acceptUnexpectedError'))
    }
  }

  const handleRejectSuggestion = (_suggestionId: string, type: 'character' | 'event' | 'relation') => {
    // Las sugerencias rechazadas simplemente se ocultan en la UI
    console.log(`Rejected ${type} suggestion`)
  }

  const handleEditSuggestion = (_suggestionId: string, type: 'character' | 'event' | 'relation', editedData: any) => {
    // TODO: Implementar edición de sugerencias
    console.log(`Edit ${type} suggestion:`, editedData)
  }

  // Auto-generar sugerencias al abrir el modal si no hay contenido previo
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (open && !suggestions && content.trim()) {
      handleGenerateSuggestions()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {t('title')}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSuggestions}
                disabled={isGeneratingSuggestions || !content.trim()}
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    {t('generating')}
                  </>
                ) : (
                  t('regenerate')
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" size="sm">{t('close')}</Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-6 py-4">
          {isGeneratingSuggestions ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t('analyzing')}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('consideringContext', { 
                    characters: novel.characters?.length || 0,
                    events: novel.events?.length || 0
                  })}
                </p>
              </div>
            </div>
          ) : suggestions ? (
            <MagicSuggestions
              suggestions={suggestions}
              onAcceptSuggestion={handleAcceptSuggestion}
              onRejectSuggestion={handleRejectSuggestion}
              onEditSuggestion={handleEditSuggestion}
            />
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                {content.trim() ? (
                  <p>{t('clickToGenerate')}</p>
                ) : (
                  <p>{t('noContentMessage')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}