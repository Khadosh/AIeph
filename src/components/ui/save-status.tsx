import { useState, useEffect, useRef } from 'react'
import { CombinedAutosaveState } from '@/hooks/use-chapter-editor-autosave'
import { Loader, CloudUpload, RefreshCwOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SaveStatusProps {
  saveState: CombinedAutosaveState['overall']
  className?: string
}

export function SaveStatus({ saveState, className = '' }: SaveStatusProps) {
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('editor.chapter')

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    switch (saveState.status) {
      case 'saving':
        setVisible(true)
        break
        
      case 'saved':
        setVisible(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(false)
        }, 2000) 
        break
        
      case 'error':
        setVisible(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(false)
        }, 4000)
        break
        
      case 'idle':
      default:
        setVisible(saveState.hasUnsavedChanges)
        break
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [saveState.status, saveState.lastSaved, saveState.hasUnsavedChanges])

  if (!visible || (saveState.status === 'idle' && !saveState.hasUnsavedChanges)) {
    return null
  }

  const baseClasses = `flex items-center text-xs text-gray-500 ${className}`

  switch (saveState.status) {
    case 'saving':
      return (
        <div className={baseClasses}>
          <Loader className="w-3 h-3 mr-1 animate-spin" />
          {t('autosave.saving')}
        </div>
      )

    case 'saved':
      return (
        <div className={baseClasses}>
          <CloudUpload className="w-3 h-3 mr-1" />
          {t('autosave.saved')}
        </div>
      )

    case 'error':
      return (
        <div className={`flex items-center text-xs text-red-500 ${className}`}>
          <RefreshCwOff className="w-3 h-3 mr-1" />
          {t('autosave.error')}
        </div>
      )

    case 'idle':
    default:
      return null
  }
}