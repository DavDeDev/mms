/**
 * WelcomeHeader component displays a personalized welcome message and session statistics.
 * Renders differently based on user role (mentor/mentee).
 */
import React from 'react';
import { User } from '../../types';

interface WelcomeHeaderProps {
  /** Current user object */
  user: User | null;
  /** Number of pending sessions */
  pendingSessionsCount: number;
  /** Number of upcoming sessions */
  upcomingSessionsCount: number;
}

export function WelcomeHeader({ user, pendingSessionsCount, upcomingSessionsCount }: WelcomeHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, {user?.full_name || (user?.role === 'mentor' ? 'Mentor' : 'Mentee')}
      </h1>
      <p className="text-gray-300">
        {user?.role === 'mentor' ? (
          <>
            You have {pendingSessionsCount} pending sessions and{' '}
            {upcomingSessionsCount} upcoming sessions.
          </>
        ) : (
          'Track your progress and connect with mentors to achieve your goals.'
        )}
      </p>
    </div>
  );
}