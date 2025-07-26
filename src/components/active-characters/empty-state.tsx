import { UserPlus2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function EmptyState() {
  const t = useTranslations('editor.chapter.activeCharacters')

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="font-semibold text-lg mb-2 flex items-center gap-2">
        <UserPlus2 className="h-5 w-5 text-primary" />
        {t('title')}
      </div>
      <p className="text-sm text-gray-500">
        {t('noCharacters')}
      </p>
    </div>
  )
} 