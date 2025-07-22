// Safe types for chapter operations
export const VALID_CHAPTER_FIELDS = ['content', 'title', 'author_notes', 'summary'] as const
export type ValidChapterField = typeof VALID_CHAPTER_FIELDS[number]

// Type for chapter data used in editor
export interface ChapterData {
  title: string
  content: string
  authorNotes: string
  summary: string
}

// Type for autosave state
export interface AutosaveState {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date
  error?: string
  retryCount: number
}

// Type for save status UI
export type SaveStatus = 
  | { status: 'saved'; timestamp: Date }
  | { status: 'saving'; progress?: number }
  | { status: 'error'; message: string; canRetry: boolean }
  | { status: 'offline'; pendingChanges: number }
  | { status: 'idle' }

// Helper function to safely access chapter fields
export function getChapterFieldValue(data: Record<string, unknown>, field: ValidChapterField): string {
  if (!data || typeof data !== 'object') {
    return ''
  }
  
  const value = data[field]
  if (typeof value === 'string') {
    return value
  }
  
  // Handle case where value might be an object or other type
  if (value && typeof value === 'object') {
    return ''
  }
  
  return String(value || '')
}

// Validation functions
export function isValidChapterField(field: string): field is ValidChapterField {
  return VALID_CHAPTER_FIELDS.includes(field as ValidChapterField)
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}