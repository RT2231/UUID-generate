import React, { useState } from 'react'
import type { Material, SortField, SortOrder, FilterType } from '../types'
import {
  calculateShortage,
  calculateProgress,
  formatStackDisplay,
  formatShulkerDisplay,
} from '../utils/calculations'

interface MaterialListProps {
  materials: Material[]
  onUpdateOwnedCount: (id: string, delta: number) => void
  onSetOwnedCount: (id: string, count: number) => void
  selectedLayer?: number | null
}

export const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onUpdateOwnedCount,
  onSetOwnedCount,
  selectedLayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [directInputId, setDirectInputId] = useState<string | null>(null)
  const [directInputValue, setDirectInputValue] = useState('')

  // フィルタリングとソート
  let filteredMaterials = materials.filter(m => {
    // レイヤーフィルター
    if (selectedLayer !== undefined && selectedLayer !== null && m.layer !== selectedLayer) {
      return false
    }

    // 検索フィルター
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (
        !m.name.toLowerCase().includes(term) &&
        !m.item_id.toLowerCase().includes(term)
      ) {
        return false
      }
    }

    // ステータスフィルター
    const shortage = calculateShortage(m.required_count, m.owned_count)
    const isCompleted = m.owned_count >= m.required_count
    
    if (filterType === 'shortage' && shortage === 0) return false
    if (filterType === 'completed' && !isCompleted) return false
    if (filterType === 'incomplete' && isCompleted) return false

    return true
  })

  // ソート
  filteredMaterials.sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'required_count':
        comparison = a.required_count - b.required_count
        break
      case 'shortage':
        comparison = calculateShortage(a.required_count, a.owned_count) - 
                    calculateShortage(b.required_count, b.owned_count)
        break
      case 'layer':
        comparison = a.layer - b.layer
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })


  const handleDirectInput = (material: Material) => {
    setDirectInputId(material.id)
    setDirectInputValue(material.owned_count.toString())
  }

  const submitDirectInput = (materialId: string) => {
    const value = parseInt(directInputValue, 10)
    if (!isNaN(value)) {
      onSetOwnedCount(materialId, value)
    }
    setDirectInputId(null)
    setDirectInputValue('')
  }

  return (
    <div className="p-4">
      {/* 検索・フィルター */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="素材名または ID で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border rounded"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">すべて</option>
          <option value="shortage">不足のみ</option>
          <option value="completed">完了のみ</option>
          <option value="incomplete">未完了</option>
        </select>

        <select
          value={`${sortField}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-')
            setSortField(field as SortField)
            setSortOrder(order as SortOrder)
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="name-asc">名前 (A-Z)</option>
          <option value="name-desc">名前 (Z-A)</option>
          <option value="required_count-asc">必要数 (少→多)</option>
          <option value="required_count-desc">必要数 (多→少)</option>
          <option value="shortage-asc">不足数 (少→多)</option>
          <option value="shortage-desc">不足数 (多→少)</option>
          <option value="layer-asc">レイヤー (昇順)</option>
          <option value="layer-desc">レイヤー (降順)</option>
        </select>
      </div>

      {/* 素材リスト */}
      <div className="space-y-2">
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">該当する素材がありません</p>
        ) : (
          filteredMaterials.map(material => {
            const shortage = calculateShortage(material.required_count, material.owned_count)
            const progress = calculateProgress(material.required_count, material.owned_count)
            const isCompleted = shortage === 0

            return (
              <div
                key={material.id}
                className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{material.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Layer {material.layer}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-green-600 font-semibold">✓ 完了</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">ID: {material.item_id}</p>
                    
                    {/* 進捗バー */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    {/* スタック・シュルカー情報 */}
                    <div className="mt-2 text-sm text-gray-600">
                      <span>{formatStackDisplay(material.owned_count, material.stack_size)}</span>
                      <span className="mx-2">|</span>
                      <span>シュルカー：{formatShulkerDisplay(material.owned_count, material.stack_size)}</span>
                    </div>
                  </div>

                  {/* コントロール */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        必要数：<span className="font-semibold">{material.required_count.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        所持数：<span className="font-semibold">{material.owned_count.toLocaleString()}</span>
                      </div>
                      {shortage > 0 && (
                        <div className="text-sm text-red-600 font-semibold">
                          不足：{shortage.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => onUpdateOwnedCount(material.id, -64)}
                        className="px-2 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
                        title="-64"
                      >
                        -64
                      </button>
                      <button
                        onClick={() => onUpdateOwnedCount(material.id, -1)}
                        className="px-2 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
                        title="-1"
                      >
                        -1
                      </button>
                      
                      {directInputId === material.id ? (
                        <input
                          type="number"
                          value={directInputValue}
                          onChange={(e) => setDirectInputValue(e.target.value)}
                          onBlur={() => submitDirectInput(material.id)}
                          onKeyPress={(e) => e.key === 'Enter' && submitDirectInput(material.id)}
                          className="w-20 px-2 py-1 text-sm border rounded"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handleDirectInput(material)}
                          className="px-3 py-1 text-sm bg-white border hover:bg-gray-50 rounded"
                        >
                          入力
                        </button>
                      )}
                      
                      <button
                        onClick={() => onUpdateOwnedCount(material.id, 1)}
                        className="px-2 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
                        title="+1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => onUpdateOwnedCount(material.id, 64)}
                        className="px-2 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
                        title="+64"
                      >
                        +64
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        表示中：{filteredMaterials.length} / {materials.length} 種類
      </p>
    </div>
  )
}
