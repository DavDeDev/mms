/**
 * StatusBadge component displays a colored badge indicating session status.
 * Uses consistent styling based on the session's current state.
 */
import React from 'react';
import { Session } from '../../types';
import { getStatusBadgeClass } from '../../utils/sessionUtils';

interface StatusBadgeProps {
  /** Current status of the session */
  status: Session['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
}