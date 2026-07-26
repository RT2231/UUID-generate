import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Project, Material } from '../types';

interface MinecraftTrackerDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-user': string };
  };
  materials: {
    key: string;
    value: Material;
    indexes: { 'by-project': string };
  };
}

const DB_NAME = 'minecraft-material-tracker';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MinecraftTrackerDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<MinecraftTrackerDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MinecraftTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('projects')) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-user', 'user_id');
      }

      if (!db.objectStoreNames.contains('materials')) {
        const materialStore = db.createObjectStore('materials', { keyPath: 'id' });
        materialStore.createIndex('by-project', 'project_id');
      }
    },
  });

  return dbInstance;
};

export const createProject = async (project: Project): Promise<void> => {
  const db = await initDB();
  await db.put('projects', project);
};

export const getProjects = async (userId: string): Promise<Project[]> => {
  const db = await initDB();
  const index = db.transaction('projects').store.index('by-user');
  return index.getAll(userId);
};

export const getProject = async (projectId: string): Promise<Project | undefined> => {
  const db = await initDB();
  return db.get('projects', projectId);
};

export const updateProject = async (project: Project): Promise<void> => {
  const db = await initDB();
  await db.put('projects', { ...project, updated_at: new Date().toISOString() });
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const db = await initDB();
  await db.delete('projects', projectId);
  
  const materials = await getMaterials(projectId);
  for (const material of materials) {
    await db.delete('materials', material.id);
  }
};

export const createMaterial = async (material: Material): Promise<void> => {
  const db = await initDB();
  await db.put('materials', material);
};

export const createMaterials = async (materials: Material[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('materials', 'readwrite');
  for (const material of materials) {
    await tx.store.put(material);
  }
  await tx.done;
};

export const getMaterials = async (projectId: string): Promise<Material[]> => {
  const db = await initDB();
  const index = db.transaction('materials').store.index('by-project');
  return index.getAll(projectId);
};

export const updateMaterial = async (material: Material): Promise<void> => {
  const db = await initDB();
  await db.put('materials', material);
};

export const updateMaterialCount = async (
  materialId: string, 
  delta: number
): Promise<Material | undefined> => {
  const db = await initDB();
  const material = await db.get('materials', materialId);
  if (!material) return undefined;

  const newCount = Math.max(0, material.owned_count + delta);
  const updated = { ...material, owned_count: newCount };
  await db.put('materials', updated);
  return updated;
};

export const setMaterialCount = async (
  materialId: string, 
  count: number
): Promise<Material | undefined> => {
  const db = await initDB();
  const material = await db.get('materials', materialId);
  if (!material) return undefined;

  const updated = { ...material, owned_count: Math.max(0, count) };
  await db.put('materials', updated);
  return updated;
};

export const deleteMaterial = async (materialId: string): Promise<void> => {
  const db = await initDB();
  await db.delete('materials', materialId);
};

export const mergeMaterials = async (
  projectId: string,
  newMaterials: Material[]
): Promise<void> => {
  const db = await initDB();
  const existingMaterials = await getMaterials(projectId);
  
  const existingMap = new Map<string, Material>();
  for (const mat of existingMaterials) {
    const key = `${mat.item_id || ''}-${mat.name}`;
    existingMap.set(key, mat);
  }

  const materialsToUpdate: Material[] = [];
  const materialsToDelete = new Set(existingMaterials.map(m => m.id));

  for (const newMat of newMaterials) {
    const key = `${newMat.item_id || ''}-${newMat.name}`;
    const existing = existingMap.get(key);

    if (existing) {
      materialsToUpdate.push({
        ...newMat,
        owned_count: existing.owned_count,
        assignee: existing.assignee,
        comment: existing.comment,
        chest_location: existing.chest_location,
        chest_number: existing.chest_number,
      });
      materialsToDelete.delete(existing.id);
    } else {
      materialsToUpdate.push(newMat);
    }
  }

  const tx = db.transaction('materials', 'readwrite');
  for (const material of materialsToUpdate) {
    await tx.store.put(material);
  }
  
  for (const id of materialsToDelete) {
    await tx.store.delete(id);
  }
  
  await tx.done;
};
