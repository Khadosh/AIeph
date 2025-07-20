import { useTranslations } from 'next-intl'

export type NovelStatus = 'draft' | 'published' | 'archived' | 'completed' | 'inProgress'
export type ChapterStatus = 'draft' | 'published' | 'needs_review' | 'in_progress'

export const useStatusTranslation = () => {
  const t = useTranslations('app.dashboard.novels.createForm.form.statusOptions')
  
  return {
    getStatusLabel: (status: NovelStatus | ChapterStatus | string) => {
      switch (status) {
        case 'draft':
          return t('draft')
        case 'published':
          return t('published')
        case 'archived':
          return t('archived')
        case 'completed':
          return t('completed')
        case 'inProgress':
        case 'in_progress':
          return t('inProgress')
        case 'needs_review':
          return t('needsReview')
        default:
          return t('draft') // fallback
      }
    },
    
    getStatusColor: (status: NovelStatus | ChapterStatus | string) => {
      switch (status) {
        case 'draft':
          return 'bg-gray-100 text-gray-800'
        case 'published':
          return 'bg-green-100 text-green-800'
        case 'archived':
          return 'bg-orange-100 text-orange-800'
        case 'completed':
          return 'bg-blue-100 text-blue-800'
        case 'inProgress':
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800'
        case 'needs_review':
          return 'bg-orange-100 text-orange-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
  }
}

// Static version for server components
export const getStatusColor = (status: NovelStatus | ChapterStatus | string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'archived':
      return 'bg-orange-100 text-orange-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'inProgress':
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'needs_review':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}