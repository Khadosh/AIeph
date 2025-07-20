'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Calendar, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import type { Database, Tables } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import { useStatusTranslation } from '@/lib/status-utils'

type Novel = Tables<'novels'>
type Chapter = Tables<'chapters'>

export default function NovelDetailPage() {
  const [novel, setNovel] = useState<Novel | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const params = useParams()
  const novelId = params.novel_id as string
  const supabase = createClient()
  const t = useTranslations('app.dashboard.novels.pages.detail')
  const { getStatusLabel, getStatusColor } = useStatusTranslation()

  useEffect(() => {
    if (novelId) {
      fetchNovelAndChapters()
    }
  }, [novelId])

  const fetchNovelAndChapters = async () => {
    try {
      // Fetch novel
      const { data: novelData, error: novelError } = await supabase
        .from('novels')
        .select('*')
        .eq('id', novelId)
        .single()

      if (novelError) throw novelError
      setNovel(novelData)

      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('novel_id', novelId)
        .order('order_index', { ascending: true })

      if (chaptersError) throw chaptersError
      setChapters(chaptersData || [])
    } catch (error) {
      console.error('Error fetching novel and chapters:', error)
      router.push('/creator/novel')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
          <Button onClick={() => router.push('/creator/novel')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToNovels')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/creator/novel')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{novel.title}</h1>
          <p className="text-gray-600 mt-1">{novel.description}</p>
        </div>
        <Button
          onClick={() => router.push(`/creator/novel/${novel.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {t('editNovel')}
        </Button>
      </div>

      {/* Novel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('stats.chapters')}</p>
                <p className="text-2xl font-bold">{chapters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalTime')}</p>
                <p className="text-2xl font-bold">
                  {chapters.reduce((total, chapter) => total + (chapter.reading_time_minutes || 0), 0)} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{t('stats.words')}</p>
                <p className="text-2xl font-bold">
                  {chapters.reduce((total, chapter) => total + (chapter.word_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">{t('stats.created')}</p>
                <p className="text-sm font-medium">{formatDate(novel.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapters Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('chaptersSection.title')}</h2>
        <Button
          onClick={() => router.push(`/creator/novel/${novel.id}/chapter/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('chaptersSection.newChapter')}
        </Button>
      </div>

      {chapters.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('chaptersSection.empty.title')}</h3>
            <p className="text-gray-600 mb-4">{t('chaptersSection.empty.description')}</p>
            <Button onClick={() => router.push(`/creator/novel/${novel.id}/chapter/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('chaptersSection.empty.action')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t('chaptersSection.chapterTitle', { index: chapter.order_index, title: chapter.title })}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status || 'draft')}`}>
                        {getStatusLabel(chapter.status || 'draft')}
                      </span>
                    </div>
                    {chapter.summary && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{chapter.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {chapter.word_count && (
                        <span>{t('chaptersSection.wordsCount', { count: chapter.word_count.toLocaleString() })}</span>
                      )}
                      {chapter.reading_time_minutes && (
                        <span>{t('chaptersSection.readingTime', { minutes: chapter.reading_time_minutes })}</span>
                      )}
                      {chapter.last_edited_at && (
                        <span>{t('chaptersSection.lastEdited', { date: formatDate(chapter.last_edited_at) })}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/creator/novel/${novel.id}/chapter/${chapter.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/creator/novel/${novel.id}/chapter/${chapter.id}`)}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
