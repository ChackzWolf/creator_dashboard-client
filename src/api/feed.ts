import api from '../utils/api';
import { FeedItem, FeedFilters, FeedSource, ApiResponse } from '../types/feed';

export const getFeedItems = async (filters?: FeedFilters): Promise<FeedItem[]> => {
  const response = await api.get<ApiResponse<FeedItem[]>>('/feed', { params: filters });
  return response.data.data || [];
};

export const getSavedFeedItems = async (): Promise<FeedItem[]> => {
  const response = await api.get<ApiResponse<FeedItem[]>>('/feed/saved');
  return response.data.data || [];
};

export const saveFeedItem = async (feedItemId: string): Promise<boolean> => {
  const response = await api.post<ApiResponse<boolean>>(`/feed/${feedItemId}/save`);
  return response.data.success;
};

export const unsaveFeedItem = async (feedItemId: string): Promise<boolean> => {
  const response = await api.delete<ApiResponse<boolean>>(`/feed/${feedItemId}/save`);
  return response.data.success;
};

export const reportFeedItem = async (feedItemId: string, reason: string): Promise<boolean> => {
  const response = await api.post<ApiResponse<boolean>>(`/feed/${feedItemId}/report`, { reason });
  return response.data.success;
};

export const getFeedSources = async (): Promise<FeedSource[]> => {
  const response = await api.get<ApiResponse<FeedSource[]>>('/feed/sources');
  return response.data.data || [];
};

export const toggleFeedSource = async (sourceId: string, enabled: boolean): Promise<boolean> => {
  const response = await api.put<ApiResponse<boolean>>(`/feed/sources/${sourceId}`, { enabled });
  return response.data.success;
};
