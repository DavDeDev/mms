/**
 * Authentication page component that serves as the container for auth flows.
 * Handles routing parameters and displays appropriate authentication form.
 * 
 * Features:
 * - Dynamic header based on auth mode
 * - Responsive design with gradient background
 * - Seamless integration with AuthForm component
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from './AuthForm';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-xl text-gray-400">
          {mode === 'signin' 
            ? 'Sign in to continue your mentorship journey'
            : 'Join our community of mentors and mentees'
          }
        </p>
      </div>
      <AuthForm defaultMode={mode === 'signup'} />
    </div>
  );
}