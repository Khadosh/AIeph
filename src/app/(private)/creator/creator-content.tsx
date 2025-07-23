'use client'

import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  GraduationCap, 
  Globe, 
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import type { Tables } from '@/types/supabase'

type Chapter = Tables<'chapters'> 
type Novel = Tables<'novels'> & {
  chapters: Chapter[]
}

interface WritingType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badgeColor: string
  href: string
  stats?: {
    count: number
    label: string
  }
}

interface CreatorContentProps {
  recentNovels: Novel[]
}

export default function CreatorContent({ recentNovels }: CreatorContentProps) {
  const router = useRouter()
  const t = useTranslations('creator')

  const writingTypes: WritingType[] = [
    {
      id: 'novels',
      title: t('writingTypes.novels.title'),
      description: t('writingTypes.novels.description'),
      icon: BookOpen,
      color: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800',
      href: '/creator/novel',
      stats: {
        count: recentNovels.length,
        label: t('writingTypes.novels.statsLabel')
      }
    },
    {
      id: 'academic',
      title: t('writingTypes.academic.title'),
      description: t('writingTypes.academic.description'),
      icon: GraduationCap,
      color: 'bg-green-500',
      badgeColor: 'bg-green-100 text-green-800',
      href: '/creator/academic',
      stats: {
        count: 0,
        label: t('writingTypes.academic.statsLabel')
      }
    },
    {
      id: 'articles',
      title: t('writingTypes.articles.title'),
      description: t('writingTypes.articles.description'),
      icon: Globe,
      color: 'bg-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800',
      href: '/creator/articles',
      stats: {
        count: 0,
        label: t('writingTypes.articles.statsLabel')
      }
    },
    {
      id: 'creative',
      title: t('writingTypes.creative.title'),
      description: t('writingTypes.creative.description'),
      icon: PenTool,
      color: 'bg-orange-500',
      badgeColor: 'bg-orange-100 text-orange-800',
      href: '/creator/creative',
      stats: {
        count: 0,
        label: t('writingTypes.creative.statsLabel')
      }
    },
    {
      id: 'technical',
      title: t('writingTypes.technical.title'),
      description: t('writingTypes.technical.description'),
      icon: FileText,
      color: 'bg-gray-500',
      badgeColor: 'bg-gray-100 text-gray-800',
      href: '/creator/technical',
      stats: {
        count: 0,
        label: t('writingTypes.technical.statsLabel')
      }
    }
  ]

  const latestNovel = recentNovels[0]
  const latestChapter = latestNovel?.chapters?.sort((a, b) => new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime())[0]

  const quickActions = [
    {
      title: t('quickActions.newNovel'),
      description: t('quickActions.newNovelDesc'),
      icon: Plus,
      href: '/creator/novel/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: t('quickActions.continueWriting'),
      description: t('quickActions.continueWritingDesc'),
      icon: PenTool,
      href: recentNovels.length > 0 ? `/creator/novel/${latestNovel.id}/chapter/${latestChapter.id}` : '/creator/novel',
      color: 'bg-green-500 hover:bg-green-600',
      disabled: recentNovels.length === 0
    }
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('aiPowered')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => !action.disabled && router.push(action.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Writing Types Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('writingTypes.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writingTypes.map((type) => (
            <Card 
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => router.push(type.href)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${type.color} text-white`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  {type.stats && (
                    <Badge variant="secondary" className={type.badgeColor}>
                      {type.stats.count} {type.stats.label}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {t('writingTypes.features')}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentNovels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('recentActivity.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNovels.map((novel) => (
              <Card key={novel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {novel.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {novel.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      {novel.genre}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>0 {t('recentActivity.words')}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/creator/novel/${novel.id}`)}
                    >
                      {t('recentActivity.continue')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalNovels')}</p>
                <p className="text-2xl font-bold">{recentNovels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalChapters')}</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PenTool className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalWords')}</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('stats.readingTime')}</p>
                <p className="text-2xl font-bold">0h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 