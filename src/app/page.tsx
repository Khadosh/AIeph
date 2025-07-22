'use client'

import { Button } from '@/components/ui/button'
import NextLink from 'next/link'
import { Sparkles, Brain, BookOpen, PenTool, ArrowRight } from 'lucide-react'
import AuthDialog from '@/components/ui/auth-dialog'
import { useState } from 'react'
import { StoryGraph, StoryGraphNode, StoryGraphLink } from '@/components/story-graph/StoryGraph'

export default function Home() {
  // Easter egg: show a random "AI memory" on each visit
  const memories = [
    '¿Recuerdas cuando tu protagonista tenía ojos verdes y no azules?',
    'En el capítulo 3 mencionaste una tormenta, ¿quieres que la retome en el clímax?',
    'Has usado la palabra "oscuridad" 17 veces. ¿Quieres variar el tono?',
    'Tu villano aún no tiene motivación clara. ¿Te ayudo a definirla?',
    '¿Sabías que tu historia ya suma más de 40.000 palabras?'
  ]
  const [memory] = useState(() => memories[Math.floor(Math.random() * memories.length)])

  // Demo data for the graph
  const demoNodes: StoryGraphNode[] = [
    { id: 'protagonist', label: 'Lucía', x: 120, y: 120, type: 'character', color: '#f472b6', insight: 'Lucía cambió de motivación en el capítulo 5.' },
    { id: 'villain', label: 'El Espectro', x: 320, y: 80, type: 'character', color: '#f472b6', insight: 'El Espectro aparece por primera vez en el capítulo 2.' },
    { id: 'beach', label: 'Playa', x: 220, y: 250, type: 'place', color: '#60a5fa', insight: 'La playa es clave en el clímax, aunque Lucía odia el mar.' },
    { id: 'storm', label: 'Tormenta', x: 400, y: 220, type: 'event', color: '#fbbf24', insight: 'La tormenta conecta el pasado de Lucía con el presente.' },
    { id: 'amulet', label: 'Amuleto', x: 60, y: 260, type: 'object', color: '#a78bfa', insight: 'El amuleto ha cambiado de color tres veces.' },
  ]
  const demoLinks: StoryGraphLink[] = [
    { from: 'protagonist', to: 'beach' },
    { from: 'protagonist', to: 'amulet' },
    { from: 'protagonist', to: 'villain' },
    { from: 'villain', to: 'storm' },
    { from: 'beach', to: 'storm' },
    { from: 'amulet', to: 'storm' },
    { from: 'amulet', to: 'beach' }
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-100 relative overflow-hidden">
      {/* Background constellation effect */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* SVG or canvas constellation, simple for now */}
        <svg width="100%" height="100%" className="opacity-20" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="10%" cy="20%" r="2" fill="#fff" />
          <circle cx="30%" cy="40%" r="1.5" fill="#fff" />
          <circle cx="60%" cy="15%" r="2.5" fill="#fff" />
          <circle cx="80%" cy="60%" r="1.2" fill="#fff" />
          <circle cx="50%" cy="80%" r="2" fill="#fff" />
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#fff" strokeWidth="0.5" />
          <line x1="30%" y1="40%" x2="60%" y2="15%" stroke="#fff" strokeWidth="0.5" />
          <line x1="60%" y1="15%" x2="80%" y2="60%" stroke="#fff" strokeWidth="0.5" />
          <line x1="80%" y1="60%" x2="50%" y2="80%" stroke="#fff" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main content */}
      <section className="z-10 w-full max-w-3xl px-6 py-20 flex flex-col items-center text-center">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 bg-zinc-900/80 px-4 py-1 rounded-full text-xs font-mono tracking-wide uppercase text-emerald-400 border border-emerald-700 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI-eph no es una app de escritura. Es tu memoria viva.
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
          Escribe sin miedo a olvidar.<br />
          <span className="text-emerald-400">Crea universos,</span> nosotros recordamos los detalles.
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
          AI-eph es tu copiloto literario: una IA que no solo te sugiere, sino que <b>recuerda</b>, <b>vigila</b> y <b>te advierte</b> sobre contradicciones, repeticiones y oportunidades narrativas. Escribir ya no es un salto al vacío: tu historia tiene red.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <AuthDialog mode="signup">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
              <PenTool className="w-5 h-5 mr-2" />
              Empieza a escribir sin miedo
            </Button>
          </AuthDialog>
          <Button size="lg" variant="outline" asChild>
            <NextLink href="#demo" className="text-foreground">Ver demo</NextLink>
          </Button>
        </div>
        {/* AI Memory/Easter Egg */}
        <div className="mt-4 text-sm text-zinc-400 italic flex items-center gap-2 justify-center">
          <Brain className="w-4 h-4" />
          <span>{memory}</span>
        </div>
      </section>

      {/* Living Manuscript Section */}
      <section id="demo" className="z-10 w-full max-w-4xl px-6 py-16 flex flex-col items-center text-center border-t border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2 justify-center">
          <BookOpen className="w-7 h-7 text-emerald-400" />
          Tu manuscrito, vivo y consciente
        </h2>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
          AI-eph analiza cada palabra, cada personaje, cada giro de tu historia. Si olvidas un detalle, <b>nosotros no</b>. Si repites una idea, te lo señalamos. Si tu trama se enreda, te ayudamos a desenredarla.
        </p>
        <StoryGraph nodes={demoNodes} links={demoLinks} width={480} height={340} />
      </section>

      {/* Final CTA */}
      <section className="z-10 w-full max-w-2xl px-6 py-16 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Haz crecer tu universo, <span className="text-emerald-400">no tu ansiedad</span>
        </h2>
        <p className="text-zinc-300 mb-8">
          Deja de perder el hilo. Deja de temerle a los olvidos. Escribe con la tranquilidad de que AI-eph cuida tu historia como si fuera suya.
        </p>
        <AuthDialog mode="signup">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <ArrowRight className="w-5 h-5 mr-2" />
            Crear mi cuenta gratis
          </Button>
        </AuthDialog>
      </section>
    </main>
  )
}
