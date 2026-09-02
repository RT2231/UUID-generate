import React, { useState, useRef } from 'react'
import { useMaterials } from '../hooks/useData'
import { parseBloxelizerCSV } from '../utils/calculations'

interface CSVImporterProps {
  projectId: string
  onImportComplete: () => void
}

export const CSVImporter: React.FC<CSVImporterProps> = ({ projectId, onImportComplete }) => {
  const { importMaterials } = useMaterials(projectId)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setError(null)

    try {
      const text = await file.text()
      const parsedData = parseBloxelizerCSV(text)

      if (parsedData.length === 0) {
        throw new Error('有効なデータが見つかりませんでした')
      }

      await importMaterials(parsedData)
      onImportComplete()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'インポートに失敗しました')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">CSV/TXT インポート</h3>
      <p className="text-sm text-gray-600 mb-4">
        Bloxelizer が出力した CSV または TXT ファイルをインポートします
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileSelect}
        disabled={isImporting}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {isImporting && (
        <p className="mt-2 text-blue-600">インポート中...</p>
      )}

      {error && (
        <p className="mt-2 text-red-600">{error}</p>
      )}
    </div>
  )
}
