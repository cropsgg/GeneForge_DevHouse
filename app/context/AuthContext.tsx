import React, { createContext, useEffect, useState, ReactNode } from 'react';

import { supabase } from '../supabaseClient';

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode; // Define the type for children
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null); // You can replace 'any' with a more specific type if needed

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    // No need to call unsubscribe, just remove the subscription
    return () => {
      // Clean up logic if needed, but no unsubscribe method to call
    };
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
