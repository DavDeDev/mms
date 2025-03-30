/**
 * AvailabilityCalendar component displays a weekly calendar view with availability indicators.
 * Shows which days have available time slots and allows date selection.
 */
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Availability } from '../../types';

interface AvailabilityCalendarProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Array of dates representing the current week */
  weekDays: Date[];
  /** Array of availability slots */
  availabilities: Availability[];
  /** Callback function when a date is selected */
  onSelectDate: (date: Date) => void;
}

export function AvailabilityCalendar({ selectedDate, weekDays, availabilities, onSelectDate }: AvailabilityCalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      {weekDays.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => onSelectDate(date)}
          className={`
            p-4 text-center bg-white transition-all
            ${isSameDay(date, selectedDate)
              ? 'bg-orange-50 border-2 border-orange-500'
              : 'hover:bg-gray-50'
            }
          `}
        >
          <div className="text-xs text-gray-500 mb-1">
            {format(date, 'EEE')}
          </div>
          <div className={`text-lg font-semibold ${
            isSameDay(date, selectedDate) ? 'text-orange-500' : 'text-gray-900'
          }`}>
            {format(date, 'd')}
          </div>
          {availabilities.filter(slot => slot.day_of_week === date.getDay()).length > 0 && (
            <div className="mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}