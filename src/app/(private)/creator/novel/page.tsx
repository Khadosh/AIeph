'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, BookOpen, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { genres } from '@/constants/genres'

import { createClient } from '@/utils/supabase/client'
import type { Database, Tables, TablesInsert } from '@/types/supabase'

type Novel = Tables<'novels'>
type NovelInsert = TablesInsert<'novels'>

export default function NovelListPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null)
  const [formData, setFormData] = useState<Partial<NovelInsert>>({
    title: '',
    description: '',
    genre: ''
  })
  
  const genreOptions = genres.map(genre => ({ value: genre, label: genre }))
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchNovels()
  }, [])

  const fetchNovels = async () => {
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNovels(data || [])
    } catch (error) {
      console.error('Error fetching novels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNovel = async () => {
    try {
      const { data, error } = await supabase
        .from('novels')
        .insert([formData])
        .select()
        .single()

      if (error) throw error
      
      setNovels([data, ...novels])
      setIsCreateDialogOpen(false)
      setFormData({ title: '', description: '', genre: '' })
    } catch (error) {
      console.error('Error creating novel:', error)
    }
  }

  const handleDeleteNovel = async () => {
    if (!selectedNovel) return

    try {
      const { error } = await supabase
        .from('novels')
        .delete()
        .eq('id', selectedNovel.id)

      if (error) throw error
      
      setNovels(novels.filter(novel => novel.id !== selectedNovel.id))
      setIsDeleteDialogOpen(false)
      setSelectedNovel(null)
    } catch (error) {
      console.error('Error deleting novel:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Novelas</h1>
          <p className="text-gray-600 mt-2">Gestiona tus proyectos de escritura</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Novela
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Novela</DialogTitle>
              <DialogDescription>
                Comienza un nuevo proyecto de escritura
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ingresa el título de tu novela"
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
                  maxItems={1}
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
                  rows={3}
                  className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                  </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNovel} disabled={!formData.title}>
                Crear Novela
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {novels.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes novelas aún</h3>
            <p className="text-gray-600 mb-4">Comienza creando tu primera novela</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Novela
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.map((novel) => (
            <Card key={novel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{novel.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {novel.description || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/creator/novel/${novel.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedNovel(novel)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {novel.genre && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Género:</span>
                      <span>{novel.genre}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Creada el {formatDate(novel.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status)}`}>
                      {novel.status || 'draft'}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/creator/novel/${novel.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Capítulos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Novela</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar "{selectedNovel?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteNovel}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
