import React from 'react';
import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-between">
        <RegisterForm />
        <div className='w-1/2'>
          
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;