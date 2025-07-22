import React from 'react'

interface StoryLinkProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  active?: boolean
  color?: string
  gradientId?: string
  animate?: boolean
}

export const StoryLink: React.FC<StoryLinkProps> = ({ from, to, active, color = '#a1a1aa', gradientId, animate }) => {
  // Calcular la longitud de la línea
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)
  // Usar estado para disparar la animación en mount
  const [dashOffset, setDashOffset] = React.useState(animate ? length : 0)
  React.useEffect(() => {
    if (animate) {
      setDashOffset(length)
      const t = setTimeout(() => setDashOffset(0), 30)
      return () => clearTimeout(t)
    } else {
      setDashOffset(0)
    }
  }, [animate, length, from.x, from.y, to.x, to.y])
  return (
    <g>
      <line
        key={from.x + '-' + from.y + '-' + to.x + '-' + to.y + '-' + (animate ? 'a' : 'n')}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={gradientId && active ? `url(#${gradientId})` : color}
        strokeWidth={active ? 2.5 : 1.2}
        opacity={active ? 0.95 : 0.5}
        style={{
          transition: animate ? 'stroke-dashoffset 0.25s linear' : undefined,
          strokeDasharray: animate ? length : undefined,
          strokeDashoffset: animate ? dashOffset : undefined,
        }}
      />
      {/* Pulse/dot animation can be added here if needed */}
    </g>
  )
} 