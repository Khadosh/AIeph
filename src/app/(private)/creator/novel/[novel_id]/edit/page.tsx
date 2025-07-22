'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { genres } from '@/constants/genres'
import { createClient } from '@/utils/supabase/client'
import type { Tables, TablesUpdate } from '@/types/supabase'

type Novel = Tables<'novels'>
type NovelUpdate = TablesUpdate<'novels'>

export default function EditNovelPage() {
  const [novel, setNovel] = useState<Novel | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<NovelUpdate>>({
    title: '',
    description: '',
    genre: '',
    status: 'draft'
  })
  
  const genreOptions = genres.map(genre => ({ value: genre, label: genre }))
  
  const router = useRouter()
  const params = useParams()
  const novelId = params.novel_id as string
  const supabase = createClient()

  const fetchNovel = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .eq('id', novelId)
        .single()

      if (error) throw error
      
      setNovel(data)
      setFormData({
        title: data.title,
        description: data.description,
        genre: data.genre,
        status: data.status
      })
    } catch (error) {
      console.error('Error fetching novel:', error)
      router.push('/creator/novel')
    } finally {
      setLoading(false)
    }
  }, [novelId, supabase, router])

  useEffect(() => {
    if (novelId) {
      fetchNovel()
    }
  }, [novelId, fetchNovel])

  const handleSave = async () => {
    if (!novel) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('novels')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', novel.id)

      if (error) throw error
      
      router.push('/creator/novel')
    } catch (error) {
      console.error('Error updating novel:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!novel) return

    try {
      const { error } = await supabase
        .from('novels')
        .delete()
        .eq('id', novel.id)

      if (error) throw error
      
      router.push('/creator/novel')
    } catch (error) {
      console.error('Error deleting novel:', error)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Novela no encontrada</h1>
          <Button onClick={() => router.push('/creator/novel')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Novelas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/creator/novel')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Novela</h1>
            <p className="text-gray-600 mt-1">Modifica los detalles de tu novela</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Novela</CardTitle>
            <CardDescription>
              Actualiza los detalles de tu proyecto de escritura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ingresa el título de tu novela"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="genre">Género</Label>
              <Autocomplete
                options={genreOptions}
                placeholder="Selecciona un género..."
                emptyMessage="No se encontraron géneros"
                value={formData.genre ? [{ value: formData.genre, label: formData.genre }] : []}
                onValueChange={(selected) => setFormData({ ...formData, genre: selected[0]?.value || '' })}
                maxItems={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe brevemente tu historia..."
                rows={4}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={formData.status || 'draft'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                disabled={!formData.title || saving}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Novela
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
