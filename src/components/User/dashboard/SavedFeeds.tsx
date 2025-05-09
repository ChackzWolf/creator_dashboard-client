import React from 'react';
import { FeedItem } from '../../../types/feed';
import FeedCard from '../feed/FeedCard';

interface SavedFeedsProps {
  items: FeedItem[];
  isLoading: boolean;
  onUnsave: (itemId: string) => void;
}

const SavedFeeds: React.FC<SavedFeedsProps> = ({ items, isLoading, onUnsave }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Saved Content</h3>
      
      <div className="space-y-4">
        {items.slice(0, 3).map((item) => (
          <FeedCard 
            key={item.id} 
            item={item} 
            onSave={() => {}} // Already saved
            onUnsave={() => onUnsave(item.id)}
            onShare={() => {}}
            onReport={() => {}}
            compact={true}
          />
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't saved any content yet</p>
            <p className="mt-2 text-sm">Browse the feed to discover and save interesting content</p>
          </div>
        )}
        
        {items.length > 3 && (
          <div className="text-center mt-4">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All ({items.length}) Saved Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFeeds;