export interface Material {
  id: string;
  item_id: string;
  name: string;
  required_count: number;
  owned_count: number;
  layer: number;
  stack_size: number;
  type: string;
  container?: string;
  assignee?: string;
  comment?: string;
  chest_location?: string;
  chest_number?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalRequired: number;
  totalOwned: number;
  totalShortage: number;
  completedMaterials: number;
  incompleteMaterials: number;
  overallProgress: number;
}

export interface LayerStats {
  layer: number;
  totalRequired: number;
  totalOwned: number;
  progress: number;
  isComplete: boolean;
}

export type SortField = 'name' | 'required_count' | 'shortage' | 'layer';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'shortage' | 'completed' | 'incomplete';
