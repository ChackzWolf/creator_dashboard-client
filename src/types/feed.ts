export interface FeedSource {
    id: string;
    name: 'twitter' | 'reddit' | 'linkedin';
    enabled: boolean;
  }
  
  export interface FeedItem {
    id: string;
    source: FeedSource['name'];
    sourceId: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
      username?: string;
    };
    createdAt: string;
    media?: {
      type: 'image' | 'video';
      url: string;
    }[];
    likes: number;
    comments: number;
    shares: number;
    isSaved: boolean;
    isLiked: boolean;
    platformData:any
    userId:string
  }
  
  export interface FeedState {
    items: FeedItem[];
    isLoading: boolean;
    error: string | null;
    savedItems: string[];
  }
  
  export interface FeedFilters {
    sources: FeedSource['name'][];
    sortBy: 'recent' | 'popular';
  }

  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }