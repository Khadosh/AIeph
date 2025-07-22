import { Suspense } from 'react'
import { fetchNovel } from '@/lib/data'
import NovelEditPageContent from './novel-edit-page-content'

// Server Component for fetching data
async function NovelEditData({ novelId }: { novelId: string }) {
  const { data: novel, error } = await fetchNovel(novelId)
  
  if (error) {
    console.error('Error fetching recent novels:', error)
  }

  return <NovelEditPageContent novel={novel || []} />
}

// Main Server Component
export default async function NovelEditPage({ params }: { params: { novel_id: string } }) {
  const { novel_id } = await params
  
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <NovelEditData novelId={novel_id} />
    </Suspense>
  )
}