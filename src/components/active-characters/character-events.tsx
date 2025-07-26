import { Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tables } from '@/types/supabase'

interface CharacterEventsProps {
  events: Tables<'events'>[]
}

export function CharacterEvents({ events }: CharacterEventsProps) {
  const t = useTranslations('editor.chapter.activeCharacters')

  if (events.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-blue-100 rounded">
          <Calendar className="h-3 w-3 text-blue-600" />
        </div>
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {t('currentChapterEvents')}
        </span>
      </div>
      <div className="space-y-1.5">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-md">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
            <span className="truncate">{event.title}</span>
            {event.summary && (
              <span className="text-xs text-gray-500 ml-1">• {event.summary}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 