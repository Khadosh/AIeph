import { Suspense } from 'react'
import { fetchLatestNovels } from '@/lib/data'
import CreatorContent from './creator-content'

// Server Component for fetching data
async function CreatorData() {
  const { data: recentNovels, error } = await fetchLatestNovels(3)
  
  if (error) {
    console.error('Error fetching recent novels:', error)
  }

  return <CreatorContent recentNovels={recentNovels || []} />
}

// Main Server Component
export default function CreatorPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <CreatorData />
    </Suspense>
  )
}