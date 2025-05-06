import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true: false ,
  isLoading: false,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' | 'USER_LOADED' | 'AUTH_ERROR' | 'LOGOUT' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAIL' | 'REGISTER_FAIL'; payload: string }
  | { type: 'SET_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.data.token);
      
      console.log('token', action.payload.data.token)
      console.log('the item', localStorage.getItem('token'))
      return {
        ...state,
        user: action.payload.data.user,
        token: action.payload.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_USER':
      localStorage.setItem('userId', action.payload._id);
      console.log(action.payload, 'payloaddddd')
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const user = await getCurrentUser();
          console.log('now user  is', user);
          dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
console.log('no user found')
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
  }, [state.token]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    console.log('starting loging in')
    try {
      const response = await loginUser(credentials);
      console.log(response, 'response')
      if(!response.success){
        console.log(response.message, 'error message');
        throw new Error(response.message)
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error:any) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.error });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await registerUser(data);
      if(!response.success){
        console.log(response.message, 'error message');
        throw new Error(response.message)
      }
      dispatch({ type: 'REGISTER_SUCCESS', payload: response });
      
    } catch (error:any) {
      console.log('error occured',error, 'fromt ')
      dispatch({ type: 'REGISTER_FAIL', payload: error.error });
    }
  };
  

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider