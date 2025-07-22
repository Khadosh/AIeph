import { useEffect, useRef, useTransition, useState, useCallback } from 'react'
import { diff_match_patch } from 'diff-match-patch'
import { autosaveChapterPatch } from '@/actions/chapter'
import { ValidChapterField, AutosaveState } from '@/types/chapter'

type AutosaveProps = {
  field: ValidChapterField
  value: string
  chapterId: string
  onSaved?: (newContent: string) => void
  onError?: (error: Error) => void
  debounceMs?: number
  maxRetries?: number
}

export function useAutosave({
  field,
  value,
  chapterId,
  onSaved,
  onError,
  debounceMs = 1500,
  maxRetries = 3,
}: AutosaveProps) {
  const [state, setState] = useState<AutosaveState>({
    status: 'idle',
    retryCount: 0
  })
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPatchRef = useRef<string>("")
  const savedContentRef = useRef<string>(value)
  const valueRef = useRef(value)
  const dmp = useRef(new diff_match_patch())
  const [, startTransition] = useTransition()

  // Update valueRef when value changes
  valueRef.current = value

  const saveWithRetry = useCallback(async (patchText: string, attempt = 1) => {
    try {
      setState(prev => ({ ...prev, status: 'saving' }))
      
      const result = await autosaveChapterPatch({
        chapterId,
        patch: patchText,
        field,
      })

      if (result?.success) {
        setState({
          status: 'saved',
          lastSaved: new Date(),
          retryCount: 0
        })
        savedContentRef.current = valueRef.current
        onSaved?.(valueRef.current)
      } else {
        throw new Error(result?.error || 'Error desconocido al guardar')
      }
    } catch (error) {
      console.error(`Autosave failed (attempt ${attempt}):`, error)
      
      if (attempt < maxRetries) {
        // Retry with exponential backoff
        setTimeout(() => {
          saveWithRetry(patchText, attempt + 1)
        }, Math.pow(2, attempt) * 1000)
        
        setState(prev => ({ 
          ...prev, 
          status: 'saving',
          retryCount: attempt
        }))
      } else {
        const finalError = error instanceof Error ? error : new Error('Unknown error')
        setState({
          status: 'error',
          error: finalError.message,
          retryCount: attempt
        })
        onError?.(finalError)
      }
    }
  }, [chapterId, field, onSaved, onError, maxRetries])

  useEffect(() => {
    if (valueRef.current === savedContentRef.current) return
    if (!chapterId) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const diff = dmp.current.diff_main(savedContentRef.current, valueRef.current)
      dmp.current.diff_cleanupSemantic(diff)
      const patch = dmp.current.patch_make(savedContentRef.current, valueRef.current, diff)
      const patchText = dmp.current.patch_toText(patch)
      
      if (!patchText || patchText === lastPatchRef.current) return
      
      // Validate patch on client side before sending
      try {
        const testPatchObj = dmp.current.patch_fromText(patchText)
        if (!testPatchObj || testPatchObj.length === 0) {
          console.warn('Invalid patch generated, skipping save')
          return
        }
      } catch (patchError) {
        console.warn('Patch validation failed, skipping save:', patchError)
        return
      }
      
      lastPatchRef.current = patchText

      startTransition(() => {
        saveWithRetry(patchText)
      })
    }, debounceMs)
  }, [value, chapterId, saveWithRetry, debounceMs, startTransition])

  // No more annoying beforeunload alert - metadata hook handles saving silently

  return {
    ...state,
    hasUnsavedChanges: valueRef.current !== savedContentRef.current
  }
} 