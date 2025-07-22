import { fetchNovelWithChapter } from '@/lib/data'
import ChapterEditor from '@/components/chapter-editor/chapter-editor'

interface NewChapterPageProps {
  params: Promise<{
    novel_id: string
    chapter_id: string
  }>
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const { novel_id, chapter_id} = await params
  const { data: novel } = await fetchNovelWithChapter(novel_id, chapter_id)

  const chapter = novel?.chapters[0]

  return <ChapterEditor novel={novel} chapter={chapter} />
} 