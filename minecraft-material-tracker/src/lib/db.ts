// IndexedDB 設定
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface MaterialData {
  id: string
  item_id: string
  name: string
  required_count: number
  owned_count: number
  layer: number
  stack_size: number
  type: string
  project_id: string
}

export interface ProjectData {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

interface MaterialTrackerDB extends DBSchema {
  projects: {
    key: string
    value: ProjectData
  }
  materials: {
    key: string
    value: MaterialData
    indexes: { 'by-project': string }
  }
}

let dbPromise: Promise<IDBPDatabase<MaterialTrackerDB>> | null = null

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MaterialTrackerDB>('material-tracker-db', 1, {
      upgrade(db) {
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
        // Materials store
        if (!db.objectStoreNames.contains('materials')) {
          const materialStore = db.createObjectStore('materials', { keyPath: 'id' })
          materialStore.createIndex('by-project', 'project_id')
        }
      },
    })
  }
  return dbPromise
}

// Project operations
export const saveProject = async (project: ProjectData) => {
  const db = await initDB()
  await db.put('projects', project)
}

export const getProject = async (id: string): Promise<ProjectData | undefined> => {
  const db = await initDB()
  return db.get('projects', id)
}

export const getAllProjects = async (): Promise<ProjectData[]> => {
  const db = await initDB()
  return db.getAll('projects')
}

export const deleteProject = async (id: string) => {
  const db = await initDB()
  await db.delete('projects', id)
  // Delete associated materials
  const materials = await db.getAllFromIndex('materials', 'by-project', id)
  for (const material of materials) {
    await db.delete('materials', material.id)
  }
}

// Material operations
export const saveMaterial = async (material: MaterialData) => {
  const db = await initDB()
  await db.put('materials', material)
}

export const getMaterialsByProject = async (projectId: string): Promise<MaterialData[]> => {
  const db = await initDB()
  return db.getAllFromIndex('materials', 'by-project', projectId)
}

export const deleteMaterial = async (id: string) => {
  const db = await initDB()
  await db.delete('materials', id)
}

export const bulkSaveMaterials = async (materials: MaterialData[]) => {
  const db = await initDB()
  const tx = db.transaction('materials', 'readwrite')
  await Promise.all([
    ...materials.map(material => tx.store.put(material)),
    tx.done,
  ])
}
