import React, { useState, useRef } from 'react'
import { StoryNode } from './StoryNode'
import { StoryLink } from './StoryLink'
import { NodePreview } from './NodePreview'
import { NodeDetails } from './NodeDetails'

export interface StoryGraphNode {
  id: string
  label: string
  x: number
  y: number
  type: string
  color: string
  insight: string
}

export interface StoryGraphLink {
  from: string
  to: string
}

interface StoryGraphProps {
  nodes: StoryGraphNode[]
  links: StoryGraphLink[]
  width?: number
  height?: number
}

export const StoryGraph: React.FC<StoryGraphProps> = ({ nodes, links, width = 480, height = 340 }) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(nodes.map(n => [n.id, { x: n.x, y: n.y }]))
  )
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [isHoveringPopup, setIsHoveringPopup] = useState(false)
  const hidePopupTimeout = useRef<NodeJS.Timeout | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Drag handler
  function handleDrag(id: string, x: number, y: number) {
    setPositions(pos => ({ ...pos, [id]: { x, y } }))
  }
  function handleDragStart(id: string) {
    setDraggingNodeId(id)
  }
  function handleDragEnd() {
    setDraggingNodeId(null)
  }

  // Node radius based on state
  function getNodeRadius(node: StoryGraphNode) {
    if (selected === node.id) return 30
    if (draggingNodeId === node.id) return 28
    if (hovered === node.id) return 26
    return 22
  }

  // Mouse event handlers for tooltip/details
  function handleNodeHover(id: string | null) {
    if (hidePopupTimeout.current) {
      clearTimeout(hidePopupTimeout.current)
      hidePopupTimeout.current = null
    }
    setHovered(id)
  }
  function handleNodeClick(id: string) {
    setSelected(id)
  }
  function handleDetailsClose() {
    setSelected(null)
  }

  // Hover logic for popup
  function handlePopupEnter() {
    if (hidePopupTimeout.current) {
      clearTimeout(hidePopupTimeout.current)
      hidePopupTimeout.current = null
    }
    setIsHoveringPopup(true)
  }
  function handlePopupLeave() {
    hidePopupTimeout.current = setTimeout(() => {
      setIsHoveringPopup(false)
      setHovered(null)
    }, 100)
  }

  // Helper para ajustar la posición del tooltip/ficha para que no se salga de la pantalla
  function adjustPosition(x: number, y: number, width: number, height: number) {
    let newX = x
    let newY = y
    if (x + width > window.innerWidth) newX = window.innerWidth - width - 8
    if (x < 0) newX = 8
    if (y + height > window.innerHeight) newY = window.innerHeight - height - 8
    if (y < 0) newY = 8
    return { x: newX, y: newY }
  }

  // Medidas aproximadas de los tooltips
  const previewW = 240, previewH = 80
  const detailsW = 320, detailsH = 180
  const separation = 12 // separación visual entre nodo y ficha/tooltip

  // Calcula la posición del nodo relativa al contenedor, considerando el escalado del SVG
  function getNodeRelativePos(nodeId: string) {
    const node = nodes.find(n => n.id === nodeId)
    if (!node || !svgRef.current || !containerRef.current) return { left: 0, top: 0 }
    const svgRect = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const svgWidth = svgRef.current.width.baseVal.value
    const svgHeight = svgRef.current.height.baseVal.value
    const scaleX = svgRect.width / svgWidth
    const scaleY = svgRect.height / svgHeight
    const pos = positions[nodeId] || { x: node.x, y: node.y }
    return {
      left: svgRect.left - containerRect.left + pos.x * scaleX,
      top: svgRect.top - containerRect.top + pos.y * scaleY
    }
  }

  // Show popup if node is hovered or popup is hovered
  const showPreview = hovered && !selected && (isHoveringPopup || hovered)

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center" style={{ minHeight: height }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto block"
        style={{
          maxWidth: '100%',
          filter: 'drop-shadow(0 2px 8px #0002)',
          opacity: draggingNodeId ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {/* Connections */}
        {links.map((link, i) => {
          const from = nodes.find(n => n.id === link.from)
          const to = nodes.find(n => n.id === link.to)
          if (!from || !to) return null
          const fromPos = positions[from.id] || { x: from.x, y: from.y }
          const toPos = positions[to.id] || { x: to.x, y: to.y }
          const isActive =
            hovered === from.id || hovered === to.id || selected === from.id || selected === to.id
          const animate = selected === from.id
          return (
            <StoryLink
              key={i}
              from={fromPos}
              to={toPos}
              active={isActive}
              gradientId="glow"
              animate={animate}
            />
          )
        })}
        {/* SVG gradient for glow */}
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id] || { x: node.x, y: node.y }
          const isActive = hovered === node.id
          const isSelected = selected === node.id
          return (
            <StoryNode
              key={node.id}
              id={node.id}
              x={pos.x}
              y={pos.y}
              color={node.color}
              label={node.label}
              active={isActive}
              selected={isSelected}
              draggingNodeId={draggingNodeId}
              onHover={handleNodeHover}
              onClick={handleNodeClick}
              onDrag={handleDrag}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onMouseEnter={() => handleNodeHover(node.id)}
              onMouseLeave={() => {
                hidePopupTimeout.current = setTimeout(() => {
                  setHovered(null)
                }, 100)
              }}
            />
          )
        })}
      </svg>
      {/* Preview on hover (si no está seleccionado) */}
      {showPreview && (() => {
        const node = nodes.find(n => n.id === hovered)
        if (!node) return null
        const pos = getNodeRelativePos(node.id)
        const nodeRadius = getNodeRadius(node)
        // Centra el tooltip horizontalmente y lo posiciona debajo del nodo
        let x = pos.left - (previewW / 2)
        let y = pos.top + nodeRadius + separation
        const adj = adjustPosition(x, y, previewW, previewH)
        return (
          <NodePreview
            x={adj.x}
            y={adj.y}
            label={node.label}
            insight={node.insight}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handlePopupLeave}
          />
        )
      })()}
      {/* Details on click */}
      {selected && (() => {
        const node = nodes.find(n => n.id === selected)
        if (!node) return null
        const pos = getNodeRelativePos(node.id)
        const nodeRadius = getNodeRadius(node)
        // Centra el tooltip horizontalmente y lo posiciona debajo del nodo
        let x = pos.left - (detailsW / 2)
        let y = pos.top + nodeRadius + separation
        const adj = adjustPosition(x, y, detailsW, detailsH)
        return (
          <NodeDetails
            x={adj.x}
            y={adj.y}
            label={node.label}
            insight={node.insight}
            onClose={handleDetailsClose}
          />
        )
      })()}
    </div>
  )
}
 