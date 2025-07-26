import { Badge } from "@/components/ui/badge"
import { useTranslations } from 'next-intl'

interface CharacterBadgeProps {
  variant?: "secondary" | "default" | "destructive" | "outline"
  className?: string
  children: React.ReactNode
}

export function CharacterBadge({ variant = "secondary", className = "", children }: CharacterBadgeProps) {
  return (
    <Badge variant={variant} className={`text-xs px-1.5 py-0.5 ${className}`}>
      {children}
    </Badge>
  )
}

interface DetectionMethodBadgeProps {
  method: 'event' | 'text' | 'both' | 'none'
}

export function DetectionMethodBadge({ method }: DetectionMethodBadgeProps) {
  const t = useTranslations('editor.chapter.activeCharacters.detectionMethods')

  const getBadgeConfig = () => {
    switch (method) {
      case 'text':
        return {
          className: "bg-green-50 text-green-700 border-green-200",
          text: t('mentioned')
        }
      case 'both':
        return {
          className: "bg-orange-50 text-orange-700 border-orange-200",
          text: t('eventAndText')
        }
      case 'event':
        return {
          className: "bg-blue-50 text-blue-700 border-blue-200",
          text: t('event')
        }
      default:
        return {
          className: "bg-gray-50 text-gray-500 border-gray-200",
          text: t('inactive')
        }
    }
  }

  const config = getBadgeConfig()

  return (
    <CharacterBadge className={config.className}>
      {config.text}
    </CharacterBadge>
  )
} 