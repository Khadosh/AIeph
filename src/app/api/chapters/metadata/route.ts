import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { chapterId, wordCount, readingTime, summary, title, authorNotes } = body

    // Validate required fields
    if (!chapterId || typeof chapterId !== 'string') {
      console.warn('Invalid chapter ID in metadata request:', chapterId)
      return Response.json(
        { success: false, error: 'Chapter ID is required' },
        { status: 400 }
      )
    }

    // Validate chapterId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(chapterId)) {
      console.warn('Invalid chapter ID format:', chapterId)
      return Response.json(
        { success: false, error: 'Invalid chapter ID format' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (typeof wordCount !== 'number' || wordCount < 0) {
      console.warn('Invalid word count:', wordCount)
      return Response.json(
        { success: false, error: 'Invalid word count' },
        { status: 400 }
      )
    }

    if (typeof readingTime !== 'number' || readingTime < 0) {
      console.warn('Invalid reading time:', readingTime)
      return Response.json(
        { success: false, error: 'Invalid reading time' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Check if chapter exists first
    const { data: existingChapter, error: fetchError } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', chapterId)
      .single()

    if (fetchError || !existingChapter) {
      console.error('Chapter not found for metadata update:', chapterId, fetchError)
      return Response.json(
        { success: false, error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Update metadata with atomic timestamp
    const now = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('chapters')
      .update({
        word_count: wordCount,
        reading_time_minutes: readingTime,
        summary: summary?.trim() || null,
        title: title?.trim() || '',
        author_notes: authorNotes?.trim() || null,
        last_edited_at: now
      })
      .eq('id', chapterId)

    if (updateError) {
      console.error('Database update error for metadata:', updateError)
      return Response.json(
        { success: false, error: 'Failed to update chapter metadata' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime
    console.log(`Metadata saved successfully for chapter ${chapterId} in ${duration}ms`)

    return Response.json({ 
      success: true, 
      message: 'Metadata saved successfully',
      timestamp: now,
      duration
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error('API error in metadata endpoint:', error, `Duration: ${duration}ms`)
    return Response.json(
      { 
        success: false, 
        error: 'Internal server error',
        duration
      },
      { status: 500 }
    )
  }
}