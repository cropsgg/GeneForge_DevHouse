import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aoqabfyfhwsguxecqoqn.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcWFiZnlmaHdzZ3V4ZWNxb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjI5NzIsImV4cCI6MjA1OTA5ODk3Mn0.4TpBWCWyG-WaKg4ToyKyLdryrT6Pk4XCq7QjqFlfCU8'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
