/**
 * This file documents and implements the core algorithms used in the Mentorship Management System.
 */

import { addDays, startOfDay, parse, isAfter, startOfWeek, isSameDay } from 'date-fns';
import { Session, Availability } from '../types';

/**
 * Session Scheduling Algorithm
 * 
 * Calculates the next occurrence of a selected day and time slot.
 * Uses a rolling window approach to find the next available date.
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @param dayOfWeek - Target day of week (0-6, where 0 is Sunday)
 * @param startTime - Start time in HH:mm:ss format
 * @param endTime - End time in HH:mm:ss format
 * @returns Object containing start and end DateTime
 */
export function calculateNextSessionTime(
  dayOfWeek: number,
  startTime: string,
  endTime: string
): { startDateTime: Date; endDateTime: Date } {
  const today = new Date();
  const daysUntilNext = (dayOfWeek - today.getDay() + 7) % 7;
  const nextOccurrence = addDays(startOfDay(today), daysUntilNext);

  return {
    startDateTime: parse(startTime, 'HH:mm:ss', nextOccurrence),
    endDateTime: parse(endTime, 'HH:mm:ss', nextOccurrence)
  };
}

/**
 * Session Filtering Algorithm
 * 
 * Filters sessions based on their status and timing.
 * Uses temporal comparison to determine upcoming and past sessions.
 * 
 * Time Complexity: O(n) where n is the number of sessions
 * Space Complexity: O(n) for the filtered array
 * 
 * @param sessions - Array of sessions to filter
 * @returns Object containing upcoming and completed sessions
 */
export function filterSessions(sessions: Session[]) {
  const now = new Date();
  
  return {
    upcoming: sessions.filter(session => 
      isAfter(new Date(session.start_time), now) && 
      ['pending', 'confirmed'].includes(session.status)
    ),
    completed: sessions.filter(session => 
      session.status === 'completed'
    )
  };
}

/**
 * Weekly Calendar Generation Algorithm
 * 
 * Generates an array of dates representing the current week.
 * Uses date-fns functions to handle date calculations and comparisons.
 * 
 * Time Complexity: O(1) - always generates 7 days
 * Space Complexity: O(1) - fixed size array
 * 
 * @param baseDate - Date to use as reference for the week
 * @returns Array of 7 dates representing the week
 */
export function generateWeekDays(baseDate: Date): Date[] {
  const start = startOfWeek(baseDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Availability Filtering Algorithm
 * 
 * Filters availability slots for a specific day.
 * Matches day of week and sorts by start time.
 * 
 * Time Complexity: O(n) where n is the number of availability slots
 * Space Complexity: O(n) for the filtered array
 * 
 * @param availabilities - Array of availability slots
 * @param date - Target date to filter for
 * @returns Filtered and sorted availability slots
 */
export function filterAvailabilityByDate(
  availabilities: Availability[],
  date: Date
): Availability[] {
  return availabilities
    .filter(slot => slot.day_of_week === date.getDay())
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
}

/**
 * Date Comparison Algorithm
 * 
 * Determines if two dates represent the same calendar day.
 * Ignores time component in comparison.
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @param dateA - First date to compare
 * @param dateB - Second date to compare
 * @returns Boolean indicating if dates are the same calendar day
 */
export function isSameCalendarDay(dateA: Date, dateB: Date): boolean {
  return isSameDay(dateA, dateB);
}

/**
 * Unique ID Generation Algorithm
 * 
 * Generates a unique identifier for optimistic updates.
 * Uses the native crypto API for secure random values.
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @returns A unique string identifier
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}