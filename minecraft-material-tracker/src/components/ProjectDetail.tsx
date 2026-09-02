import React, { useState } from 'react'
import type { Project } from '../types'
import { CSVImporter } from './CSVImporter'
import { Dashboard } from './Dashboard'
import { MaterialList } from './MaterialList'
import { LayerPanel } from './LayerPanel'
import { useMaterials, useLayerProgress, useDashboardStats } from '../hooks/useData'

export const ProjectDetail: React.FC<{
  project: Project
  onBack: () => void
}> = ({ project, onBack }) => {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const {
    materials,
    loading,
    updateMaterialOwnedCount,
    setMaterialOwnedCount,
  } = useMaterials(project.id)
  
  const layerProgress = useLayerProgress(materials)
  const stats = useDashboardStats(materials)


  if (loading) {
    return <div className="p-4">読み込み中...</div>
  }

  return (
    <div className="flex h-screen">
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="p-4 border-b bg-white">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={onBack}
                className="text-blue-600 hover:underline mb-2"
              >
                ← プロジェクト一覧に戻る
              </button>
              <h1 className="text-2xl font-bold">{project.name}</h1>
            </div>
          </div>
        </div>

        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* ダッシュボード */}
          <Dashboard stats={stats} />

          {/* CSV インポート */}
          <div className="p-4">
            <CSVImporter
              projectId={project.id}
              onImportComplete={handleImportComplete}
            />
          </div>

          {/* 素材リスト */}
          <MaterialList
            materials={materials}
            onUpdateOwnedCount={updateMaterialOwnedCount}
            onSetOwnedCount={setMaterialOwnedCount}
            selectedLayer={selectedLayer}
          />
        </div>
      </div>

      {/* レイヤーパネル（サイドバー） */}
      <LayerPanel
        layerProgress={layerProgress}
        selectedLayer={selectedLayer}
        onSelectLayer={setSelectedLayer}
      />
    </div>
  )
}
