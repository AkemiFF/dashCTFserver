"use client"

import type React from "react"

import { GraphView } from "@/components/osint/graph-view"
import { ListView } from "@/components/osint/list-view"
import { LoadingScreen } from "@/components/osint/loading-screen"
import { MobileMenu } from "@/components/osint/mobile-menu"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { osintData, type OsintNode } from "@/lib/osint-data"
import { Home, Menu } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function OsintFramework() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["osint-framework"]))
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<OsintNode[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [animatingNodes, setAnimatingNodes] = useState<Set<string>>(new Set())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph")

  // Ref to track animation state
  const animationInProgressRef = useRef<boolean>(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Simuler un temps de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Fonction pour partager le framework
  const shareFramework = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "OSINT Framework",
          text: "Découvrez cet outil de visualisation OSINT avec des ressources pour la recherche, le développement et la sécurité",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Lien copié dans le presse-papier !")
        })
        .catch((err) => {
          console.error("Erreur lors de la copie du lien: ", err)
        })
    }
  }

  // Fonction pour rechercher des nœuds
  const searchNodes = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    const results: OsintNode[] = []
    const searchTermLower = term.toLowerCase()

    const findMatchingNodes = (node: OsintNode) => {
      if (node.name.toLowerCase().includes(searchTermLower)) {
        results.push(node)
      }

      if (node.children) {
        node.children.forEach(findMatchingNodes)
      }
    }

    findMatchingNodes(osintData)
    setSearchResults(results)
  }

  // Get the parent path of a node
  const getNodePath = (nodeId: string): string[] => {
    const path: string[] = []

    const findPath = (id: string, currentNode: OsintNode = osintData, currentPath: string[] = []): boolean => {
      const newPath = [...currentPath, currentNode.id]

      if (currentNode.id === id) {
        path.push(...newPath)
        return true
      }

      if (currentNode.children) {
        for (const child of currentNode.children) {
          if (findPath(id, child, newPath)) {
            return true
          }
        }
      }

      return false
    }

    findPath(nodeId)
    return path
  }

  // Fonction pour développer tous les nœuds parents d'un nœud donné
  const expandParents = (id: string) => {
    const path = getNodePath(id)
    const newExpandedNodes = new Set(path)
    setExpandedNodes(newExpandedNodes)
  }

  // Optimized hover handler
  const setHoveredNodeDirectly = (nodeId: string | null) => {
    if (hoveredNode !== nodeId) {
      setHoveredNode(nodeId)
    }
  }

  // Completely rewritten toggleNode function with fluid animations
  const toggleNode = (nodeId: string) => {
    // Prevent rapid clicking during animation
    if (animationInProgressRef.current) return

    // Set animation in progress
    animationInProgressRef.current = true

    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    // Get the path to this node
    const nodePath = getNodePath(nodeId)

    // First, mark the node as animating
    setAnimatingNodes((prev) => {
      const newSet = new Set(prev)
      newSet.add(nodeId)
      return newSet
    })

    // Update expanded nodes with accordion behavior
    setExpandedNodes((prev) => {
      const newSet = new Set<string>()

      // Always keep the root expanded
      newSet.add("osint-framework")

      // If the node was already expanded, just close it and its children
      if (prev.has(nodeId)) {
        // Keep all parents in the path
        for (const id of nodePath) {
          if (id !== nodeId) {
            newSet.add(id)
          }
        }
      } else {
        // Node is being expanded - add all nodes in the path
        for (const id of nodePath) {
          newSet.add(id)
        }

        // Close sibling branches by only keeping nodes in the current path
        // and the root node
        for (const id of prev) {
          if (nodePath.includes(id)) {
            newSet.add(id)
          }
        }
      }

      return newSet
    })

    // Clear animation state after animation completes
    animationTimeoutRef.current = setTimeout(() => {
      setAnimatingNodes(new Set())
      animationInProgressRef.current = false
    }, 800)
  }

  // Gestionnaires pour le zoom et le panoramique
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * -0.01
    const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 2)
    setZoomLevel(newZoom)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Bouton gauche de la souris
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStart.x
      const dy = e.touches[0].clientY - dragStart.y

      // Only update if there's significant movement
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      // Only update if there's significant movement to prevent micro-updates
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Effet pour la recherche
  useEffect(() => {
    searchNodes(searchTerm)
  }, [searchTerm])

  // Cleanup animation timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex flex-col items-center w-full">
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0% {
            filter: drop-shadow(0 0 2px #64ffda);
          }
          50% {
            filter: drop-shadow(0 0 8px #64ffda);
          }
          100% {
            filter: drop-shadow(0 0 2px #64ffda);
          }
        }
      `}</style>

      <header className="w-full py-4 text-center border-b border-[#64ffda]/30 backdrop-blur-sm sticky top-0 z-10" style={{ marginTop: "70px" }}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="mr-2 text-white hover:bg-[#16213e]/50"
              >
                <Menu size={24} />
              </Button>
            )}
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wider">
              <span className="text-[#64ffda]">OSINT</span> Framework
            </h1>
          </div>

          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "graph" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("graph")}
                className={viewMode === "graph" ? "bg-[#64ffda] text-[#0f0c29]" : "text-[#64ffda] border-[#64ffda]/50"}
              >
                Graph
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#64ffda] text-[#0f0c29]" : "text-[#64ffda] border-[#64ffda]/50"}
              >
                List
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
                  className="text-[#64ffda] border-[#64ffda]/50"
                >
                  +
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
                  className="text-[#64ffda] border-[#64ffda]/50"
                >
                  -
                </Button>
                <Button variant="outline" size="sm" onClick={resetView} className="text-[#64ffda] border-[#64ffda]/50">
                  <Home size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>

      </header>

      {mobileMenuOpen && (
        <MobileMenu
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchResults={searchResults}
          setSelectedNode={setSelectedNode}
          expandParents={expandParents}
          setMobileMenuOpen={setMobileMenuOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categories={osintData.children || []}
          setActiveCategory={setActiveCategory}
          setExpandedNodes={setExpandedNodes}
        />
      )}

      {isMobile && viewMode === "graph" && !mobileMenuOpen && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
          <Button
            variant="default"
            size="icon"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
            className="bg-[#64ffda] text-[#0f0c29] w-10 h-10 rounded-full shadow-lg"
          >
            +
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
            className="bg-[#64ffda] text-[#0f0c29] w-10 h-10 rounded-full shadow-lg"
          >
            -
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={resetView}
            className="bg-[#64ffda] text-[#0f0c29] w-10 h-10 rounded-full shadow-lg"
          >
            <Home size={18} />
          </Button>
        </div>
      )}

      <div
        className="w-full overflow-auto bg-transparent pt-4"
        style={{ height: "calc(100vh - 120px)" }}
        onWheel={viewMode === "graph" ? handleWheel : undefined}
        onMouseDown={viewMode === "graph" ? handleMouseDown : undefined}
        onMouseMove={viewMode === "graph" ? handleMouseMove : undefined}
        onMouseUp={viewMode === "graph" ? handleMouseUp : undefined}
        onMouseLeave={viewMode === "graph" ? handleMouseUp : undefined}
        onTouchStart={viewMode === "graph" ? handleTouchStart : undefined}
        onTouchMove={viewMode === "graph" ? handleTouchMove : undefined}
        onTouchEnd={viewMode === "graph" ? handleTouchEnd : undefined}
      >
        {searchTerm && searchResults.length > 0 ? (
          // <SearchResults
          //   results={searchResults}
          //   onSelect={(id: React.SetStateAction<string | null>) => {
          //     setSelectedNode(id)
          //     if (id) expandParents(id)
          //   }}
          //   clearSearch={() => setSearchTerm("")}
          // />
          (<div className="p-4 bg-[#1a1a2e]/80 shadow-lg rounded-md m-4 border border-[#64ffda]/50 backdrop-blur-md"></div>)
        ) : viewMode === "graph" ? (
          <div className="w-full overflow-x-auto">
            <GraphView
              expandedNodes={expandedNodes}
              hoveredNode={hoveredNode}
              animatingNodes={animatingNodes}
              zoomLevel={zoomLevel}
              panOffset={panOffset}
              toggleNode={toggleNode}
              setHoveredNode={setHoveredNodeDirectly}
            />
          </div>
        ) : (
          <div className="p-4 bg-[#1a1a2e]/80 shadow-lg rounded-md m-4 border border-[#64ffda]/50 backdrop-blur-md">
            <ListView expandedNodes={expandedNodes} toggleNode={toggleNode} rootNode={osintData} />
          </div>
        )}
      </div>

      <div className="w-full p-4 border-t border-[#64ffda]/30 bg-[#1a1a2e]/70 text-white backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#64ffda]">Notes</h2>
            <p className="text-sm text-gray-300 mt-2">
              This is a futuristic clone of the OSINT Framework, a collection of various tools for Open Source
              Intelligence gathering. Click on nodes to expand categories and click on tool names to visit their
              websites.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <p className="text-xs text-gray-400">
              Updated with new tools for developers, ethical hackers, and AI researchers.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={shareFramework}
              className="mt-2 text-[#64ffda] border-[#64ffda]/50 hover:bg-[#64ffda]/20"
            >
              Partager
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
