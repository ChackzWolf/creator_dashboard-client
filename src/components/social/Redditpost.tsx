import React, { useState, useEffect } from 'react';
import { FeedItem, ApiResponse } from '../../types/feed'; // Import your types
import api from '../../utils/api';

interface RedditPost {
  kind: string;
  data: {
    id: string;
    title: string;
    selftext: string;
    subreddit_name_prefixed: string;
    author: string;
    created_utc: number;
    thumbnail: string;
    url: string;
    permalink: string;
    is_video: boolean;
    media?: {
      reddit_video?: {
        fallback_url: string;
      }
    };
    preview?: {
      images: Array<{
        source: {
          url: string;
        };
      }>;
    };
    ups: number;
    num_comments: number;
  };
}

interface RedditPostSelectorProps {
  hide: () => void;
  onPostsSaved?: () => void;

}

export const RedditPostSelector: React.FC<RedditPostSelectorProps> = ({ hide, onPostsSaved }) => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Record<string, boolean>>({});
  useEffect(() => {
    fetchRedditPosts();
  }, []);

  const fetchRedditPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<RedditPost[]>>(`/user/RedditPosts`);

      if (response.data.success && response.data.data) {
        setPosts(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch posts");
      }
    } catch (err: any) {
      console.error("Error fetching Reddit posts:", err);
      setError(err.response?.data?.message || "Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  const togglePostSelection = (postId: string): void => {
    setSelectedPosts(prev => ({
      [postId]: !prev[postId]
    }));
  };

  // Transform Reddit post to FeedItem format
  const transformToFeedItem = (post: RedditPost): Partial<FeedItem> => {
    // Process media
    const media: { type: 'image' | 'video'; url: string }[] = [];

    // Add video if available
    if (post.data.is_video && post.data.media?.reddit_video?.fallback_url) {
      media.push({
        type: 'video',
        url: post.data.media.reddit_video.fallback_url
      });
    }
    // Add image if available
    else if (post.data.url &&
      (post.data.url.endsWith('.jpg') ||
        post.data.url.endsWith('.png') ||
        post.data.url.endsWith('.gif'))) {
      media.push({
        type: 'image',
        url: post.data.url
      });
    }
    // Add thumbnail if it exists and no other media
    else if (post.data.thumbnail &&
      post.data.thumbnail !== 'self' &&
      post.data.thumbnail !== 'default') {
      media.push({
        type: 'image',
        url: post.data.thumbnail
      });
    }

    return {
      sourceId: post.data.id,
      source: 'reddit',
      content: post.data.title + (post.data.selftext ? '\n\n' + post.data.selftext : ''),
      author: {
        name: post.data.author,
        username: post.data.author
      },
      createdAt: new Date(post.data.created_utc * 1000).toISOString(),
      media: media.length > 0 ? media : undefined,
      likes: 0, // Start with 0 on your platform
      comments: 0, // Start with 0 on your platform
      shares: 0 // Start with 0 on your platform
    };
  };

  const saveSelectedPosts = async (): Promise<void> => {
    const selectedPostIds = Object.keys(selectedPosts).filter(id => selectedPosts[id]);

    if (selectedPostIds.length === 0) {
      alert("Please select at least one post to save");
      return;
    }

    setLoading(true);

    try {
      // Save each selected post
      for (const postId of selectedPostIds) {
        const post = posts.find(p => p.data.id === postId);

        if (post) {
          // Convert Reddit post to FeedItem format
          const feedItem = transformToFeedItem(post);
          console.log(feedItem, 'feed item')
          // Process media URLs
          const mediaUrls: string[] = [];

          // Add video if available
          if (post.data.is_video && post.data.media?.reddit_video?.fallback_url) {
            mediaUrls.push(post.data.media.reddit_video.fallback_url);
          }
          // Add image if available
          else if (post.data.url &&
            (post.data.url.endsWith('.jpg') ||
              post.data.url.endsWith('.png') ||
              post.data.url.endsWith('.gif'))) {
            mediaUrls.push(post.data.url);
          }
          // Add thumbnail if it exists and no other media
          else if (post.data.thumbnail &&
            post.data.thumbnail !== 'self' &&
            post.data.thumbnail !== 'default') {
            mediaUrls.push(post.data.thumbnail);
          }

          // Create data object according to your schema
          const postData = {
            platformPostId: post.data.id,
            platform: 'reddit',
            title: post.data.title,
            content: post.data.selftext || '',
            author: {
              name: post.data.author,
              username: post.data.author,
              avatar: null // Reddit doesn't include avatar in post data
            },
            mediaUrls,
            platformUrl: `https://reddit.com${post.data.permalink}`,
            postedAt: new Date(post.data.created_utc * 1000).toISOString(),
            platformData: {
              subreddit: post.data.subreddit_name_prefixed,
              upvotes: post.data.ups,
              numComments: post.data.num_comments
            },
            likes: 0,
            comments: 0,
            shares: 0
          };

          // Send to your backend API
          await api.post('/socialAuth/reddit/post', postData);
        }
      }

      // Clear selections after saving
      setSelectedPosts({});

      if (onPostsSaved) {
        onPostsSaved();
      }

      alert("Posts saved successfully!");
    } catch (err: any) {
      console.error("Error saving posts:", err);
      setError("Failed to save selected posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4  transition-all duration-300">
      <div className='flex items-center justify-between '>
        <h2 className="text-xl font-bold text-text-primary">Your Reddit Posts</h2>
        <button onClick={hide} className='text-text-primary  cursor-pointer'>Close</button>
      </div>


      {posts.length === 0 ? (
        <p className='text-text-secondary'>No Reddit posts found. Create some posts on Reddit first!</p>
      ) : (
        <>
          <p className="mb-4 text-text-secondary">Select posts you'd like to add to your feed:</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6  ">
            {posts.map(post => (
              <div
                key={post.data.id}
                className={`transition-all duration-150 p-4 border rounded-xl cursor-pointer ${selectedPosts[post.data.id]
                    ? ' bg-gray-500'
                    : 'border-gray-200'
                  }`}
                onClick={() => togglePostSelection(post.data.id)}
              >
                <h3 className="font-bold text-text-primary">{post.data.title}</h3>
                <p className="text-sm  mt-1 text-text-secondary">
                  {post.data.subreddit_name_prefixed} • {post.data.ups} upvotes • {post.data.num_comments} comments
                </p>

                {post.data.thumbnail && post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default' && (
                  <img
                    src={post.data.thumbnail}
                    alt="Post thumbnail"
                    className="mt-2 h-40 rounde-md object-cover w-full"
                  />
                )}

                {post.data.selftext && (
                  <div className="mt-2 text-sm text-gray-700">
                    {post.data.selftext.substring(0, 100)}
                    {post.data.selftext.length > 100 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded ${Object.values(selectedPosts).filter(Boolean).length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary border border-text-secondary text-white hover:bg-primary-hover cursor-pointer'
                }`}
              onClick={saveSelectedPosts}
              disabled={Object.values(selectedPosts).filter(Boolean).length === 0 || loading}
            >
              {loading ? 'Saving...' : 'Add selected post'}
            </button>

            <button
              className="px-4 py-2 bg-secondary text-text-primary rounded hover:bg-secondary-hover border border-text-secondary cursor-pointer"
              onClick={fetchRedditPosts}
              disabled={loading}
            >
              Refresh Posts
            </button>
          </div>
        </>
      )}
    </div>
  );
};

