import { Suspense } from 'react'
import { fetchNovelWithChapters } from '@/lib/data'
import NovelPageContent from './novel-page-content'

export default async function NovelDetailPage({ params }: { params: { novel_id: string } }) {
  const { data: novel, error } = await fetchNovelWithChapters(params.novel_id)

  if (error) {
    return <div>Error loading novel</div>
  }
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <NovelPageContent novel={novel} />
    </Suspense>
  )
}
