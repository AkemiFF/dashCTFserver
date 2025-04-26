"use client"

import type { OsintNode } from "@/lib/osint-data"
import { useCallback, useEffect, useRef, useState } from "react"

interface GraphViewProps {
  expandedNodes: Set<string>
  hoveredNode: string | null
  animatingNodes: Set<string>
  zoomLevel: number
  panOffset: { x: number; y: number }
  toggleNode: (nodeId: string) => void
  setHoveredNode: (nodeId: string | null) => void
}

export function GraphView({
  expandedNodes,
  hoveredNode,
  animatingNodes,
  zoomLevel,
  panOffset,
  toggleNode,
  setHoveredNode,
}: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodesRef = useRef<Record<string, SVGGElement>>({})
  const linesRef = useRef<Record<string, SVGPathElement[]>>({})
  const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({})
  const previousExpandedNodesRef = useRef<Set<string>>(new Set())
  const [isInitialRender, setIsInitialRender] = useState(true)

  // Track all rendered nodes to avoid recreating them
  const renderedNodesRef = useRef<Set<string>>(new Set())
  const renderedLinesRef = useRef<Set<string>>(new Set())

  // Completely rewritten rendering approach for fluid animations
  const renderGraph = useCallback(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight

    // Initialize SVG structure only once
    if (!svg.querySelector("g.main-group")) {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }

      // Create main groups
      const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      mainGroup.classList.add("main-group")
      svg.appendChild(mainGroup)

      const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      linesGroup.classList.add("lines-group")
      mainGroup.appendChild(linesGroup)

      const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      nodesGroup.classList.add("nodes-group")
      mainGroup.appendChild(nodesGroup)

      // Create defs for filters
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
      svg.appendChild(defs)

      // Create standard glow filter
      const glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter")
      glowFilter.setAttribute("id", "glow-standard")

      const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
      feGaussianBlur.setAttribute("stdDeviation", "2")
      feGaussianBlur.setAttribute("result", "blur")
      glowFilter.appendChild(feGaussianBlur)

      const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood")
      feFlood.setAttribute("flood-color", "#64ffda")
      feFlood.setAttribute("result", "color")
      glowFilter.appendChild(feFlood)

      const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite")
      feComposite.setAttribute("in", "color")
      feComposite.setAttribute("in2", "blur")
      feComposite.setAttribute("operator", "in")
      feComposite.setAttribute("result", "glow")
      glowFilter.appendChild(feComposite)

      const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge")
      const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
      feMergeNode1.setAttribute("in", "glow")
      const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
      feMergeNode2.setAttribute("in", "SourceGraphic")
      feMerge.appendChild(feMergeNode1)
      feMerge.appendChild(feMergeNode2)
      glowFilter.appendChild(feMerge)

      defs.appendChild(glowFilter)

      // Create hover glow filter
      const hoverFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter")
      hoverFilter.setAttribute("id", "glow-hover")

      const hoverBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
      hoverBlur.setAttribute("stdDeviation", "2")
      hoverBlur.setAttribute("result", "blur")
      hoverFilter.appendChild(hoverBlur)

      const hoverFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood")
      hoverFlood.setAttribute("flood-color", "#ff2a6d")
      hoverFlood.setAttribute("result", "color")
      hoverFilter.appendChild(hoverFlood)

      const hoverComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite")
      hoverComposite.setAttribute("in", "color")
      hoverComposite.setAttribute("in2", "blur")
      hoverComposite.setAttribute("operator", "in")
      hoverComposite.setAttribute("result", "glow")
      hoverFilter.appendChild(hoverComposite)

      const hoverMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge")
      const hoverMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
      hoverMergeNode1.setAttribute("in", "glow")
      const hoverMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
      hoverMergeNode2.setAttribute("in", "SourceGraphic")
      hoverMerge.appendChild(hoverMergeNode1)
      hoverMerge.appendChild(hoverMergeNode2)
      hoverFilter.appendChild(hoverMerge)

      defs.appendChild(hoverFilter)

      // Add CSS animations to the SVG
      const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
      style.textContent = `
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        .node-enter {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        
        .node-enter-active {
          opacity: 1;
          transform: scale(1);
        }
        
        .node-exit {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.3s ease-in, transform 0.3s ease-in;
        }
        
        .node-exit-active {
          opacity: 0;
          transform: scale(0.95);
        }
        
        .line-enter {
          opacity: 0;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          transition: opacity 0.3s ease-out, stroke-dashoffset 0.6s ease-out;
        }
        
        .line-enter-active {
          opacity: 0.6;
          stroke-dashoffset: 0;
        }
        
        .line-exit {
          opacity: 0.6;
          transition: opacity 0.3s ease-in;
        }
        
        .line-exit-active {
          opacity: 0;
        }
      `
      svg.appendChild(style)
    }

    // Update transform on main group
    const mainGroup = svg.querySelector("g.main-group") as SVGGElement
    mainGroup.setAttribute("transform", `translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`)

    // Get references to groups
    const linesGroup = svg.querySelector("g.lines-group") as SVGGElement
    const nodesGroup = svg.querySelector("g.nodes-group") as SVGGElement

    // Import data and process the graph
    import("@/lib/osint-data").then(({ osintData }) => {
      // Find newly expanded and collapsed nodes
      const newlyExpandedNodes = new Set<string>()
      const newlyCollapsedNodes = new Set<string>()

      expandedNodes.forEach((nodeId) => {
        if (!previousExpandedNodesRef.current.has(nodeId)) {
          newlyExpandedNodes.add(nodeId)
        }
      })

      previousExpandedNodesRef.current.forEach((nodeId) => {
        if (!expandedNodes.has(nodeId)) {
          newlyCollapsedNodes.add(nodeId)
        }
      })

      // Update previous expanded nodes reference
      previousExpandedNodesRef.current = new Set(expandedNodes)

      // Process the graph - this doesn't clear everything, just updates what's needed
      processGraph(
        osintData,
        150,
        Math.max(150, height / 4),
        0,
        linesGroup,
        nodesGroup,
        undefined,
        undefined,
        newlyExpandedNodes,
        newlyCollapsedNodes,
      )

      // Apply hover states
      if (hoveredNode && nodesRef.current[hoveredNode]) {
        const nodeGroup = nodesRef.current[hoveredNode]
        const circle = nodeGroup.querySelector("circle")
        const text = nodeGroup.querySelector("text")

        if (circle) {
          circle.setAttribute("stroke", "#ff2a6d")
          circle.setAttribute("stroke-width", "2")
          circle.setAttribute("filter", "url(#glow-hover)")
        }

        if (text) {
          text.setAttribute("fill", "#ffffff")
        }
      }

      // After first render, mark as initialized
      if (isInitialRender) {
        setIsInitialRender(false)
      }
    })
  }, [expandedNodes, hoveredNode, animatingNodes, zoomLevel, panOffset, isInitialRender])

  // Process the graph - update nodes and connections without clearing everything
  const processGraph = (
    node: OsintNode,
    x: number,
    y: number,
    level: number,
    linesGroup: SVGGElement,
    nodesGroup: SVGGElement,
    parentX?: number,
    parentY?: number,
    newlyExpandedNodes?: Set<string>,
    newlyCollapsedNodes?: Set<string>,
    parentId?: string,
  ) => {
    // Store node position
    nodePositionsRef.current[node.id] = { x, y }

    // Check if this node is newly expanded or a child of a newly expanded node
    const isNewlyExpanded = newlyExpandedNodes?.has(node.id) || false
    const isParentNewlyExpanded = (parentId && newlyExpandedNodes?.has(parentId)) || false

    // Create or update node
    let nodeGroup = nodesRef.current[node.id]
    const nodeExists = !!nodeGroup

    if (!nodeExists) {
      // Create new node group
      nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      nodeGroup.setAttribute("data-id", node.id)
      nodeGroup.classList.add("node-group")
      nodesGroup.appendChild(nodeGroup)
      nodesRef.current[node.id] = nodeGroup
      linesRef.current[node.id] = []

      // Add to rendered nodes set
      renderedNodesRef.current.add(node.id)

      // Determine node colors based on attributes
      let nodeColor = "#1a1a2e"
      const strokeColor = "#64ffda"
      const textColor = "#e2e8f0"

      if (node.tool) nodeColor = "#16213e"
      if (node.registration) nodeColor = "#0f3460"
      if (node.darkweb) nodeColor = "#1a1a40"
      if (node.manual) nodeColor = "#0f3460"

      // Draw node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", x.toString())
      circle.setAttribute("cy", y.toString())
      circle.setAttribute("r", "8")
      circle.setAttribute("fill", nodeColor)
      circle.setAttribute("stroke", strokeColor)
      circle.setAttribute("stroke-width", "1.5")
      circle.classList.add("cursor-pointer")

      // Apply entrance animation for new nodes
      if (isParentNewlyExpanded || isNewlyExpanded) {
        nodeGroup.classList.add("node-enter")
        setTimeout(() => {
          nodeGroup.classList.add("node-enter-active")
        }, 10)
        setTimeout(() => {
          nodeGroup.classList.remove("node-enter", "node-enter-active")
        }, 300)
      }

      nodeGroup.appendChild(circle)

      // Add node text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", (x + 14).toString())
      text.setAttribute("y", (y + 4).toString())
      text.setAttribute("font-size", "11")
      text.setAttribute("fill", textColor)
      text.setAttribute("font-weight", "500")
      text.setAttribute("text-shadow", "0px 0px 3px rgba(0,0,0,0.9), 0px 0px 5px rgba(0,0,0,0.7)")
      text.textContent = node.name
      text.classList.add("cursor-pointer")

      nodeGroup.appendChild(text)

      // Calculate text width for positioning
      const textWidth = node.name.length * 6.5

      // Add URL icon if applicable
      if (node.url) {
        const linkIcon = document.createElementNS("http://www.w3.org/2000/svg", "text")
        linkIcon.setAttribute("x", (x + textWidth + 16).toString())
        linkIcon.setAttribute("y", (y + 4).toString())
        linkIcon.setAttribute("font-size", "11")
        linkIcon.setAttribute("fill", "#ff2a6d")
        linkIcon.setAttribute("text-shadow", "0px 0px 3px rgba(0,0,0,0.9), 0px 0px 5px rgba(0,0,0,0.7)")
        linkIcon.textContent = "↗"
        linkIcon.classList.add("cursor-pointer")

        nodeGroup.appendChild(linkIcon)

        // Add URL click handler
        linkIcon.addEventListener("click", (e) => {
          e.stopPropagation()
          window.open(node.url, "_blank")
        })
      }

      // Add indicators for special attributes
      let indicatorOffset = 0
      if (node.tool) {
        const toolIndicator = document.createElementNS("http://www.w3.org/2000/svg", "text")
        toolIndicator.setAttribute("x", (x + textWidth + 20 + indicatorOffset).toString())
        toolIndicator.setAttribute("y", (y + 4).toString())
        toolIndicator.setAttribute("font-size", "9")
        toolIndicator.setAttribute("fill", "#64ffda")
        toolIndicator.setAttribute("text-shadow", "0px 0px 3px rgba(0,0,0,0.9)")
        toolIndicator.textContent = "(T)"

        // nodeGroup.appendChild(toolIndicator)
        indicatorOffset += 15
      }

      if (node.registration) {
        const regIndicator = document.createElementNS("http://www.w3.org/2000/svg", "text")
        regIndicator.setAttribute("x", (x + textWidth + 50 + indicatorOffset).toString())
        regIndicator.setAttribute("y", (y + 4).toString())
        regIndicator.setAttribute("font-size", "9")
        regIndicator.setAttribute("fill", "#ff2a6d")
        regIndicator.setAttribute("text-shadow", "0px 0px 3px rgba(0,0,0,0.9)")
        regIndicator.textContent = "(R)"

        // nodeGroup.appendChild(regIndicator)
        indicatorOffset += 15
      }

      // Add event listeners
      const handleNodeClick = (e: Event) => {
        e.stopPropagation()
        toggleNode(node.id)
      }

      const handleMouseEnter = () => {
        setHoveredNode(node.id)
      }

      const handleMouseLeave = () => {
        setHoveredNode(null)
      }

      nodeGroup.addEventListener("click", handleNodeClick)
      nodeGroup.addEventListener("mouseenter", handleMouseEnter)
      nodeGroup.addEventListener("mouseleave", handleMouseLeave)
    } else {
      // Update existing node position
      const circle = nodeGroup.querySelector("circle")
      const text = nodeGroup.querySelector("text")

      if (circle) {
        circle.setAttribute("cx", x.toString())
        circle.setAttribute("cy", y.toString())
      }

      if (text) {
        text.setAttribute("x", (x + 14).toString())
        text.setAttribute("y", (y + 4).toString())
      }

      // Update other elements positions
      const linkIcon = nodeGroup.querySelector("text:nth-child(3)")
      if (linkIcon) {
        const textWidth = node.name.length * 6.5
        linkIcon.setAttribute("x", (x + textWidth + 16).toString())
        linkIcon.setAttribute("y", (y + 4).toString())
      }

      // Update indicators
      let indicatorOffset = 0
      const textWidth = node.name.length * 6.5

      const toolIndicator = nodeGroup.querySelector("text[fill='#64ffda']")
      if (toolIndicator) {
        toolIndicator.setAttribute("x", (x + textWidth + 20 + indicatorOffset).toString())
        toolIndicator.setAttribute("y", (y + 4).toString())
        indicatorOffset += 15
      }

      const regIndicator = nodeGroup.querySelector("text[fill='#ff2a6d']:not(:nth-child(3))")
      if (regIndicator) {
        regIndicator.setAttribute("x", (x + textWidth + 20 + indicatorOffset).toString())
        regIndicator.setAttribute("y", (y + 4).toString())
      }
    }

    // Draw connection line to parent if not root
    if (parentX !== undefined && parentY !== undefined) {
      const lineId = `${parentId}-${node.id}`
      const lineExists = renderedLinesRef.current.has(lineId)

      if (!lineExists) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path")

        // Create curved path for connection line
        line.setAttribute(
          "d",
          `M${parentX},${parentY} C${(parentX + x) / 2},${parentY} ${(parentX + x) / 2},${y} ${x},${y}`,
        )
        line.setAttribute("stroke", "#64ffda")
        line.setAttribute("fill", "none")
        line.setAttribute("stroke-width", "1.5")
        line.setAttribute("data-id", lineId)

        // Apply entrance animation for new lines
        if (isParentNewlyExpanded || isNewlyExpanded) {
          line.classList.add("line-enter")
          setTimeout(() => {
            line.classList.add("line-enter-active")
          }, 10)
          setTimeout(() => {
            line.classList.remove("line-enter", "line-enter-active")
          }, 600)
        } else {
          line.setAttribute("opacity", "0.6")
        }

        linesGroup.appendChild(line)
        if (!linesRef.current[node.id]) linesRef.current[node.id] = []
        linesRef.current[node.id].push(line)
        renderedLinesRef.current.add(lineId)
      } else {
        // Update existing line
        const line = linesGroup.querySelector(`path[data-id="${lineId}"]`) as SVGPathElement
        if (line) {
          line.setAttribute(
            "d",
            `M${parentX},${parentY} C${(parentX + x) / 2},${parentY} ${(parentX + x) / 2},${y} ${x},${y}`,
          )
        }
      }
    }

    // Process children if expanded
    if (node.children && expandedNodes.has(node.id)) {
      const childCount = node.children.length

      // Calculate spacing
      const baseSpacing = 35
      const minSpacing = 30
      const maxSpacing = 45

      let childSpacing = baseSpacing

      if (childCount > 8) {
        childSpacing = Math.max(minSpacing, baseSpacing - (childCount - 8) * 0.5)
      } else if (childCount <= 5) {
        childSpacing = Math.min(maxSpacing, baseSpacing + (5 - childCount) * 2)
      }

      // Calculate total height needed for all children
      const totalHeight = childCount * childSpacing

      // Calculate vertical offset for parent node
      const parentOffset = Math.min(totalHeight / 3, 50) * (level === 0 ? 0.5 : 1)
      const adjustedY = y + (childCount > 3 ? parentOffset : 0)

      // Calculate starting Y position for first child
      const startY = adjustedY - totalHeight / 2

      // Horizontal spacing between parent and child nodes
      const horizontalSpacing = 220

      // Process each child node
      node.children.forEach((child, index) => {
        const childY = startY + index * childSpacing

        // Process child node with staggered timing if newly expanded
        const delay = isNewlyExpanded ? index * 40 : 0

        if (delay > 0) {
          setTimeout(() => {
            processGraph(
              child,
              x + horizontalSpacing,
              childY,
              level + 1,
              linesGroup,
              nodesGroup,
              x,
              adjustedY,
              newlyExpandedNodes,
              newlyCollapsedNodes,
              node.id,
            )
          }, delay)
        } else {
          processGraph(
            child,
            x + horizontalSpacing,
            childY,
            level + 1,
            linesGroup,
            nodesGroup,
            x,
            adjustedY,
            newlyExpandedNodes,
            newlyCollapsedNodes,
            node.id,
          )
        }
      })
    } else if (node.children) {
      // Check if this node was collapsed and handle removal of children
      if (newlyCollapsedNodes?.has(node.id)) {
        // Find all child nodes that need to be removed
        const removeChildNodes = (childNode: OsintNode) => {
          if (nodesRef.current[childNode.id]) {
            const nodeGroup = nodesRef.current[childNode.id]

            // Apply exit animation
            nodeGroup.classList.add("node-exit")
            setTimeout(() => {
              nodeGroup.classList.add("node-exit-active")
            }, 10)

            // Remove after animation completes
            setTimeout(() => {
              if (nodeGroup.parentNode) {
                nodeGroup.parentNode.removeChild(nodeGroup)
              }
              delete nodesRef.current[childNode.id]
              renderedNodesRef.current.delete(childNode.id)
            }, 300)

            // Remove connection lines
            if (linesRef.current[childNode.id]) {
              linesRef.current[childNode.id].forEach((line) => {
                line.classList.add("line-exit")
                setTimeout(() => {
                  line.classList.add("line-exit-active")
                }, 10)

                setTimeout(() => {
                  if (line.parentNode) {
                    line.parentNode.removeChild(line)
                  }
                }, 300)
              })

              delete linesRef.current[childNode.id]
            }

            // Recursively remove grandchildren
            if (childNode.children) {
              childNode.children.forEach(removeChildNodes)
            }
          }
        }

        // Remove all children
        node.children.forEach(removeChildNodes)
      }
    }
  }

  // Use useEffect to render the graph when dependencies change
  useEffect(() => {
    renderGraph()
  }, [renderGraph])

  return <svg ref={svgRef} width="100%" height="3000" className="min-w-[1000px] md:min-w-[1500px]" />
}
