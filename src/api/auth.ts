import api from '../utils/api';
import { LoginCredentials, RegisterData, User, AuthResponse } from '../types/auth';


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/user/login', credentials);
  return response.data;
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('///////////////////////////////////////////////////////////////')
    console.log(import.meta.env.VITE_API_BASE_URL,'/user/register', data , 'sending');
  
    const response = await api.post<AuthResponse>('/user/register', data);
    console.log(response.data, 'response data')
    return response.data;
  } catch (error:any) {
    console.log('error',error)
    console.error('API Error:', error?.response?.data || error.message);
    throw error; // Re-throw so it can be caught in context

  }

};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/user/me');
  return response.data;
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  const response = await api.put<User>('/auth/profile', profileData);
  return response.data;
};