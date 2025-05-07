interface LoginCredentials {
    email: string;
    password: string;
  }
  
  interface AdminAuthResponse {
    success: boolean;
    token?: string;
    admin?: {
      id: string;
      email: string;
      name?: string;
    };
    error?: string;
  }
  
  // Admin login API call
  export const adminLogin = async (credentials: LoginCredentials): Promise<AdminAuthResponse> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Admin login failed'
        };
      }
  
      return {
        success: true,
        token: data.token,
        admin: data.admin
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Admin login failed'
      };
    }
  };
  
  // Admin logout
  export const adminLogout = (): void => {
    localStorage.removeItem('adminToken');
  };
  
  // Get admin profile
  export const getAdminProfile = async (): Promise<AdminAuthResponse> => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        return {
          success: false,
          error: 'No admin token found'
        };
      }
      
      const response = await fetch('/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to get admin profile'
        };
      }
  
      return {
        success: true,
        admin: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get admin profile'
      };
    }
  };