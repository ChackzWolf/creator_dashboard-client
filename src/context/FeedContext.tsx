import React, { createContext, useReducer, useEffect } from 'react';
import { FeedState, FeedItem, FeedFilters, FeedSource } from '../types/feed';
import { 
  getFeedItems, 
  getSavedFeedItems, 
  saveFeedItem, 
  unsaveFeedItem, 
  reportFeedItem, 
  getFeedSources,
  toggleFeedSource 
} from '../api/feed';
import { useAuth } from '../hooks/useAuth';

interface FeedContextType extends FeedState {
  fetchFeed: (filters?: FeedFilters) => Promise<void>;
  fetchSavedItems: () => Promise<void>;
  saveItem: (itemId: string) => Promise<void>;
  unsaveItem: (itemId: string) => Promise<void>;
  reportItem: (itemId: string, reason: string) => Promise<void>;
  sources: FeedSource[];
  fetchSources: () => Promise<void>;
  toggleSource: (sourceId: string, enabled: boolean) => Promise<void>;
  currentFilters: FeedFilters;
  updateFilters: (filters: Partial<FeedFilters>) => void;
}

const initialState: FeedState = {
  items: [],
  isLoading: false,
  error: null,
  savedItems: [],
};

const initialFilters: FeedFilters = {
  sources: ['twitter', 'reddit', 'linkedin'],
  sortBy: 'recent',
};

type FeedAction =
  | { type: 'FETCH_START' | 'FETCH_SAVED_START' | 'FETCH_SOURCES_START' }
  | { type: 'FETCH_SUCCESS'; payload: FeedItem[] }
  | { type: 'FETCH_SAVED_SUCCESS'; payload: string[] }
  | { type: 'FETCH_SOURCES_SUCCESS'; payload: FeedSource[] }
  | { type: 'FETCH_ERROR' | 'FETCH_SAVED_ERROR' | 'FETCH_SOURCES_ERROR'; payload: string }
  | { type: 'SAVE_ITEM'; payload: string }
  | { type: 'UNSAVE_ITEM'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FeedFilters> };

interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  error: string | null;
  savedItems: string[];
}

interface FeedStateExtended extends FeedState {
  sources: FeedSource[];
  currentFilters: FeedFilters;
}

const feedReducer = (state: FeedStateExtended, action: FeedAction): FeedStateExtended => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'FETCH_SAVED_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SAVED_SUCCESS':
      return {
        ...state,
        savedItems: action.payload,
        isLoading: false,
      };
    case 'FETCH_SAVED_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SAVE_ITEM':
      return {
        ...state,
        savedItems: [...state.savedItems, action.payload],
        items: state.items.map(item =>
          item.id === action.payload ? { ...item, isSaved: true } : item
        ),
      };
    case 'UNSAVE_ITEM':
      return {
        ...state,
        savedItems: state.savedItems.filter(id => id !== action.payload),
        items: state.items.map(item =>
          item.id === action.payload ? { ...item, isSaved: false } : item
        ),
      };
    case 'FETCH_SOURCES_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'FETCH_SOURCES_SUCCESS':
      return {
        ...state,
        sources: action.payload,
        isLoading: false,
      };
    case 'FETCH_SOURCES_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        currentFilters: {
          ...state.currentFilters,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const FeedContext = createContext<FeedContextType>({
  ...initialState,
  fetchFeed: async () => {},
  fetchSavedItems: async () => {},
  saveItem: async () => {},
  unsaveItem: async () => {},
  reportItem: async () => {},
  sources: [],
  fetchSources: async () => {},
  toggleSource: async () => {},
  currentFilters: initialFilters,
  updateFilters: () => {},
});

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(feedReducer, { 
    ...initialState, 
    sources: [], 
    currentFilters: initialFilters 
  });

  const fetchFeed = async (filters?: FeedFilters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const filtersToUse = filters || state.currentFilters;
      const items = await getFeedItems(filtersToUse);
      dispatch({ type: 'FETCH_SUCCESS', payload: items });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  const fetchSavedItems = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'FETCH_SAVED_START' });
    try {
      const items = await getSavedFeedItems();
      dispatch({ 
        type: 'FETCH_SAVED_SUCCESS', 
        payload: items.map(item => item.id)
      });
    } catch (error) {
      dispatch({ type: 'FETCH_SAVED_ERROR', payload: error.message });
    }
  };

  const saveItem = async (itemId: string) => {
    try {
      await saveFeedItem(itemId);
      dispatch({ type: 'SAVE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const unsaveItem = async (itemId: string) => {
    try {
      await unsaveFeedItem(itemId);
      dispatch({ type: 'UNSAVE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Error unsaving item:', error);
    }
  };

  const reportItem = async (itemId: string, reason: string) => {
    try {
      await reportFeedItem(itemId, reason);
      // No need to update state here, just notify user
    } catch (error) {
      console.error('Error reporting item:', error);
    }
  };

  const fetchSources = async () => {
    dispatch({ type: 'FETCH_SOURCES_START' });
    try {
      const sources = await getFeedSources();
      dispatch({ type: 'FETCH_SOURCES_SUCCESS', payload: sources });
    } catch (error) {
      dispatch({ type: 'FETCH_SOURCES_ERROR', payload: error.message });
    }
  };

  const toggleSource = async (sourceId: string, enabled: boolean) => {
    try {
      await toggleFeedSource(sourceId, enabled);
      // Refresh sources after toggle
      fetchSources();
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const updateFilters = (filters: Partial<FeedFilters>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedItems();
      fetchSources();
    }
  }, [isAuthenticated]);

  return (
    <FeedContext.Provider
      value={{
        ...state,
        fetchFeed,
        fetchSavedItems,
        saveItem,
        unsaveItem,
        reportItem,
        sources: state.sources || [],
        fetchSources,
        toggleSource,
        currentFilters: state.currentFilters,
        updateFilters,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};