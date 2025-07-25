export interface CharacterSuggestion {
  id: string
  name: string
  description: string
  context: string
  confidence: number
  isNew: boolean
  existingCharacterId?: string
}

export interface EventSuggestion {
  id: string
  title: string
  description: string
  context: string
  confidence: number
  involvedCharacters: string[]
  date?: string
}

export interface RelationSuggestion {
  id: string
  characterAId: string
  characterBId: string
  characterAName: string
  characterBName: string
  type: string
  description: string
  context: string
  confidence: number
}

export interface MagicDeductionResponse {
  personajes: CharacterSuggestion[]
  eventos: EventSuggestion[]
  relaciones: RelationSuggestion[]
}

export interface SuggestionStatus {
  id: string
  status: 'pending' | 'accepted' | 'rejected' | 'removing'
  editedData?: any
}