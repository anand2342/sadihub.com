import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// Check all placeholder / template values that mean "not yet configured"
const PLACEHOLDER_URLS = [
    '', 'https://placeholder.supabase.co', 'https://your-project-id.supabase.co'
];
const PLACEHOLDER_KEY_SUBSTRINGS = [
    'your-anon-key-here', 'placeholder-key', 'placeholder'
];
export const isSupabaseConfigured = Boolean(supabaseUrl &&
    supabaseAnonKey &&
    !PLACEHOLDER_URLS.includes(supabaseUrl) &&
    supabaseUrl.includes('.supabase.co') &&
    !PLACEHOLDER_KEY_SUBSTRINGS.some(p => supabaseAnonKey.includes(p)) &&
    supabaseAnonKey.startsWith('eyJ') // Valid JWT anon key always starts with eyJ
);
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});
