import React from 'react';
import { FeedFilters, FeedSource } from '../../types/feed';

interface FeedActionsProps {
  filters: FeedFilters;
  sources: FeedSource[];
  onFiltersChange: (filters: Partial<FeedFilters>) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const FeedActions: React.FC<FeedActionsProps> = ({
  filters,
  sources,
  onFiltersChange,
  onRefresh,
  isLoading,
}) => {
  const handleSourceToggle = (sourceName: FeedSource['name']) => {
    const updatedSources = filters.sources.includes(sourceName)
      ? filters.sources.filter((s) => s !== sourceName)
      : [...filters.sources, sourceName];
    
    onFiltersChange({ sources: updatedSources });
  };

  return (
    <div className="bg-shell rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-text-secondary">Sources:</span>
          <div className="flex space-x-2">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceToggle(source.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.sources.includes(source.name)
                    ? 'bg-text-secondary text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as FeedFilters['sortBy'] })}
            className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
          
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`p-2 rounded text-indigo-600 hover:bg-indigo-50 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedActions;