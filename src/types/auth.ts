export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    profileCompleted: boolean;
    createdAt: string;
    profilePicture?: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
export interface AuthResponse {
  success: boolean;
  data: {
    user: User,
    token:string;
  };
  message: string;
  error?: string;  // Optional in case of an error response
}