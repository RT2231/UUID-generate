import React, { useState } from 'react';
import { Button, Input, Select } from './ui';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { FilterType, SortField, SortOrder } from '../types';

interface MaterialFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  availableTypes: string[];
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

export const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  availableTypes,
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="素材名または ID で検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value as FilterType)}
        className="w-full md:w-40"
      >
        <option value="all">すべて</option>
        <option value="shortage">不足のみ</option>
        <option value="completed">完了のみ</option>
        <option value="incomplete">未完了</option>
      </Select>

      {/* Type Filter */}
      <Select
        value={selectedType || ''}
        onChange={(e) => onTypeChange(e.target.value || null)}
        className="w-full md:w-40"
      >
        <option value="">全タイプ</option>
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      {/* Sort */}
      <div className="flex gap-2">
        <Select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="w-32"
        >
          <option value="name">名前</option>
          <option value="required_count">必要数</option>
          <option value="shortage">不足数</option>
          <option value="layer">レイヤー</option>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-10"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
