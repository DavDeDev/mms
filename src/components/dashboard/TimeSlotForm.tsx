/**
 * TimeSlotForm component for adding or editing availability time slots.
 * Provides inputs for start and end times with validation.
 */
import React from 'react';
import { Button } from '../common/Button';

interface TimeSlotFormProps {
  /** Start time in HH:mm format */
  startTime: string;
  /** End time in HH:mm format */
  endTime: string;
  /** Callback for start time changes */
  onStartTimeChange: (time: string) => void;
  /** Callback for end time changes */
  onEndTimeChange: (time: string) => void;
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel button handler */
  onCancel: () => void;
}

export function TimeSlotForm({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSubmit,
  onCancel
}: TimeSlotFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
        <span>to</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
        <div className="flex space-x-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}