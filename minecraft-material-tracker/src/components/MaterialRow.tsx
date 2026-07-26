import React, { useState } from 'react';
import type { Material } from '../types';
import { formatStackDisplay, formatShulkerDisplay, calculateShortage, calculateProgress } from '../utils/helpers';
import { Button, Input, Badge } from './ui';
import { Plus, Minus, Save } from 'lucide-react';

interface MaterialRowProps {
  material: Material;
  onUpdateCount: (materialId: string, delta: number) => Promise<void>;
  onSetCount: (materialId: string, count: number) => Promise<void>;
}

export const MaterialRow: React.FC<MaterialRowProps> = ({
  material,
  onUpdateCount,
  onSetCount,
}) => {
  const [inputValue, setInputValue] = useState<string>(material.owned_count.toString());
  const shortage = calculateShortage(material);
  const progress = calculateProgress(material);
  const isComplete = shortage === 0 && material.required_count > 0;

  const handleDirectInput = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      onSetCount(material.id, value);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="col-span-3 text-left">
        <div className="font-medium text-gray-900 dark:text-gray-100">{material.name}</div>
        {material.item_id && (
          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {material.item_id}</div>
        )}
      </div>

      <div className="col-span-1 text-center">
        <Badge variant="default">L{material.layer}</Badge>
      </div>

      <div className="col-span-1 text-right">
        <div className="text-gray-900 dark:text-gray-100">{material.required_count.toLocaleString()}</div>
        <div className="text-xs text-gray-500">
          {formatStackDisplay(material.required_count, material.stack_size)}
        </div>
      </div>

      <div className="col-span-2">
        <form onSubmit={handleDirectInput} className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateCount(material.id, -64)}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateCount(material.id, -1)}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleDirectInput}
            className="h-8 w-20 text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateCount(material.id, 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateCount(material.id, 64)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Save className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-xs text-gray-500 mt-1">
          {formatStackDisplay(material.owned_count, material.stack_size)}
        </div>
      </div>

      <div className="col-span-1 text-right">
        <div className={`font-medium ${shortage > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {shortage.toLocaleString()}
        </div>
      </div>

      <div className="col-span-1 text-right text-xs text-gray-500">
        {formatShulkerDisplay(material.owned_count, material.stack_size)}
      </div>

      <div className="col-span-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium w-10 text-right">
            {progress.toFixed(0)}%
          </span>
        </div>
        {isComplete && (
          <Badge variant="success" className="mt-1">完了</Badge>
        )}
      </div>
    </div>
  );
};
