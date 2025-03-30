/**
 * Test suite for core algorithm implementations
 * 
 * These tests verify the functionality of critical algorithms used throughout
 * the application for session scheduling, filtering, and date calculations.
 */
import { describe, test, expect } from 'vitest';
import { filterSessions, calculateNextSessionTime } from './algorithms';
import { Session } from '../types';
import { addDays, subDays, format } from 'date-fns';

/**
 * Tests for filterSessions function
 * 
 * Verifies that the session filtering algorithm correctly:
 * - Separates upcoming and completed sessions
 * - Handles date-based filtering
 * - Processes session status correctly
 * - Maintains proper ordering
 */
describe('filterSessions', () => {
  const now = new Date();
  const tomorrow = addDays(now, 1);
  const yesterday = subDays(now, 1);

  // Mock session data for testing
  const mockSessions: Session[] = [
    {
      id: '1',
      mentee: {
        id: 'mentee1',
        full_name: 'John Doe',
        display_name: 'John'
      },
      start_time: tomorrow.toISOString(),
      end_time: addDays(tomorrow, 1).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      mentee: {
        id: 'mentee2',
        full_name: 'Jane Smith',
        display_name: 'Jane'
      },
      start_time: yesterday.toISOString(),
      end_time: now.toISOString(),
      status: 'completed'
    },
    {
      id: '3',
      mentee: {
        id: 'mentee3',
        full_name: 'Bob Wilson',
        display_name: 'Bob'
      },
      start_time: tomorrow.toISOString(),
      end_time: addDays(tomorrow, 1).toISOString(),
      status: 'confirmed'
    }
  ];

  test('correctly filters upcoming sessions', () => {
    const { upcoming } = filterSessions(mockSessions);
    expect(upcoming).toHaveLength(2);
    expect(upcoming.map(s => s.id)).toEqual(['1', '3']);
    expect(upcoming.every(s => ['pending', 'confirmed'].includes(s.status))).toBe(true);
  });

  test('correctly filters completed sessions', () => {
    const { completed } = filterSessions(mockSessions);
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe('2');
    expect(completed[0].status).toBe('completed');
  });

  test('handles empty session array', () => {
    const { upcoming, completed } = filterSessions([]);
    expect(upcoming).toHaveLength(0);
    expect(completed).toHaveLength(0);
  });
});

/**
 * Tests for calculateNextSessionTime function
 * 
 * Verifies that the session scheduling algorithm correctly:
 * - Calculates next occurrence of a given day
 * - Handles time parsing and formatting
 * - Manages week rollovers properly
 * - Maintains time zone consistency
 */
describe('calculateNextSessionTime', () => {
  test('calculates correct next session time for same day', () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startTime = '14:00:00';
    const endTime = '15:00:00';

    const { startDateTime, endDateTime } = calculateNextSessionTime(dayOfWeek, startTime, endTime);

    expect(startDateTime.getDay()).toBe(dayOfWeek);
    expect(format(startDateTime, 'HH:mm:ss')).toBe(startTime);
    expect(format(endDateTime, 'HH:mm:ss')).toBe(endTime);
  });

  test('calculates correct next session time for future day', () => {
    const today = new Date();
    const targetDay = (today.getDay() + 2) % 7; // Two days from now
    const startTime = '10:00:00';
    const endTime = '11:00:00';

    const { startDateTime, endDateTime } = calculateNextSessionTime(targetDay, startTime, endTime);

    expect(startDateTime.getDay()).toBe(targetDay);
    expect(format(startDateTime, 'HH:mm:ss')).toBe(startTime);
    expect(format(endDateTime, 'HH:mm:ss')).toBe(endTime);
  });

  test('handles week rollover correctly', () => {
    const today = new Date();
    const targetDay = (today.getDay() + 6) % 7; // Six days from now
    const startTime = '09:00:00';
    const endTime = '10:00:00';

    const { startDateTime, endDateTime } = calculateNextSessionTime(targetDay, startTime, endTime);

    expect(startDateTime.getDay()).toBe(targetDay);
    expect(format(startDateTime, 'HH:mm:ss')).toBe(startTime);
    expect(format(endDateTime, 'HH:mm:ss')).toBe(endTime);
    expect(startDateTime > today).toBe(true);
  });
});