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
      console.log('Auth state changed:', event);
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

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
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user returned after signup');

    try {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: user.id, 
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      // Create settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert([{ 
          user_id: user.id,
          theme: 'dark',
          notifications_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (settingsError) throw settingsError;

    } catch (error) {
      // If profile/settings creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(user.id);
      throw error;
    }
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

  const updateProfile = async (updates: Partial<Profile>) => {
    const { user } = state;
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;
    await fetchUserData(user.id);
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const { user } = state;
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('user_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
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
