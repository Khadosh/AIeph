import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const t = useTranslations('editor.chapter.activeCharacters')

  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-9 text-sm"
        />
      </div>
    </div>
  )
} 