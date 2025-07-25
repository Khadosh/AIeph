'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Brain } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextEditor } from '@/components/text-editor/text-editor'
import Suggestions from '@/components/suggestions'
import type { Tables } from '@/types/supabase'
import Summary from '@/components/summary'
import useChapterEditorAutosave from '../../hooks/use-chapter-editor-autosave'
import { useSaveMetadata } from '@/hooks/use-save-metadata'
import { SaveStatus } from '@/components/ui/save-status'
import { ChapterData } from '@/types/chapter'
import { NovelWithAll, NovelWithChapters } from '@/types/novel'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { UserPlus2 } from 'lucide-react'

type Chapter = Tables<'chapters'>

interface ChapterEditorProps {
  novel: NovelWithAll
  chapter: Chapter
}

export default function ChapterEditor({ novel, chapter }: ChapterEditorProps) {
  const [chapterData, setChapterData] = useState<ChapterData>({
    title: chapter?.title || "",
    content: chapter?.content || "",
    authorNotes: chapter?.author_notes || "",
    summary: chapter?.summary || "",
  })
  const router = useRouter()
  const t = useTranslations('editor.chapter')
  const [showMagicModal, setShowMagicModal] = useState(false)

  // Helper function to update any field
  const updateField = (field: keyof ChapterData, value: string) => {
    setChapterData(prev => ({ ...prev, [field]: value }))
  }

  // Autosave for individual fields with improved state management
  const autosaveState = useChapterEditorAutosave({
    chapterData: chapterData,
    chapterId: chapter.id,
  })

  // Save metadata when leaving the page
  useSaveMetadata({
    chapterId: chapter.id,
    content: chapterData.content,
    summary: chapterData.summary,
    title: chapterData.title,
    authorNotes: chapterData.authorNotes,
  })

  return (
    <div className="w-full h-[calc(100vh-54px)] flex flex-col overflow-hidden">
      {/* Header with title input */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            onClick={() => router.push(`/creator/novel/${novel.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <div className="flex-1 max-w-md">
            <Input
              value={chapterData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="!text-3xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
            />
          </div>
          <div className="text-sm text-gray-600">
            {novel.title}
            {chapter && ` - ${t('chapterNumber', { index: chapter.order_index })}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowMagicModal(true)}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Deducción Mágica
          </Button>
          <SaveStatus saveState={autosaveState.overall} />
        </div>
      </div>

      {/* Magic Deduction Modal */}
      <Dialog open={showMagicModal} onOpenChange={setShowMagicModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deducción Mágica</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Aquí aparecerán las sugerencias de personajes, eventos y relaciones deducidas por la IA.</p>
            {/* Placeholder de sugerencias */}
            <div className="bg-gray-100 rounded p-4 text-sm text-gray-500">(Sin sugerencias aún)</div>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button variant="secondary">Cerrar</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content with proper scrolling */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Summary and Notes */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          <Summary
            novel={novel as NovelWithChapters}
            chapter={chapter}
            content={chapterData.content}
            onChange={(summary) => updateField('summary', summary)}
            summary={chapterData.summary}
          />
          <div className="p-4 flex-1">
            <Label className="text-sm font-medium mb-3 block">{t('notesLabel')}</Label>
            <textarea
              value={chapterData.authorNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('authorNotes', e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="w-full h-32 resize-none rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>
        {/* Center - Text Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <TextEditor
              content={chapterData.content}
              onChange={(content) => updateField('content', content)}
            />
          </div>
        </div>
        {/* Right Panel - Active Characters */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="font-semibold text-lg mb-2 flex items-center gap-2">
              <UserPlus2 className="h-5 w-5 text-primary" />
              Personajes activos
            </div>
            {/* Placeholder de personajes activos */}
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Juan (protagonista)</li>
              <li>María (antagonista)</li>
              <li>El sabio anciano</li>
            </ul>
          </div>
          {/* Panel de sugerencias IA (puede quedar para feedback/ayuda) */}
          <div className="flex-1 overflow-y-auto">
            <Suggestions content={chapterData.content} />
          </div>
        </div>
      </div>
    </div>
  )
} 