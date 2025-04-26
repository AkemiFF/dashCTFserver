export interface OsintNode {
  id: string
  name: string
  type: "root" | "category" | "subcategory" | "tool"
  url?: string
  description?: string
  children?: OsintNode[]
}

export interface OsintCategory {
  id: string
  name: string
  description?: string
  subcategories?: OsintSubcategory[]
  tools?: OsintTool[]
}

export interface OsintSubcategory {
  id: string
  name: string
  description?: string
  tools: OsintTool[]
}

export interface OsintTool {
  id: string
  name: string
  url: string
  description?: string
  tags?: string[]
}

export type OsintNodeType = OsintNode
