import React from 'react'
import type { LayerProgress } from '../types'

interface LayerPanelProps {
  layerProgress: LayerProgress[]
  selectedLayer: number | null
  onSelectLayer: (layer: number | null) => void
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layerProgress,
  selectedLayer,
  onSelectLayer,
}) => {
  if (layerProgress.length === 0) {
    return null
  }

  return (
    <div className="p-4 border-l bg-gray-50">
      <h3 className="font-bold mb-3">レイヤー管理</h3>
      
      <button
        onClick={() => onSelectLayer(null)}
        className={`w-full mb-2 p-2 text-left rounded transition-colors ${
          selectedLayer === null
            ? 'bg-blue-100 border-blue-300 border'
            : 'bg-white hover:bg-gray-100 border'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold">すべて</span>
        </div>
      </button>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {layerProgress.map(lp => (
          <button
            key={lp.layer}
            onClick={() => onSelectLayer(lp.layer)}
            className={`w-full p-2 text-left rounded transition-colors ${
              selectedLayer === lp.layer
                ? 'bg-blue-100 border-blue-300 border'
                : 'bg-white hover:bg-gray-100 border'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">Layer {lp.layer}</span>
              <span className="text-sm text-gray-600">
                {lp.completedMaterials}/{lp.totalMaterials}
              </span>
            </div>
            
            {/* 進捗バー */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  lp.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${lp.progress}%` }}
              />
            </div>
            
            <div className="mt-1 text-xs text-gray-600 flex justify-between">
              <span>{lp.progress}%</span>
              <span>{lp.totalOwned.toLocaleString()} / {lp.totalRequired.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
