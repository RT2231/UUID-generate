import type { Material, DashboardStats, LayerStats } from '../types';
import { calculateShortage } from './helpers';

export const calculateDashboardStats = (materials: Material[]): DashboardStats => {
  const totalRequired = materials.reduce((sum, m) => sum + m.required_count, 0);
  const totalOwned = materials.reduce((sum, m) => sum + m.owned_count, 0);
  const totalShortage = materials.reduce((sum, m) => sum + calculateShortage(m), 0);
  
  const completedMaterials = materials.filter(m => 
    m.owned_count >= m.required_count && m.required_count > 0
  ).length;
  
  const incompleteMaterials = materials.length - completedMaterials;
  
  const overallProgress = totalRequired > 0 
    ? (totalOwned / totalRequired) * 100 
    : 0;

  return {
    totalRequired,
    totalOwned,
    totalShortage,
    completedMaterials,
    incompleteMaterials,
    overallProgress: Math.min(100, overallProgress),
  };
};

export const calculateLayerStats = (materials: Material[]): LayerStats[] => {
  const layerMap = new Map<number, { totalRequired: number; totalOwned: number }>();

  for (const material of materials) {
    const layer = material.layer || 0;
    const existing = layerMap.get(layer) || { totalRequired: 0, totalOwned: 0 };
    
    layerMap.set(layer, {
      totalRequired: existing.totalRequired + material.required_count,
      totalOwned: existing.totalOwned + material.owned_count,
    });
  }

  const stats: LayerStats[] = [];
  for (const [layer, data] of layerMap.entries()) {
    stats.push({
      layer,
      totalRequired: data.totalRequired,
      totalOwned: data.totalOwned,
      progress: data.totalRequired > 0 
        ? (data.totalOwned / data.totalRequired) * 100 
        : 100,
      isComplete: data.totalOwned >= data.totalRequired && data.totalRequired > 0,
    });
  }

  return stats.sort((a, b) => a.layer - b.layer);
};

export const filterAndSortMaterials = (
  materials: Material[],
  searchQuery: string,
  filterType: 'all' | 'shortage' | 'completed' | 'incomplete',
  selectedLayer: number | null,
  selectedType: string | null,
  sortField: 'name' | 'required_count' | 'shortage' | 'layer',
  sortOrder: 'asc' | 'desc'
): Material[] => {
  let filtered = [...materials];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.item_id.toLowerCase().includes(query)
    );
  }

  if (filterType === 'shortage') {
    filtered = filtered.filter(m => calculateShortage(m) > 0);
  } else if (filterType === 'completed') {
    filtered = filtered.filter(m => m.owned_count >= m.required_count && m.required_count > 0);
  } else if (filterType === 'incomplete') {
    filtered = filtered.filter(m => m.owned_count < m.required_count);
  }

  if (selectedLayer !== null) {
    filtered = filtered.filter(m => m.layer === selectedLayer);
  }

  if (selectedType) {
    filtered = filtered.filter(m => m.type === selectedType);
  }

  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'required_count':
        comparison = a.required_count - b.required_count;
        break;
      case 'shortage':
        comparison = calculateShortage(a) - calculateShortage(b);
        break;
      case 'layer':
        comparison = a.layer - b.layer;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};
