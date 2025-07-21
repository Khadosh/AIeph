import { useEffect, useRef, useTransition } from 'react'
import { diff_match_patch } from 'diff-match-patch'
import { autosaveChapterPatch } from '@/actions/chapter'

export function useAutosave({
  content,
  savedContent,
  chapterId,
  onSaved,
  debounceMs = 1500,
}: {
  content: string
  savedContent: string
  chapterId: string | number
  onSaved?: (newContent: string) => void
  debounceMs?: number
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPatchRef = useRef<string>("")
  const dmp = useRef(new diff_match_patch())
  const [, startTransition] = useTransition ? useTransition() : [null, (fn: any) => fn()]

  useEffect(() => {
    if (content === savedContent) return
    if (!chapterId) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const diff = dmp.current.diff_main(savedContent, content)
      dmp.current.diff_cleanupSemantic(diff)
      const patch = dmp.current.patch_make(savedContent, content, diff)
      const patchText = dmp.current.patch_toText(patch)
      if (!patchText || patchText === lastPatchRef.current) return;
      lastPatchRef.current = patchText

      startTransition(() => {
        autosaveChapterPatch({
          chapterId: String(chapterId),
          patch: patchText,
        }).then((data) => {
          if (data?.success) {
            onSaved?.(content)
          } else {
          }
        }).catch(() => {
        })
      })
    }, debounceMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, chapterId])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content !== savedContent) {
        // Guardado síncrono: idealmente deberías usar una llamada RPC o endpoint especial
        // pero las server actions no pueden llamarse fuera del ciclo React, así que aquí solo advertimos
        // Alternativamente, podrías usar un endpoint API tradicional solo para este caso extremo
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, savedContent, chapterId])
} 