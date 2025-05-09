import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../utils/adminApi';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

//   Check for existing admin auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for admin token
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminToken) {
        //   Fetch admin profile using the token
          const response = await adminApi.get('/admin/profile');
        console.log(response, 'profile');
          if (response.data.success) {
            const admin  = {
                id: response.data.data._id,
                name: response.data.data.name,
                email: response.data.data.email
            }

            console.log('setting', admin)
            setAdmin(admin)

          } else {
            // Clear invalid token
            localStorage.removeItem('adminToken');
            setAdmin(null);
          }
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateReportStatus = async(reportId: string, status: string) => {
    setIsLoading(true)
    try {
        const response = await adminApi.post('/admin/update-report-status', {reportId,status});
        return response
    } catch (error:any) {
      return { 
        success: false, 
        error: error.error || 'Admin login failed' 
      };
    }finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<{success: boolean, error?: string}> => {
    setIsLoading(true);
    try {
      // Call your admin login API
      const response = await adminApi.post('/admin/login', {credentials });

      console.log(response.data.data, 'admin login response')

      const data = response.data.data


      // Save admin token
      localStorage.setItem('adminToken', data.token);
      
      // Set admin user
      setAdmin(data.admin);

      return { success: true };
    } catch (error: any) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        error: error.error || 'Admin login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('log out ')
    // Clear admin token
    localStorage.removeItem('adminToken');
    
    // Clear admin user
    setAdmin(null);
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    
  };
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};


export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};