import React, { useState } from 'react';
import { useProjects, useMaterials } from '../hooks/useData';
import { calculateDashboardStats, calculateLayerStats, filterAndSortMaterials } from '../utils/stats';
import { Dashboard } from './Dashboard';
import { LayerPanel } from './LayerPanel';
import { MaterialFilters } from './MaterialFilters';
import { MaterialRow } from './MaterialRow';
import { CSVImporter } from './CSVImporter';
import { Button, Input, Card, CardContent } from './ui';
import { Plus, Trash2, ArrowLeft, Home } from 'lucide-react';
import { FilterType, SortField, SortOrder } from '../types';

// Temporary user ID for local development
const TEMP_USER_ID = 'local-user-001';

export const ProjectList: React.FC<{
  onSelectProject: (projectId: string) => void;
}> = ({ onSelectProject }) => {
  const { projects, loading, createProject, deleteProject } = useProjects(TEMP_USER_ID);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    const project = await createProject(newProjectName.trim());
    onSelectProject(project.id);
    setNewProjectName('');
  };

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Minecraft Material Tracker
      </h1>

      {/* Create New Project */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">新規プロジェクト作成</h2>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="プロジェクト名"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              作成
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">プロジェクト一覧</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            プロジェクトがありません。新規作成してください。
          </p>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      作成日：{new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onSelectProject(project.id)}>
                      開く
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm('本当に削除しますか？')) {
                          deleteProject(project.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export const ProjectDetail: React.FC<{
  projectId: string;
  onBack: () => void;
}> = ({ projectId, onBack }) => {
  const { materials, loading, updateCount, setCount, importMaterials } = useMaterials(projectId);
  
  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Calculate stats
  const dashboardStats = calculateDashboardStats(materials);
  const layerStats = calculateLayerStats(materials);

  // Get unique types
  const availableTypes = Array.from(new Set(materials.map(m => m.type).filter(Boolean)));

  // Filter and sort materials
  const filteredMaterials = filterAndSortMaterials(
    materials,
    searchQuery,
    filterType,
    selectedLayer,
    selectedType,
    sortField,
    sortOrder
  );

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">プロジェクト</h1>
      </div>

      {/* Dashboard */}
      <Dashboard stats={dashboardStats} totalMaterials={materials.length} />

      {/* Layer Panel */}
      {layerStats.length > 0 && (
        <LayerPanel
          layerStats={layerStats}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />
      )}

      {/* CSV Import */}
      {materials.length === 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CSVImporter onImport={importMaterials} />
          </CardContent>
        </Card>
      )}

      {/* Re-import button */}
      {materials.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">CSV 再インポート</h3>
            <CSVImporter onImport={importMaterials} />
            <p className="text-xs text-gray-500 mt-4">
              ※ 再インポート時は所持数が維持され、設計変更のみが反映されます
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {materials.length > 0 && (
        <>
          <MaterialFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            availableTypes={availableTypes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />

          {/* Materials List */}
          <Card>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-3">素材名</div>
                <div className="col-span-1 text-center">レイヤー</div>
                <div className="col-span-1 text-right">必要数</div>
                <div className="col-span-2">所持数</div>
                <div className="col-span-1 text-right">不足</div>
                <div className="col-span-1 text-right">シュルカー</div>
                <div className="col-span-2">進捗</div>
              </div>
            </div>
            <div>
              {filteredMaterials.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  onUpdateCount={updateCount}
                  onSetCount={setCount}
                />
              ))}
            </div>
            {filteredMaterials.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                表示する素材がありません
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
