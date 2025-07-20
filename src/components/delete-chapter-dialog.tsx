'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteChapter } from '@/actions/chapter'
import { useTranslations } from 'next-intl'

interface DeleteChapterDialogProps {
  chapterId: string
  novelId: string
  chapterTitle: string
  onSuccess?: () => void
}

export function DeleteChapterDialog({ 
  chapterId, 
  novelId, 
  chapterTitle, 
  onSuccess 
}: DeleteChapterDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const t = useTranslations('app.dashboard.novels.pages.detail.chaptersSection.delete')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteChapter(chapterId, novelId)
      if (result?.success) {
        setIsOpen(false)
        onSuccess?.()
      } else {
        console.error('Failed to delete chapter:', result?.error)
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('dialog.description', { title: chapterTitle })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              {t('dialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : t('dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 