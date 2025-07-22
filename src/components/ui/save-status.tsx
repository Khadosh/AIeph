import { useState, useEffect } from 'react'
import { CombinedAutosaveState } from '@/hooks/use-chapter-editor-autosave'
import { Loader, CloudUpload, RefreshCwOff } from 'lucide-react';


interface SaveStatusProps {
  saveState: CombinedAutosaveState['overall']
  className?: string
}

export function SaveStatus({ saveState, className = '' }: SaveStatusProps) {
  const [visible, setVisible] = useState(true)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    // Declare timeout variable outside switch to avoid scope issues
    let newTimeoutId: NodeJS.Timeout | null = null

    switch (saveState.status) {
      case 'saving':
        setVisible(true)
        break
        
      case 'saved':
        setVisible(true)
        newTimeoutId = setTimeout(() => {
          setVisible(false)
        }, 2000) 
        setTimeoutId(newTimeoutId)
        break
        
      case 'error':
        setVisible(true)
        newTimeoutId = setTimeout(() => {
          setVisible(false)
        }, 4000)
        setTimeoutId(newTimeoutId)
        break
        
      case 'idle':
      default:
        setVisible(saveState.hasUnsavedChanges)
        break
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [saveState.status, saveState.lastSaved, saveState.hasUnsavedChanges, timeoutId])

  if (!visible || (saveState.status === 'idle' && !saveState.hasUnsavedChanges)) {
    return null
  }

  const baseClasses = `flex items-center text-xs text-gray-500 ${className}`

  switch (saveState.status) {
    case 'saving':
      return (
        <div className={baseClasses}>
          <Loader className="w-3 h-3 mr-1 animate-spin" />
          Guardando...
        </div>
      )

    case 'saved':
      return (
        <div className={baseClasses}>
          <CloudUpload className="w-3 h-3 mr-1" />
          Guardado
        </div>
      )

    case 'error':
      return (
        <div className={`flex items-center text-xs text-red-500 ${className}`}>
          <RefreshCwOff className="w-3 h-3 mr-1" />
          Error al guardar
        </div>
      )

    case 'idle':
    default:
      return null
  }
}