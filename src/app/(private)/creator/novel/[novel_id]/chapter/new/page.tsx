import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ChapterEditor from '@/components/chapter-editor/chapter-editor'

interface NewChapterPageProps {
  params: {
    novel_id: string
  }
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const supabase = await createClient()
  
  // Fetch novel data
  const { data: novel, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', params.novel_id)
    .single()

  if (error || !novel) {
    notFound()
  }

  return <ChapterEditor mode="create" novel={novel} />
} 