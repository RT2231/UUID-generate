import React, { useState } from 'react'
import type { Project } from '../types'
import { ProjectList } from './ProjectList'
import { ProjectDetail } from './ProjectDetail'

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="min-h-screen bg-gray-100">
      {selectedProject ? (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-800">
                Minecraft Material Tracker
              </h1>
              <p className="text-gray-600 mt-2">
                Bloxelizer で設計した建築プロジェクトの素材を管理
              </p>
            </div>
            
            <ProjectList
              onSelectProject={setSelectedProject}
              onCreateProject={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
