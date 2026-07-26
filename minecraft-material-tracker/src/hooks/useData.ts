import { useState, useEffect } from 'react';
import type { Project, Material } from '../types';
import * as db from '../lib/db';

export const useProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await db.getProjects(userId);
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId]);

  const createProject = async (name: string) => {
    const project: Project = {
      id: `project-${Date.now()}`,
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db.createProject(project);
    setProjects(prev => [...prev, project]);
    return project;
  };

  const deleteProject = async (projectId: string) => {
    await db.deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return { projects, loading, createProject, deleteProject };
};

export const useMaterials = (projectId: string | null) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setMaterials([]);
      setLoading(false);
      return;
    }

    const loadMaterials = async () => {
      try {
        const data = await db.getMaterials(projectId);
        setMaterials(data);
      } catch (error) {
        console.error('Failed to load materials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [projectId]);

  const updateCount = async (materialId: string, delta: number) => {
    const updated = await db.updateMaterialCount(materialId, delta);
    if (updated) {
      setMaterials(prev => prev.map(m => m.id === materialId ? updated : m));
    }
  };

  const setCount = async (materialId: string, count: number) => {
    const updated = await db.setMaterialCount(materialId, count);
    if (updated) {
      setMaterials(prev => prev.map(m => m.id === materialId ? updated : m));
    }
  };

  const updateMaterial = async (material: Material) => {
    await db.updateMaterial(material);
    setMaterials(prev => prev.map(m => m.id === material.id ? material : m));
  };

  const importMaterials = async (newMaterials: Material[]) => {
    if (projectId) {
      await db.mergeMaterials(projectId, newMaterials);
      const updated = await db.getMaterials(projectId);
      setMaterials(updated);
    }
  };

  return { 
    materials, 
    loading, 
    updateCount, 
    setCount, 
    updateMaterial,
    importMaterials 
  };
};
