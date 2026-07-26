import React, { useRef } from 'react';
import { Button } from './ui';
import { Upload, FileText } from 'lucide-react';
import { parseCSV, parseTXT } from '../utils/helpers';
import { Material } from '../types';

interface CSVImporterProps {
  onImport: (materials: Material[]) => void;
}

export const CSVImporter: React.FC<CSVImporterProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let materials: Material[] = [];

      if (file.name.endsWith('.csv')) {
        materials = parseCSV(content);
      } else if (file.name.endsWith('.txt')) {
        materials = parseTXT(content);
      }

      if (materials.length > 0) {
        onImport(materials);
      } else {
        alert('有効なデータが見つかりませんでした。');
      }
    };

    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        CSV/TXT ファイルをインポート
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Bloxelizer が出力した CSV または TXT ファイルを読み込みます
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileSelect}
        className="hidden"
        id="csv-import"
      />
      <Button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2">
        <FileText className="h-4 w-4" />
        ファイルを選択
      </Button>
      <div className="mt-4 text-xs text-gray-500">
        対応フォーマット：Bloxelizer CSV, Bloxelizer TXT
      </div>
    </div>
  );
};
