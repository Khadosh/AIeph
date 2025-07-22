import React from 'react'

interface NodeDetailsProps {
  x: number
  y: number
  label: string
  insight: string
  onClose: () => void
  triangle?: {
    direction: 'left' | 'top'
    top: number
    left: number
  }
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({ x, y, label, insight, onClose, triangle }) => (
  <div
    className="ai-insight-bubble absolute z-30 animate-fade-in"
    style={{
      left: x,
      top: y,
      minWidth: 220,
      maxWidth: 320,
      pointerEvents: 'auto',
    }}
  >
    <div className="relative bg-zinc-900/95 border border-emerald-700 text-emerald-100 px-6 py-4 rounded-xl shadow-2xl text-base">
      <button
        className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-200 text-lg"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
      <div className="font-bold text-lg mb-2">{label}</div>
      <div className="mb-2">{insight}</div>
      <div className="text-xs text-zinc-400">(Aquí podrías mostrar más detalles, relaciones, etc.)</div>
      {/* Triángulo */}
      {triangle ? (
        <div
          className="absolute"
          style={{
            top: triangle.top,
            left: triangle.left,
            width: 20,
            height: 20,
            overflow: 'visible',
          }}
        >
          {triangle.direction === 'left' ? (
            <svg width="20" height="20"><polygon points="0,10 20,0 20,20" fill="#064e3b" opacity="0.95" /></svg>
          ) : (
            <svg width="20" height="20"><polygon points="10,0 20,20 0,20" fill="#064e3b" opacity="0.95" /></svg>
          )}
        </div>
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-5 h-5 overflow-hidden">
          <svg width="20" height="20"><polygon points="10,0 20,20 0,20" fill="#064e3b" opacity="0.95" /></svg>
        </div>
      )}
    </div>
  </div>
) 