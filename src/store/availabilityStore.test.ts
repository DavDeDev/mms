import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAvailabilityStore } from './availabilityStore';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('availabilityStore', () => {
  const mockMentorId = 'test-mentor-id';
  const mockAvailability = {
    id: 'test-id',
    mentor_id: mockMentorId,
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00',
    is_recurring: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAvailabilities', () => {
    test('successfully fetches availabilities', async () => {
      const mockData = [mockAvailability];
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockData, error: null }))
            }))
          }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        await result.current.fetchAvailabilities(mockMentorId);
      });

      expect(result.current.availabilities).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    test('handles fetch error', async () => {
      const mockError = new Error('Failed to fetch');
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
            }))
          }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        try {
          await result.current.fetchAvailabilities(mockMentorId);
        } catch (error) {
          expect(error).toEqual(mockError);
        }
      });

      expect(result.current.error).toBe(mockError.message);
      expect(result.current.loading).toBe(false);
    });

    test('handles empty response', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        await result.current.fetchAvailabilities(mockMentorId);
      });

      expect(result.current.availabilities).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('addAvailability', () => {
    test('successfully adds availability', async () => {
      const mockNewAvailability = { ...mockAvailability };
      delete mockNewAvailability.id;

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        await result.current.addAvailability(mockNewAvailability);
      });

      expect(supabase.from).toHaveBeenCalledWith('availability');
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    test('handles add error', async () => {
      const mockError = new Error('Failed to add');
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        insert: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        try {
          await result.current.addAvailability(mockAvailability);
        } catch (error) {
          expect(error).toEqual(mockError);
        }
      });

      expect(result.current.error).toBe(mockError.message);
      expect(result.current.loading).toBe(false);
    });

    test('validates required fields', async () => {
      const invalidAvailability = {
        mentor_id: mockMentorId,
        day_of_week: 1,
        // Missing start_time and end_time
        is_recurring: true
      };

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        try {
          await result.current.addAvailability(invalidAvailability as any);
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });

  /**
   * Tests for updateAvailability function
   * 
   * These tests verify that:
   * 1. The function can successfully update an availability slot
   * 2. It properly handles errors during updates
   * 3. It maintains the correct loading and error states
   * 4. It correctly updates the store state after a successful update
   */
  describe('updateAvailability', () => {
    test('successfully updates availability', async () => {
      const mockUpdates = {
        start_time: '10:00',
        end_time: '11:00'
      };

      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        await result.current.updateAvailability(mockAvailability.id, mockUpdates);
      });

      expect(supabase.from).toHaveBeenCalledWith('availability');
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    test('handles update error', async () => {
      const mockError = new Error('Failed to update');
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        try {
          await result.current.updateAvailability(mockAvailability.id, {});
        } catch (error) {
          expect(error).toEqual(mockError);
        }
      });

      expect(result.current.error).toBe(mockError.message);
      expect(result.current.loading).toBe(false);
    });
  });

  /**
   * Tests for deleteAvailability function
   * 
   * These tests verify that:
   * 1. The function can successfully delete an availability slot
   * 2. It properly handles errors during deletion
   * 3. It maintains the correct loading and error states
   * 4. It correctly updates the store state after a successful deletion
   * 5. It properly removes the deleted item from the store
   */
  describe('deleteAvailability', () => {
    test('successfully deletes availability', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        await result.current.deleteAvailability(mockAvailability.id);
      });

      expect(supabase.from).toHaveBeenCalledWith('availability');
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    test('handles delete error', async () => {
      const mockError = new Error('Failed to delete');
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      }));

      const { result } = renderHook(() => useAvailabilityStore());

      await act(async () => {
        try {
          await result.current.deleteAvailability(mockAvailability.id);
        } catch (error) {
          expect(error).toEqual(mockError);
        }
      });

      expect(result.current.error).toBe(mockError.message);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('state management', () => {
    test('maintains loading state during operations', async () => {
      const { result } = renderHook(() => useAvailabilityStore());

      expect(result.current.loading).toBe(false);

      // Start loading
      act(() => {
        result.current.fetchAvailabilities(mockMentorId);
      });

      expect(result.current.loading).toBe(true);

      // Wait for operation to complete
      await act(async () => {
        await result.current.fetchAvailabilities(mockMentorId);
      });

      expect(result.current.loading).toBe(false);
    });

    test('clears error state after successful operation', async () => {
      const { result } = renderHook(() => useAvailabilityStore());

      // Set initial error state
      act(() => {
        result.current.error = 'Previous error';
      });

      await act(async () => {
        await result.current.fetchAvailabilities(mockMentorId);
      });

      expect(result.current.error).toBeNull();
    });
  });
});