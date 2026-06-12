import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test Supabase connectivity
export const testSupabaseConnectivity = async () => {
  try {
    console.log('Testing Supabase connectivity...');
    const { data, error } = await supabase.from('notes').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connectivity test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connectivity test passed');
    return { success: true };
  } catch (error) {
    console.error('Supabase connectivity test failed:', error);
    return { success: false, error: error.message };
  }
};

export default supabase;
