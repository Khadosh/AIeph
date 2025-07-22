import { Suspense } from 'react'
import { fetchNovels } from '@/lib/data'
import NovelListContent from './novel-list-content'

// Server Component for fetching data
async function NovelListData() {
  const { data: novels, error } = await fetchNovels()
  
  if (error) {
    console.error('Error fetching novels:', error)
  }

  return <NovelListContent novels={novels || []} />
}

// Main Server Component
export default function NovelListPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <NovelListData />
    </Suspense>
  )
}
