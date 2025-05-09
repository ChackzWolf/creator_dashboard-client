import React from 'react';
import Layout from '../../components/User/layout/Layout';
import RegisterForm from '../../components/User/auth/RegisterForm';
import LottiePlayer from '../../utils/lottie';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-between">
        <RegisterForm />
        <div className='w-1/2'>
        <LottiePlayer path="/lottie/makeDifference.json" />

        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;