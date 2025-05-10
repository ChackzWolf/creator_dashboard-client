import adminApi from "../utils/adminApi";

export const updateReportStatus = async(reportId: string, status: string) => {
    try {
        const response = await adminApi.post('/admin/update-report-status', {reportId,status});
        return response.data.data
    } catch (error:any) {
      return { 
        success: false, 
        error: error.error || 'Admin login failed' 
      };
    }
}

export const getUsers = async(search:any = null) => {
  try {
    const response = await adminApi.get('/admin/users', {
      params: {search}
    });
    return response.data.data;
  } catch (error:any) {
    return { 
      success: false, 
      error: error.error || 'Admin login failed' 
    };
  }
}

export const toggleBlockUser = async(userId:string) => {
  try {
    const response = await adminApi.post('/admin/toggle-block-user', {userId});
    return response.data;
  } catch (error:any) {
    return { 
      success: false, 
      error: error.error || 'Admin login failed' 
    };
  }
}