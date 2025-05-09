import React, { useEffect, useState } from 'react';
import { useFeed } from '../../hooks/useFeed';
import { FaRedditAlien } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import Layout from '../../components/User/layout/Layout';
import { RedditPostSelector } from '../../components/User/social/Redditpost';
import FeedActions from '../../components/User/feed/FeedActions';
import FeedList from '../../components/User/feed/DeedList';

const Feed: React.FC = () => {
  const [redditPostView, setRedditPostView] = useState<boolean>(false)
  function handleRedditPostViewClick(){
    setRedditPostView(true)
  }
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
    console.log('triggereing , fetch feed')
    fetchFeed();
  }, []);

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

  const handleReport = (data:any) => {
    console.log(data)
    reportItem(data, 'Inappropriate content');
    toast.success('Thankyou for your feedback. We will review and take the right decision.')
  };

  const hideRedditPosts = () => {
    setRedditPostView(false)
  }

  return (
    <Layout requireAuth>
      <div className="container mx-auto ">
        <h1 className="text-2xl font-bold mb-6 text-text-primary">Feed</h1>
        <div className=' pb-2 flex justify-end'>
            <button className='transition-all duration-150 bg-orange-500 rounded-3xl text-text-primary p-1 cursor-pointer hover:scale-102 px-2 font-bold flex justify-center items-center gap-2' onClick={handleRedditPostViewClick}>
               <FaRedditAlien className='text-3xl'/>Add post
            </button>
        </div>

       
        <div className={`transition-all duration-150 ${redditPostView ? 'scale-100': 'scale-0 hidden' } overflow-hidden`}>
                  <RedditPostSelector hide={hideRedditPosts}/>
        </div>
      
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