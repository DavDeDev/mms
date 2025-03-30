import { describe, test, expect } from 'vitest';
import { getStatusBadgeClass, getMenteeName } from './sessionUtils';
import { Session } from '../types';

/**
 * Test suite for session utility functions
 * 
 * These tests verify the core utility functions used throughout
 * the application for handling session-related data and formatting.
 */
describe('sessionUtils', () => {
  /**
   * Tests for getStatusBadgeClass function
   * 
   * These tests verify that:
   * 1. The function returns the correct CSS classes for each session status
   * 2. It handles all possible status values
   * 3. It provides appropriate visual feedback through class names
   * 4. It returns a default class for unknown status values
   */
  describe('getStatusBadgeClass', () => {
    test('returns correct class for pending status', () => {
      expect(getStatusBadgeClass('pending')).toBe('bg-yellow-100 text-yellow-800');
    });

    test('returns correct class for confirmed status', () => {
      expect(getStatusBadgeClass('confirmed')).toBe('bg-green-100 text-green-800');
    });

    test('returns correct class for completed status', () => {
      expect(getStatusBadgeClass('completed')).toBe('bg-orange-100 text-orange-800');
    });

    test('returns correct class for cancelled status', () => {
      expect(getStatusBadgeClass('cancelled')).toBe('bg-red-100 text-red-800');
    });

    test('returns default class for unknown status', () => {
      expect(getStatusBadgeClass('unknown' as Session['status'])).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getMenteeName', () => {
    test('returns full name when available', () => {
      const mentee = {
        full_name: 'John Doe',
        display_name: null
      };
      expect(getMenteeName(mentee)).toBe('John Doe');
    });

    test('returns display name when full name is null', () => {
      const mentee = {
        full_name: null,
        display_name: 'JohnD'
      };
      expect(getMenteeName(mentee)).toBe('JohnD');
    });

    test('returns "Anonymous Mentee" when both names are null', () => {
      const mentee = {
        full_name: null,
        display_name: null
      };
      expect(getMenteeName(mentee)).toBe('Anonymous Mentee');
    });
  });
});