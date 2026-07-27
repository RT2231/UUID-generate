import React, { useState } from 'react'
import { useProjects } from '../hooks/useData'
import { Project } from '../types'

interface ProjectListProps {
  onSelectProject: (project: Project) => void
  onCreateProject: (name: string) => void
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, onCreateProject }) => {
  const { projects, loading, createProject, deleteProject } = useProjects()
  const [newProjectName, setNewProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!newProjectName.trim()) return
    
    // 仮のユーザー ID（実際には Supabase Auth から取得）
    const userId = 'local-user-' + Date.now()
    
    await createProject(newProjectName.trim(), userId)
    setNewProjectName('')
    setIsCreating(false)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('このプロジェクトを削除してもよろしいですか？')) {
      await deleteProject(id)
    }
  }

  if (loading) {
    return <div className="p-4">読み込み中...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">プロジェクト一覧</h2>
      
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          新規プロジェクト作成
        </button>
      )}

      {isCreating && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="プロジェクト名"
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            作成
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            キャンセル
          </button>
        </div>
      )}

      <div className="grid gap-2">
        {projects.length === 0 ? (
          <p className="text-gray-500">プロジェクトがありません</p>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  更新日：{new Date(project.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, project.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
