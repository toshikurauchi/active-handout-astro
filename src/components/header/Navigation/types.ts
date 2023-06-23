export interface SerializableNavItem {
  id: number
  title: string
  url: string
  order: number
  parent?: number
  children?: number[]
}

export interface NavTreeItem {
  title: string
  url: string
  order: number
  parent?: NavTreeItem
  children?: NavTreeItem[]
}