import api from '../utils/api';
import { FeedItem, FeedFilters, FeedSource, ApiResponse } from '../types/feed';

export const getFeedItems = async (filters?: FeedFilters): Promise<FeedItem[]> => {
  console.log('sending api', filters)
  const response = await api.get<ApiResponse<FeedItem[]>>('/socialAuth/feed', { params: filters });
  console.log(response, 'response itesm')
  return response.data.data || [];
};

export const getSavedFeedItems = async (): Promise<FeedItem[]> => {
  const response = await api.get<ApiResponse<FeedItem[]>>('/feed/saved');
  return response.data.data || [];
};

export const saveFeedItem = async (feedItemId: string): Promise<boolean> => {
  const response = await api.post<ApiResponse<boolean>>(`/socialAuth/feed/${feedItemId}/save`);
  return response.data.success;
};

export const unsaveFeedItem = async (feedItemId: string): Promise<boolean> => {
  const response = await api.delete<ApiResponse<boolean>>(`/socialAuth/feed/${feedItemId}/save`);
  return response.data.success;
};

export const reportFeedItem = async (feedItemId: string, reason: string): Promise<boolean> => {
  const response = await api.post<ApiResponse<boolean>>(`/socialAuth/feed/${feedItemId}/report`, { reason });
  return response.data.success;
};

export const getFeedSources = async (): Promise<FeedSource[]> => {
  const response = await api.get<ApiResponse<FeedSource[]>>('/socialAuth/feed/sources');
  return response.data.data || [];
};

export const toggleFeedSource = async (sourceId: string, enabled: boolean): Promise<boolean> => {
  const response = await api.put<ApiResponse<boolean>>(`/socialAuth/feed/sources/${sourceId}`, { enabled });
  return response.data.success;
};
