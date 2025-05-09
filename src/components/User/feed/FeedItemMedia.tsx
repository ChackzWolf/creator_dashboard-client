// DeedCard.tsx or wherever you render the Reddit items
import { useState, useEffect } from 'react';
import { extractRedditMedia } from './MediaRenderer';
import { FeedItem } from '../../../types/feed';

// This component handles the rendering of media for your feed items
export const MediaRenderer = ({ feedItem }:{feedItem:FeedItem}) => {
  const [mediaError, setMediaError] = useState(false);
  const [media, setMedia] = useState(feedItem.media || []);
  // Process the media on mount and when feedItem changes
  useEffect(() => {
    // Only reprocess if there's no media or if the "under a tree" issue
    if (!feedItem.media || 
        (feedItem.content && 
         feedItem.content.includes('under a tree') && 
         feedItem.content.includes('reddit.com/link'))) {
      
      // Extract media properly from the feed item
      const extractedMedia = extractRedditMedia(feedItem);
      setMedia(extractedMedia);
    } else {
      setMedia(feedItem.media || []);
    }
    
    // Reset error state when item changes
    setMediaError(false);
  }, [feedItem]);
  
  // If there's no media or we had an error, don't render anything
  if (mediaError || !media || media.length === 0) {
    console.log('Triggered error',"MediaError:", mediaError,'media: ',  media,  "media:length",media.length === 0)
    return null;
  }
  
  return (
    <div className="mt-3 space-y-2 h-70 "> 
      {media.map((mediaItem, index) => (
        <div key={`${feedItem.id}-media-${index}`} className="relative rounded-lg overflow-hidden h-full">
          {mediaItem.type === 'image' ? (
            <img 
              src={mediaItem.url} 
              alt="" 
              className="w-full object-cover h-full"
              onError={() => setMediaError(true)}
            />
          ) : mediaItem.url.includes('youtube.com/embed') ? (
            <iframe
              src={mediaItem.url}
              className="w-full aspect-video"
              title="YouTube video"
              allowFullScreen
              frameBorder="0"
              onError={() => setMediaError(true)}
            />
          ) : (
            <video 
              src={mediaItem.url} 
              controls 
              className="w-full"
              onError={() => setMediaError(true)}
            />
          )}
        </div>
      ))}
    </div>
  );
};