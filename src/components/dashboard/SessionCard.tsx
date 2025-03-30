/**
 * SessionCard component displays session information with actions.
 * Shows session details, status, and relevant action buttons based on session state.
 */
import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, CheckCircle } from 'lucide-react';
import { Session } from '../../types';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { getMenteeName } from '../../utils/sessionUtils';

interface SessionCardProps {
  /** Session data object */
  session: Session;
  /** Callback for confirming a pending session */
  onConfirm?: () => void;
  /** Callback for viewing the session thread */
  onViewThread?: () => void;
  /** Whether the session is currently being confirmed */
  isConfirming?: boolean;
}

export function SessionCard({ session, onConfirm, onViewThread, isConfirming }: SessionCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">
            Session with {getMenteeName(session.mentee)}
          </p>
          <StatusBadge status={session.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(session.start_time), 'PPp')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {session.status === 'pending' && onConfirm ? (
          <Button
            onClick={onConfirm}
            disabled={isConfirming}
            variant="primary"
            size="sm"
            icon={CheckCircle}
            loading={isConfirming}
          >
            {isConfirming ? 'Confirming...' : 'Confirm'}
          </Button>
        ) : session.status === 'confirmed' && (
          <>
            <Button
              variant="primary"
              size="sm"
            >
              Join Session
            </Button>
            {onViewThread && (
              <Button
                onClick={onViewThread}
                variant="secondary"
                size="sm"
                icon={MessageSquare}
              >
                View Thread
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}