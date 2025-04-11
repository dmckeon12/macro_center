import React from 'react';
import { Link } from 'react-router-dom';
import AuthForms from '../components/AuthForms';
import Footer from '../components/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
          <AuthForms type="login" />
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
