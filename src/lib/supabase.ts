/**
 * Supabase client configuration.
 * Creates and exports a Supabase client instance using environment variables.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client instance configured with environment variables.
 * Used for all database operations and authentication.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);