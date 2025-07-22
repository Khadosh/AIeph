import { useEffect, useRef, useCallback } from 'react'

interface SaveMetadataProps {
  chapterId: string
  content: string
  summary: string
  title: string
  authorNotes: string
}

export function useSaveMetadata({
  chapterId,
  content,
  summary,
  title,
  authorNotes,
}: SaveMetadataProps) {
  const initialContent = useRef(content)
  const hasChanges = useRef(false)

  // Move calculation functions outside useEffect and memoize them
  const calculateWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])

  const calculateReadingTime = useCallback((wordCount: number) => {
    return Math.ceil(wordCount / 200)
  }, [])

  // Just track if content changed - don't calculate anything yet
  useEffect(() => {
    if (content !== initialContent.current) {
      hasChanges.current = true
    }
  }, [content])

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only calculate and send if there were changes
      if (hasChanges.current) {
        const wordCount = calculateWordCount(content)
        const readingTime = calculateReadingTime(wordCount)
        
        const data = {
          chapterId: String(chapterId),
          wordCount,
          readingTime,
          summary: summary.trim() || null,
          title: title.trim(),
          authorNotes: authorNotes.trim() || null,
        }
        
        try {
          const success = navigator.sendBeacon(
            '/api/chapters/metadata',
            JSON.stringify(data)
          )
          
          if (success) {
            hasChanges.current = false
          }
        } catch (error) {
          console.error('Error using sendBeacon:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [chapterId, content, summary, title, authorNotes, calculateWordCount, calculateReadingTime])
} 