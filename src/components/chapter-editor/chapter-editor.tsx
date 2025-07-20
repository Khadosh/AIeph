'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextEditor } from '@/components/text-editor/text-editor'
import Suggestions from '@/components/suggestions'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import Resume from '../resume'

type Novel = Tables<'novels'>
type Chapter = Tables<'chapters'>
type ChapterInsert = TablesInsert<'chapters'>
type ChapterUpdate = TablesUpdate<'chapters'>

interface ChapterEditorProps {
  mode: 'create' | 'edit'
  novel: Novel
  chapter?: Chapter
  onSave?: () => void
}

export default function ChapterEditor({ mode, novel, chapter, onSave }: ChapterEditorProps) {
  const [content, setContent] = useState<string>(chapter?.content || "")
  const [title, setTitle] = useState<string>(chapter?.title || "")
  const [summary, setSummary] = useState<string>(chapter?.summary || "")
  const [authorNotes, setAuthorNotes] = useState<string>(chapter?.author_notes || "")
  const [saving, setSaving] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('editor.chapter')

  const getNextChapterOrder = async () => {
    try {
      // Get the highest order_index and add 1
      const { data, error } = await supabase
        .from('chapters')
        .select('order_index')
        .eq('novel_id', novel.id)
        .order('order_index', { ascending: false })
        .limit(1)

      if (error) throw error
      return data && data.length > 0 ? data[0].order_index + 1 : 1
    } catch (error) {
      console.error('Error getting next chapter order:', error)
      return 1
    }
  }

  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const calculateReadingTime = (wordCount: number) => {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return

    setSaving(true)
    try {
      const wordCount = calculateWordCount(content)
      const readingTime = calculateReadingTime(wordCount)

      if (mode === 'create') {
        const orderIndex = await getNextChapterOrder()

        const chapterData: ChapterInsert = {
          title: title.trim(),
          content: content,
          summary: summary.trim() || null,
          author_notes: authorNotes.trim() || null,
          novel_id: novel.id,
          order_index: orderIndex,
          word_count: wordCount,
          reading_time_minutes: readingTime,
          status: 'draft',
          last_edited_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('chapters')
          .insert([chapterData])
          .select()
          .single()

        if (error) throw error
      } else {
        if (!chapter) return

        const chapterData: ChapterUpdate = {
          title: title.trim(),
          content: content,
          summary: summary.trim() || null,
          author_notes: authorNotes.trim() || null,
          word_count: wordCount,
          reading_time_minutes: readingTime,
          last_edited_at: new Date().toISOString()
        }

        const { error } = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', chapter.id)

        if (error) throw error
      }

      onSave?.()
      router.push(`/creator/novel/${novel.id}`)
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} chapter:`, error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full h-[calc(100vh-52px)] flex flex-col overflow-hidden">
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
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="!text-3xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
            />
          </div>
          <div className="text-sm text-gray-600">
            {novel.title}
            {mode === 'edit' && chapter && ` - Capítulo ${chapter.order_index}`}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim() || saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? t('saving') : mode === 'create' ? t('create') : t('update')}
        </Button>
      </div>

      {/* Main content with proper scrolling */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Summary and Notes */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          <Resume content={content} />

          <div className="p-4 flex-1">
            <Label className="text-sm font-medium mb-3 block">{t('notesLabel')}</Label>
            <textarea
              value={authorNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAuthorNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="w-full h-32 resize-none rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>

        {/* Center - Text Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <TextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right Panel - AI Suggestions */}
        <div className="w-80 border-l border-gray-200">
          <Suggestions content={content} />
        </div>
      </div>
    </div>
  )
} 