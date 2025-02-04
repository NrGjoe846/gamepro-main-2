import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  skipAuth: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    settings: null,
    loading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ 
        ...prev, 
        session, 
        user: session?.user ?? null,
        isAuthenticated: !!session
      }));
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState(prev => ({ 
        ...prev, 
        session, 
        user: session?.user ?? null,
        isAuthenticated: !!session
      }));
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setState(prev => ({ ...prev, profile: null, settings: null }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      setState(prev => ({ 
        ...prev, 
        profile: profile ?? null,
        settings: settings ?? null,
        loading: false 
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('No user returned after signup');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, username }]);

    if (profileError) throw profileError;

    // Create settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert([{ user_id: user.id }]);

    if (settingsError) throw settingsError;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState(prev => ({
      ...prev,
      session: null,
      user: null,
      profile: null,
      settings: null,
      isAuthenticated: false
    }));
  };

  const skipAuth = () => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      loading: false
    }));
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const { user } = state;
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    await fetchUserData(user.id);
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const { user } = state;
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchUserData(user.id);
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      signOut,
      skipAuth,
      updateProfile,
      updateSettings,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
