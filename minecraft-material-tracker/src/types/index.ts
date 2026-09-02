// 型定義
export interface Material {
  id: string
  item_id: string
  name: string
  required_count: number
  owned_count: number
  layer: number
  stack_size: number
  type: string
  project_id: string
  assigned_to?: string
  comment?: string
  storage_location?: string
  chest_number?: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface LayerProgress {
  layer: number
  totalRequired: number
  totalOwned: number
  completedMaterials: number
  totalMaterials: number
  progress: number
}

export interface DashboardStats {
  totalRequired: number
  totalOwned: number
  totalShortage: number
  completedMaterials: number
  incompleteMaterials: number
  overallProgress: number
}

export type SortField = 'name' | 'required_count' | 'shortage' | 'layer'
export type SortOrder = 'asc' | 'desc'
export type FilterType = 'all' | 'shortage' | 'completed' | 'incomplete'

export interface CSVRow {
  Name: string
  ItemId: string
  Count: string
  Layer: string
  StackSize: string
  Type: string
  Container?: string
}
