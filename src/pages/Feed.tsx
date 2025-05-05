import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import FeedList from '../components/feed/DeedList';
import FeedActions from '../components/feed/FeedActions';
import { useFeed } from '../hooks/useFeed';

const Feed: React.FC = () => {
  const {
    items,
    isLoading,
    fetchFeed,
    saveItem,
    unsaveItem,
    reportItem,
    sources,
    currentFilters,
    updateFilters,
  } = useFeed();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleFiltersChange = (newFilters: Partial<typeof currentFilters>) => {
    updateFilters(newFilters);
    fetchFeed({ ...currentFilters, ...newFilters });
  };

  const handleShare = (itemId: string) => {
    // Copy link to clipboard
    const item = items.find(i => i.id === itemId);
    if (item) {
      navigator.clipboard.writeText(`${window.location.origin}/feed/${itemId}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = (itemId: string) => {
    reportItem(itemId, 'Inappropriate content');
    alert('Thank you for reporting. We will review this content.');
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Feed</h1>
        
        <FeedActions
          filters={currentFilters}
          sources={sources}
          onFiltersChange={handleFiltersChange}
          onRefresh={() => fetchFeed(currentFilters)}
          isLoading={isLoading}
        />
        
        <FeedList
          items={items}
          onSave={saveItem}
          onUnsave={unsaveItem}
          onShare={handleShare}
          onReport={handleReport}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Feed;