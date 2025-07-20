'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { genres } from '@/constants/genres'
import { createClient } from '@/utils/supabase/client'
import type { Database, TablesInsert } from '@/types/supabase'

type NovelInsert = TablesInsert<'novels'>

export default function NewNovelPage() {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<NovelInsert>>({
    title: '',
    description: '',
    genre: '',
    status: 'draft'
  })
  
  const t = useTranslations('app.dashboard.novels')
  const genreOptions = genres.map(genre => ({ value: genre, label: genre }))
  
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    if (!formData.title) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('novels')
        .insert([formData])
        .select()
        .single()

      if (error) throw error
      
      router.push('/creator/novel')
    } catch (error) {
      console.error('Error creating novel:', error)
    } finally {
      setSaving(false)
    }
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
            {t('actions.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('pages.new.title')}</h1>
            <p className="text-gray-600 mt-1">{t('pages.new.subtitle')}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('pages.new.cardTitle')}</CardTitle>
            <CardDescription>
              {t('pages.new.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">{t('createForm.form.titleRequired')}</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('createForm.form.titlePlaceholder')}
                className="mt-1"
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
                rows={4}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="status">{t('createForm.form.status')}</Label>
              <select
                id="status"
                value={formData.status || 'draft'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="draft">{t('createForm.form.statusOptions.draft')}</option>
                <option value="published">{t('createForm.form.statusOptions.published')}</option>
                <option value="archived">{t('createForm.form.statusOptions.archived')}</option>
              </select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={!formData.title || saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? t('createForm.form.submitting') : t('createForm.form.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 