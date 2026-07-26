import { useState } from 'react'
import './App.css'
import { ProjectList, ProjectDetail } from './components/ProjectViews'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!selectedProjectId ? (
        <ProjectList onSelectProject={setSelectedProjectId} />
      ) : (
        <ProjectDetail 
          projectId={selectedProjectId} 
          onBack={() => setSelectedProjectId(null)} 
        />
      )}
    </div>
  )
}

export default App
