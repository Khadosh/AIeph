'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, BookOpen, Calendar, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { genres } from '@/constants/genres'
import { useStatusTranslation } from '@/lib/status-utils'

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
  
  const t = useTranslations('app.dashboard.novels')
  const { getStatusLabel, getStatusColor } = useStatusTranslation()
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
          <h1 className="text-3xl font-bold text-gray-900">{t('list.title')}</h1>
          <p className="text-gray-600 mt-2">{t('list.subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('list.createButton')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createForm.title')}</DialogTitle>
              <DialogDescription>
                {t('createForm.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('createForm.form.title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('createForm.form.titlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="genre">{t('createForm.form.genre')}</Label>
                <Autocomplete
                  options={genreOptions}
                  placeholder={t('createForm.form.genrePlaceholder')}
                  emptyMessage={t('createForm.form.genreEmptyMessage')}
                  value={formData.genre ? [{ value: formData.genre, label: formData.genre }] : []}
                  onValueChange={(selected) => setFormData({ ...formData, genre: selected[0]?.value || '' })}
                  maxItems={1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">{t('createForm.form.description')}</Label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('createForm.form.descriptionPlaceholder')}
                  rows={3}
                  className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('createForm.form.cancel')}
              </Button>
              <Button onClick={handleCreateNovel} disabled={!formData.title}>
                {t('createForm.form.submit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {novels.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('list.empty.title')}</h3>
            <p className="text-gray-600 mb-4">{t('list.empty.description')}</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('list.empty.action')}
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
                      {novel.description || t('list.noDescription')}
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
                      <span className="font-medium">{t('list.genreLabel')}</span>
                      <span>{novel.genre}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{t('list.createdLabel')} {formatDate(novel.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status || 'draft')}`}>
                      {getStatusLabel(novel.status || 'draft')}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/creator/novel/${novel.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t('list.viewChapters')}
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
            <DialogTitle>{t('actions.deleteNovel')}</DialogTitle>
            <DialogDescription>
              {t('actions.deleteConfirmation', { title: `"${selectedNovel?.title}"` })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('createForm.form.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteNovel}>
              {t('actions.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
