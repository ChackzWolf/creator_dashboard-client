import React from 'react';
import FeedCard from './FeedCard';
import { FeedItem } from '../../../types/feed';

interface FeedListProps {
  items: FeedItem[];
  onSave?: (itemId: string) => void;
  onUnsave?: (itemId: string) => void;
  onShare?: (itemId: string) => void;
  onReport?: (data: any) => void;
  isLoading: boolean;
}

const FeedList: React.FC<FeedListProps> = ({
  items,
  onSave,
  onUnsave,
  onShare,
  onReport,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        No content available. Try adjusting your filters or check back later.
      </div>
    );
  }
console.log(items[0], 'items')
  return (
    <div className="flex mt-3 gap-5 flex-wrap justify-self-center  ">
      {items.map((item) => (
        <FeedCard
          key={item.id}
          item={item}
          onSave={onSave}
          onUnsave={onUnsave}
          onShare={onShare}
          onReport={onReport}
        />
      ))}
    </div>
  );
};

export default FeedList;