import { useState, useEffect, useCallback } from 'react'
import { Material, Project, LayerProgress, DashboardStats } from '../types'
import { calculateShortage, calculateProgress } from '../utils/calculations'
import {
  saveProject as dbSaveProject,
  getProject as dbGetProject,
  getAllProjects as dbGetAllProjects,
  deleteProject as dbDeleteProject,
  getMaterialsByProject as dbGetMaterials,
  bulkSaveMaterials as dbBulkSaveMaterials,
  saveMaterial as dbSaveMaterial,
} from '../lib/db'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const allProjects = await dbGetAllProjects()
      setProjects(allProjects)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (name: string, userId: string) => {
    const project: Project = {
      id: crypto.randomUUID(),
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await dbSaveProject(project)
    setProjects(prev => [...prev, project])
    return project
  }

  const deleteProject = async (id: string) => {
    await dbDeleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return { projects, loading, createProject, deleteProject, refreshProjects: loadProjects }
}

export const useMaterials = (projectId: string | null) => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      loadMaterials()
    } else {
      setMaterials([])
      setLoading(false)
    }
  }, [projectId])

  const loadMaterials = async () => {
    if (!projectId) return
    try {
      const loadedMaterials = await dbGetMaterials(projectId)
      setMaterials(loadedMaterials)
    } catch (error) {
      console.error('Failed to load materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMaterialOwnedCount = async (materialId: string, delta: number) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === materialId) {
          const newOwned = Math.max(0, m.owned_count + delta)
          dbSaveMaterial({ ...m, owned_count: newOwned })
          return { ...m, owned_count: newOwned }
        }
        return m
      })
    )
  }

  const setMaterialOwnedCount = async (materialId: string, count: number) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === materialId) {
          const newOwned = Math.max(0, count)
          dbSaveMaterial({ ...m, owned_count: newOwned })
          return { ...m, owned_count: newOwned }
        }
        return m
      })
    )
  }

  const importMaterials = async (newMaterials: Omit<Material, 'id' | 'owned_count'>[]) => {
    if (!projectId) return
    
    // 既存の素材を取得
    const existingMaterials = await dbGetMaterials(projectId)
    
    // 既存の所持数を維持しながら新しい素材リストを作成
    const existingMap = new Map(existingMaterials.map(m => [m.item_id, m.owned_count]))
    
    const materialsToSave: Material[] = newMaterials.map((mat, index) => {
      const existingOwned = existingMap.get(mat.item_id) || 0
      return {
        ...mat,
        id: crypto.randomUUID(),
        owned_count: existingOwned,
        project_id: projectId,
      }
    })

    await dbBulkSaveMaterials(materialsToSave)
    setMaterials(materialsToSave)
  }

  return {
    materials,
    loading,
    updateMaterialOwnedCount,
    setMaterialOwnedCount,
    importMaterials,
    refreshMaterials: loadMaterials,
  }
}

export const useLayerProgress = (materials: Material[]): LayerProgress[] => {
  const [layerProgress, setLayerProgress] = useState<LayerProgress[]>([])

  useEffect(() => {
    if (materials.length === 0) {
      setLayerProgress([])
      return
    }

    const layerMap = new Map<number, Material[]>()
    materials.forEach(m => {
      const existing = layerMap.get(m.layer) || []
      layerMap.set(m.layer, [...existing, m])
    })

    const progress: LayerProgress[] = Array.from(layerMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([layer, layerMaterials]) => {
        const totalRequired = layerMaterials.reduce((sum, m) => sum + m.required_count, 0)
        const totalOwned = layerMaterials.reduce((sum, m) => sum + m.owned_count, 0)
        const completedMaterials = layerMaterials.filter(
          m => m.owned_count >= m.required_count
        ).length
        const prog = calculateProgress(totalRequired, totalOwned)

        return {
          layer,
          totalRequired,
          totalOwned,
          completedMaterials,
          totalMaterials: layerMaterials.length,
          progress: prog,
        }
      })

    setLayerProgress(progress)
  }, [materials])

  return layerProgress
}

export const useDashboardStats = (materials: Material[]): DashboardStats => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequired: 0,
    totalOwned: 0,
    totalShortage: 0,
    completedMaterials: 0,
    incompleteMaterials: 0,
    overallProgress: 0,
  })

  useEffect(() => {
    if (materials.length === 0) {
      setStats({
        totalRequired: 0,
        totalOwned: 0,
        totalShortage: 0,
        completedMaterials: 0,
        incompleteMaterials: 0,
        overallProgress: 0,
      })
      return
    }

    const totalRequired = materials.reduce((sum, m) => sum + m.required_count, 0)
    const totalOwned = materials.reduce((sum, m) => sum + m.owned_count, 0)
    const totalShortage = materials.reduce(
      (sum, m) => sum + calculateShortage(m.required_count, m.owned_count),
      0
    )
    const completedMaterials = materials.filter(m => m.owned_count >= m.required_count).length
    const incompleteMaterials = materials.length - completedMaterials
    const overallProgress = calculateProgress(totalRequired, totalOwned)

    setStats({
      totalRequired,
      totalOwned,
      totalShortage,
      completedMaterials,
      incompleteMaterials,
      overallProgress,
    })
  }, [materials])

  return stats
}
