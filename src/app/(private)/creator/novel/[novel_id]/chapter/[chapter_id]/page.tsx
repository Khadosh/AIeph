import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ChapterEditor from '@/components/chapter-editor/chapter-editor'

interface NewChapterPageProps {
  params: Promise<{
    novel_id: string
    chapter_id: string
  }>
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const { novel_id, chapter_id} = await params
  const supabase = await createClient()

  // Fetch novel data
  const { data: novel, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', novel_id)
    .single()

  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapter_id)
    .single()

  if (error || !novel || chapterError || !chapter) {
    notFound()
  }

  return <ChapterEditor novel={novel} chapter={chapter} />
} 