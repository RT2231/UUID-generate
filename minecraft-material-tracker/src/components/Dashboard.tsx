import React from 'react';
import type { DashboardStats } from '../types';
import { Card, CardContent, Progress } from './ui';
import { Package, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  totalMaterials: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, totalMaterials }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              建築完成率
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.overallProgress.toFixed(1)}%
          </div>
          <Progress value={stats.overallProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              必要素材総数
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalRequired.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {totalMaterials} 種類の素材
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              所持素材総数
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {stats.totalOwned.toLocaleString()}
          </div>
          <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            不足：{stats.totalShortage.toLocaleString()}個
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              完了素材数
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.completedMaterials} / {totalMaterials}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            未完了：{stats.incompleteMaterials} 種類
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
