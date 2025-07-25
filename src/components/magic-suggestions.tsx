'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, Edit3, User, Calendar, Users } from 'lucide-react'
import { MagicDeductionResponse, SuggestionStatus } from '@/types/magic-deduction'

interface MagicSuggestionsProps {
  suggestions: MagicDeductionResponse
  onAcceptSuggestion: (id: string, type: 'character' | 'event' | 'relation', data: any) => void
  onRejectSuggestion: (id: string, type: 'character' | 'event' | 'relation') => void
  onEditSuggestion: (id: string, type: 'character' | 'event' | 'relation', editedData: any) => void
}

export default function MagicSuggestions({ 
  suggestions, 
  onAcceptSuggestion, 
  onRejectSuggestion,
  onEditSuggestion 
}: MagicSuggestionsProps) {
  const [suggestionStatus, setSuggestionStatus] = useState<Record<string, SuggestionStatus>>({})
  const tSuggestions = useTranslations('editor.chapter.suggestions')
  const tCharacters = useTranslations('editor.chapter.suggestions.characters')
  const tEvents = useTranslations('editor.chapter.suggestions.events')
  const tRelations = useTranslations('editor.chapter.suggestions.relations')
  
  const handleAccept = (id: string, type: 'character' | 'event' | 'relation', data: any) => {
    // Marcar como aceptado inmediatamente
    setSuggestionStatus(prev => ({ ...prev, [id]: { id, status: 'accepted' } }))
    onAcceptSuggestion(id, type, data)
    
    // Después de 800ms, remover completamente 
    setTimeout(() => {
      setSuggestionStatus(prev => {
        const newStatus = { ...prev }
        delete newStatus[id]
        return newStatus
      })
    }, 800)
  }

  const handleReject = (id: string, type: 'character' | 'event' | 'relation') => {
    // Marcar como rechazado inmediatamente
    setSuggestionStatus(prev => ({ ...prev, [id]: { id, status: 'rejected' } }))
    onRejectSuggestion(id, type)
    
    // Después de 800ms, remover completamente
    setTimeout(() => {
      setSuggestionStatus(prev => {
        const newStatus = { ...prev }
        delete newStatus[id]
        return newStatus
      })
    }, 800)
  }

  const getStatusBadge = (id: string) => {
    const status = suggestionStatus[id]?.status
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">{tCharacters('accepted')}</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">{tCharacters('rejected')}</Badge>
      default:
        return <Badge variant="outline">{tCharacters('pending')}</Badge>
    }
  }

  const isProcessed = (id: string) => {
    const status = suggestionStatus[id]?.status
    return status === 'accepted' || status === 'rejected'
  }

  const isVisible = (id: string) => {
    // Mostrar si no existe en el estado o si no ha sido procesado
    return !suggestionStatus[id] || !isProcessed(id)
  }

  const getCardAnimation = (id: string) => {
    const status = suggestionStatus[id]?.status
    switch (status) {
      case 'accepted':
        return 'bg-green-100 border-green-400 scale-95 opacity-75'
      case 'rejected':
        return 'bg-red-100 border-red-400 scale-95 opacity-75'
      default:
        return 'hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
    }
  }

  // Filtrar sugerencias visibles
  const visiblePersonajes = suggestions.personajes?.filter(char => isVisible(char.id)) || []
  const visibleEventos = suggestions.eventos?.filter(event => isVisible(event.id)) || []
  const visibleRelaciones = suggestions.relaciones?.filter(rel => isVisible(rel.id)) || []

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="personajes" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
          <TabsTrigger value="personajes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {tCharacters('title')} {tCharacters('count', { count: visiblePersonajes.length })}
          </TabsTrigger>
          <TabsTrigger value="eventos" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {tEvents('title')} {tEvents('count', { count: visibleEventos.length })}
          </TabsTrigger>
          <TabsTrigger value="relaciones" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {tRelations('title')} {tRelations('count', { count: visibleRelaciones.length })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personajes" className="flex-1 overflow-y-auto space-y-3 px-1 min-h-0">
          {visiblePersonajes.map((character) => (
            <Card 
              key={character.id} 
              className={`border-l-4 border-l-blue-500 transition-all duration-400 ease-out mx-2 ${getCardAnimation(character.id)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  {getStatusBadge(character.id)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">
                    Confianza: {Math.round(character.confidence * 100)}%
                  </Badge>
                  {character.isNew ? (
                    <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Existente</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{character.description}</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Contexto:</strong> "{character.context}"
                </div>
                {!isProcessed(character.id) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(character.id, 'character', character)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* TODO: implementar edición */}}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(character.id, 'character')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {visiblePersonajes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {suggestions.personajes?.length === 0 
                ? 'No se encontraron nuevos personajes'
                : 'Todas las sugerencias han sido procesadas ✨'
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="eventos" className="flex-1 overflow-y-auto space-y-3 px-1 min-h-0">
          {visibleEventos.map((event) => (
            <Card 
              key={event.id} 
              className={`border-l-4 border-l-green-500 transition-all duration-400 ease-out mx-2 ${getCardAnimation(event.id)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {getStatusBadge(event.id)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">
                    Confianza: {Math.round(event.confidence * 100)}%
                  </Badge>
                  {event.date && (
                    <Badge className="bg-green-100 text-green-800">{event.date}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{event.description}</p>
                {event.involvedCharacters && event.involvedCharacters.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm font-medium">Personajes:</span>
                    {event.involvedCharacters.map((char, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Contexto:</strong> "{event.context}"
                </div>
                {!isProcessed(event.id) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(event.id, 'event', event)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* TODO: implementar edición */}}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(event.id, 'event')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {visibleEventos.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {suggestions.eventos?.length === 0 
                ? 'No se encontraron nuevos eventos'
                : 'Todas las sugerencias han sido procesadas ✨'
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="relaciones" className="flex-1 overflow-y-auto space-y-3 px-1 min-h-0">
          {visibleRelaciones.map((relation) => (
            <Card 
              key={relation.id} 
              className={`border-l-4 border-l-purple-500 transition-all duration-400 ease-out mx-2 ${getCardAnimation(relation.id)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {relation.characterAName} ↔ {relation.characterBName}
                  </CardTitle>
                  {getStatusBadge(relation.id)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">
                    Confianza: {Math.round(relation.confidence * 100)}%
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">{relation.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{relation.description}</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Contexto:</strong> "{relation.context}"
                </div>
                {!isProcessed(relation.id) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(relation.id, 'relation', relation)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* TODO: implementar edición */}}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(relation.id, 'relation')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {visibleRelaciones.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {suggestions.relaciones?.length === 0 
                ? 'No se encontraron nuevas relaciones'
                : 'Todas las sugerencias han sido procesadas ✨'
              }
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}