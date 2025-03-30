/**
 * Main dashboard component that renders role-specific views.
 * Acts as a router to display either MentorDashboard or MenteeDashboard
 * based on the authenticated user's role.
 * 
 * Features:
 * - Role-based view switching
 * - Consistent layout wrapper
 * - Protected route integration
 */

import React from 'react';
import { useAuthStore } from '../store/authStore';
import { MentorDashboard } from './MentorDashboard';
import { MenteeDashboard } from './MenteeDashboard';
import { Layout } from './Layout';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <Layout>
      {user?.role === 'mentor' ? <MentorDashboard /> : <MenteeDashboard />}
    </Layout>
  );
}