import { useAutosave } from "@/hooks/use-autosave"
import { ChapterData, AutosaveState } from "@/types/chapter"
import { useState, useCallback } from "react"

type ChapterEditorAutosaveProps = {
  chapterData: ChapterData
  chapterId: string
}

export type CombinedAutosaveState = {
  content: AutosaveState & { hasUnsavedChanges: boolean }
  title: AutosaveState & { hasUnsavedChanges: boolean }
  summary: AutosaveState & { hasUnsavedChanges: boolean }
  overall: {
    status: 'idle' | 'saving' | 'saved' | 'error'
    lastSaved?: Date
    hasUnsavedChanges: boolean
  }
}

export default function useChapterEditorAutosave({ 
  chapterData, 
  chapterId 
}: ChapterEditorAutosaveProps): CombinedAutosaveState {
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)

  const handleSaved = useCallback((field: string) => {
    const now = new Date()
    setLastSavedTime(now)
    console.log(`${field} autosaved successfully at`, now.toLocaleTimeString())
  }, [])

  const handleError = useCallback((field: string, error: Error) => {
    console.error(`Error saving ${field}:`, error.message)
  }, [])

  const contentState = useAutosave({
    field: 'content',
    value: chapterData.content,
    chapterId: chapterId,
    onSaved: () => handleSaved('content'),
    onError: (error) => handleError('content', error)
  })

  const titleState = useAutosave({
    field: 'title',
    value: chapterData.title,
    chapterId: chapterId,
    onSaved: () => handleSaved('title'),
    onError: (error) => handleError('title', error)
  })

  const summaryState = useAutosave({
    field: 'summary',
    value: chapterData.summary,
    chapterId: chapterId,
    onSaved: () => handleSaved('summary'),
    onError: (error) => handleError('summary', error)
  })

  // Calculate overall state
  const states = [contentState, titleState, summaryState]
  const hasAnyError = states.some(state => state.status === 'error')
  const hasAnySaving = states.some(state => state.status === 'saving')
  const hasAnyUnsaved = states.some(state => state.hasUnsavedChanges)

  const overallStatus = hasAnyError 
    ? 'error' 
    : hasAnySaving 
    ? 'saving' 
    : hasAnyUnsaved 
    ? 'idle'
    : 'saved'

  return {
    content: contentState,
    title: titleState,
    summary: summaryState,
    overall: {
      status: overallStatus,
      lastSaved: lastSavedTime || undefined,
      hasUnsavedChanges: hasAnyUnsaved
    }
  }
}