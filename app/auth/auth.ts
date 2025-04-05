import { supabase } from '../supabaseClient';

export const signUp = async (email: string, password: string, username?: string) => {
  // First, sign up the user
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        username: username || email.split('@')[0], // Use username if provided, otherwise use part of email
      }
    }
  });
  
  // If we have a user and no error, we can consider the signup successful
  return { user: data?.user, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
