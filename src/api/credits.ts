import api from '../utils/api';
import { CreditStats, CreditTransaction, ApiResponse } from '../types/credits';
import { User } from '../types/auth';

export const getCreditStats = async (): Promise<CreditStats> => {
  const response = await api.get<ApiResponse<CreditStats>>('/credits/stats');
  return response.data.data as CreditStats;
};

export const getTransactions = async (): Promise<CreditTransaction[]> => {
  const response = await api.get<ApiResponse<CreditTransaction[]>>('/credits/transactions');
  return response.data.data || [];
};

// Admin-specific endpoints
export const getUserCreditStats = async (userId: string): Promise<CreditStats> => {
  const response = await api.get<ApiResponse<CreditStats>>(`/admin/users/${userId}/credits`);
  return response.data.data as CreditStats;
};

export const adjustUserCredits = async (
  userId: string, 
  amount: number, 
  reason: string
): Promise<boolean> => {
  const response = await api.post<ApiResponse<boolean>>(`/admin/users/${userId}/credits`, {
    amount,
    reason
  });
  return response.data.success;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/admin/users');
  return response.data.data || [];
};