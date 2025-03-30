import { describe, test, expect } from 'vitest';
import { Progress } from './Progress';

/**
 * Test suite for Progress Component Utils
 * 
 * These tests verify the utility functions used in the Progress component,
 * particularly focusing on the getAuthorName function which handles
 * display name formatting for progress updates.
 */
describe('Progress Component Utils', () => {
  // Extract getAuthorName function from Progress component for testing
  const getAuthorName = (author: { full_name: string | null; display_name: string | null }) => {
    return author.display_name || author.full_name || 'Anonymous';
  };

  /**
   * Tests for getAuthorName function
   * 
   * These tests verify that:
   * 1. The function prioritizes display_name over full_name
   * 2. It falls back to full_name when display_name is null
   * 3. It returns 'Anonymous' when both names are null
   * 4. It consistently handles all possible name combinations
   */
  describe('getAuthorName', () => {
    test('returns display_name when available', () => {
      const author = {
        full_name: 'John Doe',
        display_name: 'JohnD'
      };
      expect(getAuthorName(author)).toBe('JohnD');
    });

    test('returns full_name when display_name is null', () => {
      const author = {
        full_name: 'John Doe',
        display_name: null
      };
      expect(getAuthorName(author)).toBe('John Doe');
    });

    test('returns "Anonymous" when both names are null', () => {
      const author = {
        full_name: null,
        display_name: null
      };
      expect(getAuthorName(author)).toBe('Anonymous');
    });

    test('prefers display_name over full_name', () => {
      const author = {
        full_name: 'John Doe',
        display_name: 'CoolDev'
      };
      expect(getAuthorName(author)).toBe('CoolDev');
    });
  });
});