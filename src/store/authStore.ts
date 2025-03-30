/**
 * Authentication store using Zustand.
 * Manages user authentication state and provides authentication-related actions.
 */
import { create } from 'zustand';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

/**
 * User interface representing an authenticated user's data
 */
interface User {
  id: string;
  email: string;
  role: 'mentor' | 'mentee';
  profileId: string;
  full_name?: string;
}

/**
 * Authentication store state and actions interface
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string, role: 'mentor' | 'mentee', fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserFromLocalStorage: () => Promise<void>;
}

/**
 * Authentication store implementation using Zustand
 * Handles user authentication, session management, and profile creation
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  
  // Set the current user
  setUser: (user) => set({ user }),

  /**
   * Sign up a new user and create their profile
   * @param email - User's email address
   * @param password - User's password
   * @param role - User's role (mentor/mentee)
   * @param fullName - User's full name (optional)
   */
  signUp: async (email, password, role, fullName) => {
    try {
      set({ loading: true, error: null });
      
      // Create auth user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user data returned after signup');

      // Create user profile
      const { error: profileError, data: profileData } = await supabase
        .from('profiles')
        .insert([{ 
          user_id: data.user.id, 
          role,
          full_name: fullName,
          display_name: fullName
        }])
        .select('id, role')
        .single();
      
      if (profileError) throw profileError;
      if (!profileData) throw new Error('No profile data returned after creation');

      const user = {
        id: data.user.id,
        email: data.user.email!,
        role: profileData.role,
        profileId: profileData.id,
        full_name: fullName
      };

      set({ user, error: null, loading: false });

      toast.success('Welcome to MMS!', {
        description: 'Please check your email to confirm your account (optional).',
        duration: 5000,
      });

    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  /**
   * Sign in an existing user
   * @param email - User's email address
   * @param password - User's password
   */
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const { error: signInError, data: authData } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      if (!authData.user) throw new Error('No user data returned after signin');

      // Get or create user profile
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('user_id', authData.user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;

      if (!profileData) {
        const role = authData.user.user_metadata.role as 'mentor' | 'mentee';
        if (!role) throw new Error('User role not found. Please sign up again.');

        const { error: createProfileError, data: newProfileData } = await supabase
          .from('profiles')
          .insert([{ 
            user_id: authData.user.id, 
            role 
          }])
          .select('id, role')
          .single();
        
        if (createProfileError) throw createProfileError;
        if (!newProfileData) throw new Error('Failed to create profile');

        profileData = newProfileData;
      }

      const user = {
        id: authData.user.id,
        email: authData.user.email!,
        role: profileData.role,
        profileId: profileData.id,
        full_name: profileData.full_name
      };

      set({ user, error: null, loading: false });

    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  /**
   * Sign out the current user and clean up session data
   */
  signOut: async () => {
    try {
      set({ loading: true, error: null });

      // Clear all auth-related data from local storage
      localStorage.clear();
      
      // Clear Supabase cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });

      // Set user to null before calling signOut to prevent race conditions
      set({ user: null, error: null, loading: false });

      // Finally, sign out from Supabase
      await supabase.auth.signOut();

    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  /**
   * Load user data from local storage and validate session
   */
  loadUserFromLocalStorage: async () => {
    try {
      set({ loading: true });

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        // No session found, clear any stale data
        localStorage.clear();
        set({ user: null, loading: false });
        return;
      }

      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('No profile found');

      const user = {
        id: session.user.id,
        email: session.user.email!,
        role: profileData.role,
        profileId: profileData.id,
        full_name: profileData.full_name
      };

      set({ user, loading: false });
      
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.clear();
      set({ user: null, error: (error as Error).message, loading: false });
    }
  }
}));