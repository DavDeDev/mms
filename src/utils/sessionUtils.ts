/**
 * Utility functions for handling session-related operations
 */

import { Session } from '../types';

/**
 * Get the appropriate CSS classes for a session status badge
 * @param status - The session status
 * @returns CSS classes for styling the status badge
 */
export const getStatusBadgeClass = (status: Session['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get the display name for a mentee
 * @param mentee - The mentee object containing name information
 * @returns The mentee's display name, falling back to "Anonymous Mentee" if no name is available
 */
export const getMenteeName = (mentee: { full_name: string | null; display_name: string | null }) => {
  return mentee.full_name || mentee.display_name || 'Anonymous Mentee';
};