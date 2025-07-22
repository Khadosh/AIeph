import React from 'react'

interface NodePreviewProps {
  x: number
  y: number
  label: string
  insight: string
  triangle?: {
    direction: 'left' | 'top'
    top: number
    left: number
  }
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}

export const NodePreview: React.FC<NodePreviewProps> = ({ x, y, label, insight, triangle, onMouseEnter, onMouseLeave }) => (
  <div
    className="ai-insight-bubble absolute z-20 animate-fade-in"
    style={{
      left: x,
      top: y,
      minWidth: 180,
      maxWidth: 240,
      pointerEvents: 'auto',
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="relative bg-zinc-900/90 border border-emerald-700 text-emerald-200 px-4 py-2 rounded-lg shadow-lg text-sm">
      <span className="font-semibold">{label}:</span> {insight}
      {/* Triángulo */}
      {triangle ? (
        <div
          className="absolute"
          style={{
            top: triangle.top,
            left: triangle.left,
            width: 16,
            height: 16,
            overflow: 'visible',
          }}
        >
          {triangle.direction === 'left' ? (
            <svg width="16" height="16"><polygon points="0,8 16,0 16,16" fill="#064e3b" opacity="0.85" /></svg>
          ) : (
            <svg width="16" height="16"><polygon points="8,0 16,16 0,16" fill="#064e3b" opacity="0.85" /></svg>
          )}
        </div>
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 overflow-hidden">
          <svg width="16" height="16"><polygon points="8,0 16,16 0,16" fill="#064e3b" opacity="0.85" /></svg>
        </div>
      )}
    </div>
  </div>
) 