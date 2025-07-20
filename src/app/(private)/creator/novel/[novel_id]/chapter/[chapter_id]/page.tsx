'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, BookOpen, Calendar, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import type { Database, Tables } from '@/types/supabase'

type Novel = Tables<'novels'>
type Chapter = Tables<'chapters'>

export default function ChapterViewPage() {
  const [novel, setNovel] = useState<Novel | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const params = useParams()
  const novelId = params.novel_id as string
  const chapterId = params.chapter_id as string
  const supabase = createClient()

  useEffect(() => {
    if (novelId && chapterId) {
      fetchNovelAndChapter()
    }
  }, [novelId, chapterId])

  const fetchNovelAndChapter = async () => {
    try {
      // Fetch novel
      const { data: novelData, error: novelError } = await supabase
        .from('novels')
        .select('*')
        .eq('id', novelId)
        .single()

      if (novelError) throw novelError
      setNovel(novelData)

      // Fetch chapter
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single()

      if (chapterError) throw chapterError
      setChapter(chapterData)
    } catch (error) {
      console.error('Error fetching novel and chapter:', error)
      router.push(`/creator/novel/${novelId}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'needs_review':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'completed':
        return 'Completado'
      case 'in_progress':
        return 'En Progreso'
      case 'draft':
        return 'Borrador'
      case 'needs_review':
        return 'Necesita Revisión'
      default:
        return 'Borrador'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!novel || !chapter) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Capítulo no encontrado</h1>
          <Button onClick={() => router.push(`/creator/novel/${novelId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Novela
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/creator/novel/${novelId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Capítulo {chapter.order_index}: {chapter.title}
              </h1>
              <p className="text-gray-600 mt-1">{novel.title}</p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/creator/novel/${novelId}/chapter/${chapterId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Capítulo
          </Button>
        </div>

        {/* Chapter Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Palabras</p>
                  <p className="text-2xl font-bold">{chapter.word_count?.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Tiempo de Lectura</p>
                  <p className="text-2xl font-bold">{chapter.reading_time_minutes || 0} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Última Edición</p>
                  <p className="text-sm font-medium">
                    {chapter.last_edited_at ? formatDate(chapter.last_edited_at) : 'Nunca'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                    {getStatusText(chapter.status)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chapter Content */}
        <div className="space-y-6">
          {chapter.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{chapter.summary}</p>
              </CardContent>
            </Card>
          )}

          {chapter.author_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas del Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{chapter.author_notes}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 