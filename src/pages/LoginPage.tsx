import React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  
  console.log(location.pathname)
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)]  flex items-center justify-between">

        <LoginForm />
        <div className='w-1/2 '>
          
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;