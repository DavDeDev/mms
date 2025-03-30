import { create } from 'zustand';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Availability } from '../types';

interface AvailabilityState {
  availabilities: Availability[];
  loading: boolean;
  error: string | null;
  fetchAvailabilities: (mentorId: string) => Promise<void>;
  addAvailability: (availability: Omit<Availability, 'id'>) => Promise<void>;
  updateAvailability: (id: string, updates: Partial<Availability>) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  availabilities: [],
  loading: false,
  error: null,

  fetchAvailabilities: async (mentorId: string) => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching availabilities for mentor:', mentorId);
      
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      set({ availabilities: data || [] });
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addAvailability: async (availability) => {
    try {
      set({ loading: true, error: null });
      console.log('Adding availability:', availability);
      
      const { error } = await supabase
        .from('availability')
        .insert([availability]);

      if (error) throw error;
      
      toast.success('Availability added successfully');
      
      // Refresh the availabilities list
      await get().fetchAvailabilities(availability.mentor_id);
    } catch (error) {
      console.error('Error adding availability:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to add availability');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateAvailability: async (id: string, updates: Partial<Availability>) => {
    try {
      set({ loading: true, error: null });
      console.log('Updating availability:', id, updates);
      
      const { error } = await supabase
        .from('availability')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Availability updated successfully');

      // Get the mentor_id from the current availabilities
      const availability = get().availabilities.find(a => a.id === id);
      if (availability) {
        await get().fetchAvailabilities(availability.mentor_id);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to update availability');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteAvailability: async (id: string) => {
    try {
      set({ loading: true, error: null });
      console.log('Deleting availability:', id);
      
      // Get the mentor_id before deleting
      const availability = get().availabilities.find(a => a.id === id);
      
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Availability deleted successfully');

      // Refresh the availabilities list if we have the mentor_id
      if (availability) {
        await get().fetchAvailabilities(availability.mentor_id);
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to delete availability');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));