import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ChapterEditor from '@/components/chapter-editor/chapter-editor'

interface EditChapterPageProps {
  params: {
    novel_id: string
    chapter_id: string
  }
}

export default async function EditChapterPage({ params }: EditChapterPageProps) {
  const supabase = await createClient()
  
  // Fetch novel and chapter data
  const [novelResult, chapterResult] = await Promise.all([
    supabase
      .from('novels')
      .select('*')
      .eq('id', params.novel_id)
      .single(),
    supabase
      .from('chapters')
      .select('*')
      .eq('id', params.chapter_id)
      .single()
  ])

  if (novelResult.error || !novelResult.data) {
    notFound()
  }

  if (chapterResult.error || !chapterResult.data) {
    notFound()
  }

  return (
    <ChapterEditor 
      mode="edit" 
      novel={novelResult.data} 
      chapter={chapterResult.data} 
    />
  )
}
