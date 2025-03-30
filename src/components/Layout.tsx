/**
 * Main layout component that provides the application shell.
 * Handles navigation, user authentication state, and consistent styling
 * across all authenticated pages.
 * 
 * Features:
 * - Responsive navigation bar
 * - User authentication status
 * - Sign out functionality
 * - Mobile-friendly design
 * - Consistent padding and max-width constraints
 * 
 * Props:
 * @param {React.ReactNode} children - Content to render within the layout
 */
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Calendar, Users, Clock, Settings } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  // Hooks for authentication and navigation
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles user sign out and navigation.
   * Clears authentication state and redirects to home page.
   */
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold text-white">MMS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className={`${
                    location.pathname === '/dashboard'
                      ? 'border-orange-500 text-white'
                      : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <div
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  <Calendar className="h-5 w-5 mr-1" />
                  Schedule
                </div>
                <div
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  <Users className="h-5 w-5 mr-1" />
                  Sessions
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={handleSignOut}
                  className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
              <div className="ml-4">
                <div
                  className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none cursor-pointer"
                >
                  <Settings className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}