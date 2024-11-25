import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

interface AuthContextType {
  user: User | null;
  profile: Database['public']['Tables']['profiles']['Row'] | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile found:', data);
        setProfile(data);
      } else {
        console.log('No profile found, creating new profile');
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfile = {
            id: userData.user.id,
            email: userData.user.email!,
            full_name: userData.user.user_metadata.full_name || '',
            role: 'driver',
            company_name: '',
            phone: '',
            created_at: new Date().toISOString()
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        
        if (session?.user) {
          setUser(session.user);
          await getProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await getProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};