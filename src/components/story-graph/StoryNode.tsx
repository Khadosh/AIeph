import React, { useRef, useEffect } from 'react'

interface StoryNodeProps {
  id: string
  x: number
  y: number
  color: string
  label: string
  active?: boolean
  selected?: boolean
  draggingNodeId?: string | null
  onHover?: (id: string | null) => void
  onClick?: (id: string) => void
  onDrag?: (id: string, x: number, y: number) => void
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
}

export const StoryNode: React.FC<StoryNodeProps> = ({
  id, x, y, color, label, active, selected, draggingNodeId, onHover, onClick, onDrag, onDragStart, onDragEnd
}) => {
  const nodeRef = useRef<SVGGElement>(null)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  // Drag logic
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return
      moved.current = true
      const svg = nodeRef.current?.ownerSVGElement
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const newX = e.clientX - rect.left - offset.current.x
      const newY = e.clientY - rect.top - offset.current.y
      onDrag?.(id, newX, newY)
    }
    function onMouseUp() {
      if (dragging.current) {
        dragging.current = false
        document.body.style.cursor = ''
        onDragEnd?.()
        setTimeout(() => { moved.current = false }, 0)
      }
    }
    if (dragging.current) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'grabbing'
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
    }
  }, [id, onDrag, onDragEnd])

  function handleMouseDown(e: React.MouseEvent) {
    dragging.current = true
    moved.current = false
    const svg = nodeRef.current?.ownerSVGElement
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left - x,
      y: e.clientY - rect.top - y
    }
    onDragStart?.(id)
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (moved.current) return
    onClick?.(id)
  }

  const isDragging = draggingNodeId === id
  const glow = selected || isDragging ? 'drop-shadow(0 0 24px #34d399)' : active ? 'drop-shadow(0 0 12px #34d399)' : undefined
  const cursor = isDragging ? 'grabbing' : 'pointer'

  return (
    <g
      ref={nodeRef}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{ cursor, filter: glow }}
    >
      <circle
        cx={x}
        cy={y}
        r={selected ? 30 : isDragging ? 28 : active ? 26 : 22}
        fill={selected ? color : isDragging ? color : active ? color : '#18181b'}
        stroke={color}
        strokeWidth={selected ? 5 : isDragging ? 5 : active ? 4 : 2}
        style={{ transition: 'fill 0.2s, stroke 0.2s, r 0.2s' }}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={selected ? 20 : isDragging ? 18 : active ? 17 : 15}
        fill={selected ? '#fff' : isDragging ? '#fff' : active ? '#fff' : '#d4d4d8'}
        fontWeight={selected ? 800 : isDragging ? 800 : active ? 700 : 500}
        style={{ transition: 'fill 0.2s, font-size 0.2s, font-weight 0.2s', pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
    </g>
  )
} 