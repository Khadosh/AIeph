import { User } from 'lucide-react'

interface CharacterAvatarProps {
  isActive: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CharacterAvatar({ isActive, size = 'md' }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 ${
      isActive 
        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
        : 'bg-gradient-to-br from-gray-400 to-gray-500'
    }`}>
      <User className={`${iconSizes[size]} text-white`} />
    </div>
  )
} 