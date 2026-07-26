import React from 'react';
import type { LayerStats } from '../types';
import { Card, CardContent, Badge, Progress } from './ui';
import { Layers, CheckCircle } from 'lucide-react';

interface LayerPanelProps {
  layerStats: LayerStats[];
  selectedLayer: number | null;
  onSelectLayer: (layer: number | null) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layerStats,
  selectedLayer,
  onSelectLayer,
}) => {
  return (
    <Card className="mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">レイヤー管理</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          レイヤーを選択して素材をフィルター
        </p>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onSelectLayer(null)}
            className={`p-3 rounded-lg border transition-all ${
              selectedLayer === null
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-sm font-medium">すべて</div>
            <div className="text-xs text-gray-500">{layerStats.length} レイヤー</div>
          </button>
          
          {layerStats.map((stat) => (
            <button
              key={stat.layer}
              onClick={() => onSelectLayer(stat.layer)}
              className={`p-3 rounded-lg border transition-all relative ${
                selectedLayer === stat.layer
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">L{stat.layer}</span>
                {stat.isComplete && (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <Progress value={stat.progress} className="h-1.5 mb-1" />
              <div className="text-xs text-gray-500">
                {stat.totalOwned.toLocaleString()} / {stat.totalRequired.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
