import type { Material } from '../types';

export const calculateShortage = (material: Material): number => {
  return Math.max(0, material.required_count - material.owned_count);
};

export const calculateProgress = (material: Material): number => {
  if (material.required_count === 0) return 100;
  return Math.min(100, (material.owned_count / material.required_count) * 100);
};

export const calculateStacks = (count: number, stackSize: number): { stacks: number; remainder: number } => {
  return {
    stacks: Math.floor(count / stackSize),
    remainder: count % stackSize,
  };
};

export const calculateShulkerBoxes = (count: number, stackSize: number): number => {
  const shulkerCapacity = stackSize * 27;
  return count / shulkerCapacity;
};

export const formatStackDisplay = (count: number, stackSize: number): string => {
  const { stacks, remainder } = calculateStacks(count, stackSize);
  if (stacks === 0) return `${remainder}個`;
  if (remainder === 0) return `${stacks}スタック`;
  return `${stacks}スタック${remainder}個`;
};

export const formatShulkerDisplay = (count: number, stackSize: number): string => {
  const boxes = calculateShulkerBoxes(count, stackSize);
  return `${boxes.toFixed(2)}箱`;
};

export const parseCSV = (csvText: string): Material[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const materials: Material[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV with quotes
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    const getVal = (key: string): string => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? (values[idx] || '') : '';
    };

    const material: Material = {
      id: `material-${Date.now()}-${i}`,
      item_id: getVal('ItemId'),
      name: getVal('Name'),
      required_count: parseInt(getVal('Count') || '0', 10),
      owned_count: 0,
      layer: parseInt(getVal('Layer') || '0', 10),
      stack_size: parseInt(getVal('StackSize') || '64', 10),
      type: getVal('Type'),
      container: getVal('Container') || undefined,
    };

    materials.push(material);
  }

  return materials;
};

export const parseTXT = (txtText: string): Material[] => {
  const lines = txtText.trim().split('\n');
  const materials: Material[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Try to parse common formats
    const match1 = trimmed.match(/(.+?)\s*x\s*(\d+)/i);
    const match2 = trimmed.match(/(\d+)\s*x\s*(.+)/i);
    const match3 = trimmed.match(/(.+?)\s+(\d+)/);

    let name = trimmed;
    let count = 0;

    if (match1) {
      name = match1[1].trim();
      count = parseInt(match1[2], 10);
    } else if (match2) {
      count = parseInt(match2[1], 10);
      name = match2[2].trim();
    } else if (match3) {
      name = match3[1].trim();
      count = parseInt(match3[2], 10);
    }

    if (name && count > 0) {
      materials.push({
        id: `material-${Date.now()}-${materials.length}`,
        item_id: '',
        name,
        required_count: count,
        owned_count: 0,
        layer: 0,
        stack_size: 64,
        type: 'block',
      });
    }
  }

  return materials;
};
