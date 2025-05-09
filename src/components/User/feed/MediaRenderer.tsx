import { FeedItem } from "../../../types/feed";

export function extractRedditMedia(redditPost:any) {
    // If the post already has the FeedItem format
    if (redditPost.media && Array.isArray(redditPost.media)) {
      return redditPost.media;
    }
    
    const post = redditPost.data || redditPost;
    const media:any[] = [];
    
    if (post.content && post.content.includes('reddit.com/link') && post.content.includes('/video/')) {
      // Extract the video ID from content text
      const videoMatch = post.content.match(/reddit\.com\/link\/[^\/]+\/video\/([^\/\n\s]+)/i);
      if (videoMatch && videoMatch[1]) {
        const videoId = videoMatch[1];
        media.push({
          type: 'video',
          url: `https://v.redd.it/${videoId}/DASH_720.mp4?source=fallback`
        });
        return media;
      }
    }
    
    if (post.is_video === true && post.media?.reddit_video?.fallback_url) {
      media.push({
        type: 'video',
        url: post.media.reddit_video.fallback_url
      });
      return media;
    }
    
    if (post.url && post.url.includes('v.redd.it')) {
      const videoId = post.url.split('/').pop();
      if (videoId) {
        media.push({
          type: 'video',
          url: `https://v.redd.it/${videoId}/DASH_720.mp4?source=fallback`
        });
        return media;
      }
    }
    
    if ((post.domain === 'youtube.com' || post.domain?.includes('youtu.be')) && post.url) {
      const videoId = extractYouTubeId(post.url);
      if (videoId) {
        media.push({
          type: 'video',
          url: `https://www.youtube-nocookie.com/embed/${videoId}`
        });
        return media;
      }
    }
    
    if (post.url && /\.(jpg|jpeg|png|gif)$/i.test(post.url)) {
      media.push({
        type: 'image',
        url: post.url
      });
      return media;
    }
    
    // CASE 5: For post.data.thumbnail (which your data shows is being used)
    if (post.thumbnail && 
        post.thumbnail !== 'self' && 
        post.thumbnail !== 'default' &&
        post.thumbnail.startsWith('http')) {
      // If we have a better URL from preview, use that instead
      if (post.preview?.images?.[0]?.source?.url) {
        let imageUrl = post.preview.images[0].source.url;
        // Reddit escapes HTML entities in URLs - we need to decode them
        imageUrl = imageUrl.replace(/&amp;/g, '&');
        
        media.push({
          type: 'image',
          url: imageUrl
        });
      } else {
        // Otherwise use the thumbnail
        media.push({
          type: 'image',
          url: post.thumbnail
        });
      }
      return media;
    }
  
    return media;
  }
  
  function extractYouTubeId(url:any) {
    // Handle standard YouTube URLs
    let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) return match[1];
    
    // Handle YouTube shorts
    match = url.match(/youtube\.com\/shorts\/([^?&\/\s]{11})/);
    if (match && match[1]) return match[1];
    
    return null;
  }
  
  /**
   * Process a Reddit post into a FeedItem format
   * @param {Object} redditPost - Raw Reddit post data
   * @returns {Object} Formatted FeedItem
   */
  export function processRedditPost(redditPost:any) {
    const post = redditPost.data || redditPost;
    
    // If it's already in the FeedItem format, just ensure media is properly handled
    if (post.id && post.source === 'reddit') {
      return {
        ...post,
        media: extractRedditMedia(post)
      };
    }
    
    // Otherwise convert from raw Reddit format to FeedItem
    return {
      id: post.id || post.name,
      source: 'reddit',
      sourceId: post.id || post.name,
      content: post.selftext || post.title || post.content || '',
      author: {
        name: post.author,
        avatar: '',
        username: post.author,
      },
      createdAt: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : new Date().toISOString(),
      media: extractRedditMedia(post),
      likes: post.ups || 0,
      comments: post.num_comments || 0,
      shares: post.num_crossposts || 0,
      isSaved: post.saved || false,
      isLiked: post.likes === true,
      platformData: {
        subreddit: post.subreddit || post.subreddit_name_prefixed || '',
        upvotes: post.ups || 0,
        numComments: post.num_comments || 0
      }
    };
  }

  export const handleRedirectToReddit = (feedItem: FeedItem) => {
    if (feedItem.source === 'reddit') {
      // Construct Reddit URL
      let redditUrl = '';
      // For user profiles
      if (feedItem.platformData?.subreddit?.startsWith('u/')) {
        redditUrl = `https://www.reddit.com/${feedItem.platformData.subreddit}/comments/${feedItem.sourceId}/`;
      } 
      // For subreddit posts
      else if (feedItem.platformData?.subreddit?.startsWith('r/')) {
        redditUrl = `https://www.reddit.com/${feedItem.platformData.subreddit}/comments/${feedItem.sourceId}/`;
      }
      // Fallback
      else {
        redditUrl = `https://www.reddit.com/comments/${feedItem.sourceId}/`;
      }
      
      // Open in new tab
      window.open(redditUrl, '_blank');
    }
  };





  export function convertToMediaPlayerFormat(post: any): FeedItem {
    // Map media URLs to the format expected by FeedItem
    const media = post.mediaUrls && post.mediaUrls.length > 0
      ? post.mediaUrls.map((url: string) => {
          // Use the same media type detection as backend
          const isVideo = url.includes('.mp4') || 
                          url.includes('.mov') || 
                          url.includes('video');
          
          return {
            type: isVideo ? 'video' : 'image',
            url: url
          };
        })
      : undefined;
    
    return {
      // Convert ID to string if it's an ObjectId
      id: typeof post._id === 'object' && post._id !== null ? post._id.toString() : post._id,
      source: post.platform,
      sourceId: post.platformPostId,
      // Combine title and content like the backend does
      content: post.title ? `${post.title}\n\n${post.content}` : post.content,
      author: {
        name: post.author?.name || '',
        avatar: post.author?.avatar || '',
        username: post.author?.username || ''
      },
      // Use postedAt if available, fall back to createdAt
      createdAt: post.postedAt ? 
        (post.postedAt instanceof Date ? post.postedAt.toISOString() : post.postedAt) : 
        post.createdAt,
      media: media,
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      // Set isSaved to true as the backend does
      isSaved: true,
      isLiked: false,
      platformData: post.platformData || {},
      // Convert userId to string if it's an ObjectId
      userId: typeof post.userId === 'object' && post.userId !== null ? 
        post.userId.toString() : post.userId
    };
  }

  
