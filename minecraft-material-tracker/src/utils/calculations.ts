// 計算ユーティリティ

export const calculateShortage = (required: number, owned: number): number => {
  return Math.max(0, required - owned)
}

export const calculateProgress = (required: number, owned: number): number => {
  if (required === 0) return 0
  return Math.min(100, Math.round((owned / required) * 100))
}

export const calculateStacks = (count: number, stackSize: number): { stacks: number; remainder: number } => {
  if (stackSize === 0) return { stacks: 0, remainder: count }
  return {
    stacks: Math.floor(count / stackSize),
    remainder: count % stackSize,
  }
}

export const calculateShulkerBoxes = (count: number, stackSize: number): number => {
  const shulkerCapacity = stackSize * 27
  if (shulkerCapacity === 0) return 0
  return count / shulkerCapacity
}

export const formatStackDisplay = (count: number, stackSize: number): string => {
  const { stacks, remainder } = calculateStacks(count, stackSize)
  if (stacks === 0) return `${remainder}個`
  if (remainder === 0) return `${stacks}スタック`
  return `${stacks}スタック${remainder}個`
}

export const formatShulkerDisplay = (count: number, stackSize: number): string => {
  const boxes = calculateShulkerBoxes(count, stackSize)
  return `${boxes.toFixed(2)}箱`
}

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const rows: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }
  
  return rows
}

export const parseBloxelizerCSV = (csvText: string): any[] => {
  const rows = parseCSV(csvText)
  return rows.map(row => ({
    name: row.Name || '',
    item_id: row.ItemId || '',
    required_count: parseInt(row.Count || '0', 10),
    layer: parseInt(row.Layer || '0', 10),
    stack_size: parseInt(row.StackSize || '64', 10),
    type: row.Type || 'block',
  }))
}
