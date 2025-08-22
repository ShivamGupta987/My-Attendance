import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  roll_number: string;
  branch: string;
  email: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session
        }));

        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            setAuthState(prev => ({
              ...prev,
              profile,
              isLoading: false
            }));
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null,
            isLoading: false
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session
      }));

      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setAuthState(prev => ({
              ...prev,
              profile,
              isLoading: false
            }));
          });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData: {
    fullName: string;
    rollNumber: string;
    branch: string;
    email: string;
    password: string;
  }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.fullName,
            roll_number: userData.rollNumber,
            branch: userData.branch
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        profile: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout
  };
};