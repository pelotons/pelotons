import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
