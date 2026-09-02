import React from 'react'
import type { DashboardStats } from '../types'

interface DashboardProps {
  stats: DashboardStats
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ダッシュボード</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="必要素材総数"
          value={stats.totalRequired.toLocaleString()}
          unit="個"
          color="blue"
        />
        <StatCard
          title="所持素材総数"
          value={stats.totalOwned.toLocaleString()}
          unit="個"
          color="green"
        />
        <StatCard
          title="不足素材総数"
          value={stats.totalShortage.toLocaleString()}
          unit="個"
          color="red"
        />
        <StatCard
          title="完了素材数"
          value={stats.completedMaterials.toLocaleString()}
          unit="種類"
          color="emerald"
        />
        <StatCard
          title="未完了素材数"
          value={stats.incompleteMaterials.toLocaleString()}
          unit="種類"
          color="orange"
        />
        <StatCard
          title="建築完成率"
          value={stats.overallProgress.toString()}
          unit="%"
          color="purple"
        />
      </div>

      {/* 全体進捗バー */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">全体進捗</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${stats.overallProgress}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">
          {stats.overallProgress}% 完了
        </p>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  unit: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color] || 'bg-gray-50'}`}>
      <p className="text-xs font-medium opacity-75">{title}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </p>
    </div>
  )
}
