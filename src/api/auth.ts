import api from '../utils/api';
import { LoginCredentials, RegisterData, User, AuthResponse } from '../types/auth';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  const response = await api.put<User>('/auth/profile', profileData);
  return response.data;
};