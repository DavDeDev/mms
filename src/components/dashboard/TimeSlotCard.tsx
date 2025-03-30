/**
 * TimeSlotCard component displays a single availability time slot with edit/delete actions.
 * Shows the time range and provides buttons for managing the slot.
 */
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface TimeSlotCardProps {
  /** Start time in HH:mm format */
  startTime: string;
  /** End time in HH:mm format */
  endTime: string;
  /** Callback for editing the time slot */
  onEdit: () => void;
  /** Callback for deleting the time slot */
  onDelete: () => void;
}

export function TimeSlotCard({ startTime, endTime, onEdit, onDelete }: TimeSlotCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-900">
          {startTime} - {endTime}
        </span>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
        >
          Edit
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}