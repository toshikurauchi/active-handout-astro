export interface SerializableNavItem {
  id: number
  title: string
  url: string
  order: number
  isCurrent: boolean
  parent?: number
  children?: number[]
}

export interface NavTreeItem {
  title: string
  url: string
  order: number
  isCurrent: boolean
  parent?: NavTreeItem
  children?: NavTreeItem[]
}