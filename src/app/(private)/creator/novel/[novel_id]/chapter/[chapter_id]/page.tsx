import { fetchNovelWithAll } from '@/lib/data'
import ChapterEditor from '@/components/chapter-editor/chapter-editor'
import { Tables } from '@/types/supabase'

interface NewChapterPageProps {
  params: Promise<{
    novel_id: string
    chapter_id: string
  }>
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const { novel_id, chapter_id} = await params
  const { data: novel } = await fetchNovelWithAll(novel_id)

  const chapter = novel?.chapters.find((chapter: Tables<'chapters'>) => chapter.id === chapter_id)

  return <ChapterEditor novel={novel} chapter={chapter} />
} 