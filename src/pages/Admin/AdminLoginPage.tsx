import React from "react";
import AdminLoginForm from "../../components/Admin/auth/AdminLoginForm";


const AdminLoginPage: React.FC= () => {
  
  return (
      <div className="min-h-[calc(100vh-4rem)]  flex items-center  justify-center">
        <AdminLoginForm/>
    </div>
  );
};

export default AdminLoginPage;