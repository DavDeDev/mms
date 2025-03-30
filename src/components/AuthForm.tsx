/**
 * Authentication form component that handles both sign-in and sign-up flows.
 * Provides a unified interface for user authentication with role selection,
 * form validation, and error handling.
 * 
 * Features:
 * - Toggle between sign-in and sign-up modes
 * - Role selection for new users (mentor/mentee)
 * - Real-time form validation
 * - Error handling and display
 * - Loading state management
 * - Responsive design
 * 
 * Props:
 * @param {boolean} defaultMode - Initial form mode (true for signup, false for signin)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogIn, UserPlus, Rocket, GraduationCap } from 'lucide-react';

interface AuthFormProps {
  defaultMode?: boolean;
}

export function AuthForm({ defaultMode = false }: AuthFormProps) {
  // Form state management
  const [isSignUp, setIsSignUp] = useState(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'mentor' | 'mentee'>('mentee');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hooks for authentication and navigation
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  /**
   * Handles form submission for both sign-in and sign-up flows.
   * Validates input, processes authentication, and handles errors.
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please fill in all required fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (isSignUp) {
        await signUp(email, password, role, fullName);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'An error occurred during authentication';
      
      if (error instanceof Error) {
        if (error.message.includes('invalid_credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            required
            minLength={6}
          />
          <p className="mt-1 text-sm text-gray-500">
            {isSignUp && 'Must be at least 6 characters long'}
          </p>
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I want to be a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('mentee')}
                className={`relative p-4 border-2 rounded-xl transition-all ${
                  role === 'mentee'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center">
                  <GraduationCap className="h-8 w-8 mb-2" />
                  <span className="font-medium">Mentee</span>
                  <p className="text-xs mt-1 text-center">
                    I want to learn and grow
                  </p>
                </div>
                {role === 'mentee' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`relative p-4 border-2 rounded-xl transition-all ${
                  role === 'mentor'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Rocket className="h-8 w-8 mb-2" />
                  <span className="font-medium">Mentor</span>
                  <p className="text-xs mt-1 text-center">
                    I want to guide others
                  </p>
                </div>
                {role === 'mentor' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              {isSignUp ? <UserPlus className="mr-2" size={20} /> : <LogIn className="mr-2" size={20} />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-sm text-orange-600 hover:text-orange-500 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}