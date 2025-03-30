/**
 * MentorSchedule component displays and manages a mentor's availability calendar.
 * Allows mentees to view available time slots and schedule sessions.
 * 
 * Features:
 * - Weekly calendar view with availability indicators
 * - Time slot selection and session scheduling
 * - Real-time availability updates
 * - Responsive design with modal display
 * 
 * State Management:
 * - Tracks selected date and time slots
 * - Manages loading and error states
 * - Handles real-time availability updates
 */
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar, Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MentorScheduleProps {
  /** ID of the mentor whose schedule is being viewed */
  mentorId: string;
  /** Display name of the mentor */
  mentorName: string;
  /** Function to call when closing the schedule modal */
  onClose: () => void;
  /** Function to call when scheduling a new session */
  onScheduleSession: (dayOfWeek: number, startTime: string, endTime: string) => void;
}

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export function MentorSchedule({ mentorId, mentorName, onClose, onScheduleSession }: MentorScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches mentor's availability slots for the selected date.
   * Updates availability list and handles loading/error states.
   */
  useEffect(() => {
    async function fetchMentorAvailability() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('availability')
          .select('*')
          .eq('mentor_id', mentorId)
          .eq('day_of_week', selectedDate.getDay())
          .order('start_time');

        if (error) throw error;
        setAvailabilities(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorAvailability();
  }, [mentorId, selectedDate]);

  /**
   * Generates an array of dates representing the current week.
   * Used for calendar display and date selection.
   * 
   * @returns Array of dates for the week
   */
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-3xl shadow-xl rounded-xl bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Schedule with {mentorName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a day and time slot for your mentoring session
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`
                  py-3 px-2 rounded-lg text-sm font-medium transition-all
                  ${isSameDay(date, selectedDate)
                    ? 'bg-orange-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <div className="text-xs mb-1">{format(date, 'EEE')}</div>
                <div className="text-lg">{format(date, 'd')}</div>
                <div className="text-xs mt-1">{format(date, 'MMM')}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Available Time Slots for {format(selectedDate, 'MMMM d, yyyy')}</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : availabilities.length === 0 ? (
            <div className="text-center bg-gray-50 rounded-lg p-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                No available time slots for {format(selectedDate, 'EEEE, MMMM d')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please select a different day or check back later
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {availabilities.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-900">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onScheduleSession(selectedDate.getDay(), slot.start_time, slot.end_time)}
                    className="w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 
                             transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                             flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule for {format(selectedDate, 'MMM d')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}