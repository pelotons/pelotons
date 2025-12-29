import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path strokeWidth="2" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          <span className="text-3xl font-bold text-gray-900">Peloton</span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg mx-auto" style={{ minWidth: '400px' }}>
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Configure your bike computer from anywhere
      </p>
    </div>
  );
}
